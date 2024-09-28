const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql2');  // MySQL2 package
const PORT = require('../frontend/src/serverPort');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = fs.readFileSync('../openai_api_key.txt', 'utf8').trim();
let assistantId = null; // Store the assistant_id after creation

// Database configuration using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + db.threadId);
});


// Logging function to calculate API cost
const logApiCost = (tokensUsed, role) => {
  const inputCost = 0.150 / 1000;
  const outputCost = 0.600 / 1000;
  const totalCost = role === 'user' ? tokensUsed * inputCost : tokensUsed * outputCost;

  console.log(
    `Estimated cost for ${tokensUsed} ${role === 'user' ? 'input' : 'output'} tokens: $${totalCost.toFixed(6)}`
  );
};
// Function to create the assistant
const createAssistant = async () => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/assistants',
      {
        name: 'AI Personal Trainer',
        instructions:
          'You are a personal trainer. Help users with workout routines, fitness goals, and diet plans.',
        model: 'gpt-3.5-turbo', // Updated model name
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2', // Ensure beta access
        },
      }
    );
    assistantId = response.data.id;
    console.log(`Assistant created with ID: ${assistantId}`);
  } catch (error) {
    console.error('Error creating assistant:', error.response ? error.response.data : error.message);
  }
};

// Middleware to check if the assistant exists, and create if not
app.use(async (req, res, next) => {
  if (!assistantId) {
    console.log('Creating a new assistant...');
    await createAssistant();
  }
  next();
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    console.log(`Received user message: ${message}`);

    // Create a thread
    const threadResponse = await axios.post(
      'https://api.openai.com/v1/threads',
      {},
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      }
    );
    const threadId = threadResponse.data.id;
    console.log(`Thread created with ID: ${threadId}`);

    // Add a user message to the thread
    const userMessageResponse = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        role: 'user',
        content: message,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      }
    );

    const userMessageTokens = userMessageResponse.data.usage ? userMessageResponse.data.usage.total_tokens : 0;
    logApiCost(userMessageTokens, 'user');

    // Run the assistant and get a response
    const runResponse = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        assistant_id: assistantId, // Include assistant_id in the request body
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      }
    );

    const runId = runResponse.data.id;
    let runStatus = runResponse.data.status;
    console.log(`Run created with ID: ${runId}, initial status: ${runStatus}`);

    const maxPollTime = 15000; // 15 seconds
    const pollInterval = 1000; // 1 second polling
    let pollTime = 0;
    
    while (runStatus !== 'completed' && runStatus !== 'failed' && pollTime < maxPollTime) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval)); 
      pollTime += pollInterval;
    
      const runStatusResponse = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        }
      );
      runStatus = runStatusResponse.data.status;
      console.log(`Run status: ${runStatus}`);
    }
    // Handle run failure
    if (runStatus === 'failed') {
      console.error('Run failed');
      const runDetailsResponse = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        }
      );
      const runError = runDetailsResponse.data.error || 'Unknown error';
      console.error('Run error details:', runError);
      return res.status(500).json({ error: 'Assistant run failed', details: runError });
    }

    // Fetch the assistant's reply after completion
    const messagesResponse = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      }
    );

    const messages = messagesResponse.data.data;
    if (!messages || !messages.length) {
      throw new Error('No messages found in the response');
    }

    // Find the assistant's reply
    const assistantMessage = messages.find((msg) => msg.role === 'assistant');
    if (!assistantMessage) {
      throw new Error('No assistant response found');
    }

    // Process content if it's an array and remove conversational elements
    let aiResponse = '';

    if (Array.isArray(assistantMessage.content)) {
      aiResponse = assistantMessage.content
        .map(item => item.text?.value || '')
        .join('')
        .replace(/Remember.+/g, ''); // Remove conversational parts like "Remember"
    } else if (typeof assistantMessage.content === 'string') {
      aiResponse = assistantMessage.content.replace(/Remember.+/g, '');
    } else {
      aiResponse = JSON.stringify(assistantMessage.content);
    }

    const aiResponseTokens = messagesResponse.data.usage ? messagesResponse.data.usage.total_tokens : 0;
    logApiCost(aiResponseTokens, 'ai');

    console.log('AI response:', aiResponse);

    // Format the response for better readability
    const formattedResponse = aiResponse
      .replace(/Day/g, '\nDay')
      .replace(/Meal Plan:/g, '\n\nMeal Plan:\n')
      .replace(/Workout Plan:/g, '\n\nWorkout Plan:\n');

    res.json({ message: formattedResponse });
  } catch (error) {
    console.error('Error processing chat:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error processing chat' });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
