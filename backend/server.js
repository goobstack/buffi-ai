const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');  // bcrypt for password hashing
const jwt = require('jsonwebtoken');
const PORT = require('../frontend/src/serverPort');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = fs.readFileSync('../../aws crds/openai_api_key.txt', 'utf8').trim();

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

// Authenticate token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Token is required' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user; // Attach the user information to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// ChatGPT API interaction route with authentication
app.post('/api/chat', authenticateToken, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    // Fetch user's profile information
    const [userRows] = await db.promise().query(
      `SELECT height_cm, weight_kg, body_fat_percentage, gender, primary_goal, secondary_goal
       FROM Users WHERE user_id = ?`,
      [userId]
    );

    const userInfo = userRows[0];

    // Construct system content with user information
    let systemContent = `The user has the following information:
- Height: ${userInfo.height_cm || 'Not provided'} cm
- Weight: ${userInfo.weight_kg || 'Not provided'} kg
- Body Fat Percentage: ${userInfo.body_fat_percentage || 'Not provided'}%
- Gender: ${userInfo.gender || 'Not provided'}
- Primary Fitness Goal: ${userInfo.primary_goal || 'Not provided'}
- Secondary Fitness Goal: ${userInfo.secondary_goal || 'Not provided'}

Use this information to create detailed and personalized meal and workout plans for the user.

**Instructions:**
- **Meal Plan**: Provide a comprehensive meal plan including daily meals for at least one week. Include specific meal items, portion sizes, and nutritional information if possible.
- **Workout Plan**: Provide a detailed workout regimen covering exercises, sets, reps, rest periods, and schedules for at least one week.

When providing meal plans or workout plans, please format your response in JSON with the following structure:

For Meal Plans:
<plan>{
  "planType": "meal",
  "name": "Plan Name",
  "description": "Plan Description",
  "diet_type": "Diet Type",
  "calorie_goal": 2000,
  "meals": [
    {
      "day": 1,
      "meal_time": "Breakfast",
      "meal": "Oatmeal with berries and almonds"
    }
    // ... more meals
  ]
}</plan>

For Workout Plans:
<plan>{
  "planType": "workout",
  "name": "Plan Name",
  "description": "Plan Description",
  "goal": "Fitness Goal",
  "level": "Beginner/Intermediate/Advanced",
  "duration_weeks": 8,
  "workouts": [
    {
      "day": 1,
      "exercises": [
        {
          "name": "Squats",
          "sets": 3,
          "reps": 12
        }
        // ... more exercises
      ]
    }
    // ... more workout days
  ]
}</plan>

Provide the plan in JSON format enclosed within <plan></plan> tags. Do not include any additional text within the <plan> tags.`;

    console.log(`Received user message: ${message}`);

    // Prepare messages for the assistant
    const messages = [
      { role: 'system', content: systemContent },
      { role: 'user', content: message },
    ];

    // Call the OpenAI API
    const assistantResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1500, // Allow longer responses
        temperature: 0.7, // Adjust for creativity
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const aiMessage = assistantResponse.data.choices[0].message.content;

    console.log('AI response:', aiMessage);

    // Extract all plan data from the response
    let planDataArray = [];
    const planMatches = aiMessage.match(/<plan>([\s\S]*?)<\/plan>/g);

    if (planMatches) {
      for (const planMatch of planMatches) {
        const planContentMatch = planMatch.match(/<plan>([\s\S]*?)<\/plan>/);
        if (planContentMatch && planContentMatch[1]) {
          try {
            const planData = JSON.parse(planContentMatch[1]);
            planDataArray.push(planData);
          } catch (e) {
            console.error('Error parsing plan data:', e);
          }
        }
      }
    }

    res.json({ message: aiMessage, planData: planDataArray });
  } catch (error) {
    console.error('Error processing chat:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error processing chat' });
  }
});

// Route to save the recommended plan
app.post('/api/savePlan', authenticateToken, async (req, res) => {
  const {
    planType, name, description, diet_type, calorie_goal, goal, level, duration_weeks, meals, workouts
  } = req.body;
  const userId = req.user.id;

  try {
    if (planType === 'meal') {
      // Save Meal Plan
      const query = `INSERT INTO MealPlans (name, description, diet_type, calorie_goal)
                     VALUES (?, ?, ?, ?)`;
      const [result] = await db.promise().query(query, [name, description, diet_type, calorie_goal]);
      const mealPlanId = result.insertId;

      // Link Meal Plan to User
      await db.promise().query(
        `INSERT INTO UserMealPlans (user_id, meal_plan_id, start_date)
         VALUES (?, ?, CURDATE())`,
        [userId, mealPlanId]
      );

      // Optionally, save meal details into another table if you have one
      // For example: MealDetails table

      res.status(200).json({ message: 'Meal plan saved successfully' });
    } else if (planType === 'workout') {
      // Save Workout Regimen
      const query = `INSERT INTO WorkoutRegimens (name, description, goal, level, duration_weeks)
                     VALUES (?, ?, ?, ?, ?)`;
      const [result] = await db.promise().query(query, [name, description, goal, level, duration_weeks]);
      const regimenId = result.insertId;

      // Link Workout Regimen to User
      await db.promise().query(
        `INSERT INTO UserRegimens (user_id, regimen_id, start_date)
         VALUES (?, ?, CURDATE())`,
        [userId, regimenId]
      );

      // Optionally, save workout details into another table if you have one
      // For example: WorkoutDetails table

      res.status(200).json({ message: 'Workout plan saved successfully' });
    } else {
      res.status(400).json({ message: 'Invalid plan type' });
    }
  } catch (error) {
    console.error('Error saving plan:', error);
    res.status(500).json({ message: 'Error saving plan' });
  }
});

// Sign up route
app.post('/signup', async (req, res) => {
  const { name, email, password, dateOfBirth, gender } = req.body;

  try {
    const [userExists] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO Users (name, email, password_hash, date_of_birth, gender) VALUES (?, ?, ?, ?, ?)`;
    await db.promise().query(query, [name, email, hashedPassword, dateOfBirth, gender]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userResult] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
    const user = userResult[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate a JWT token with the user information
    const token = jwt.sign(
      {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token to the client
    res.status(200).json({
      message: 'Login successful',
      token, // Send the token to the frontend
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Route to fetch user profile data
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details from the database
    const [rows] = await db.promise().query('SELECT * FROM Users WHERE user_id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Fetched from DB:', rows[0]); // Debug log to check the data from DB
    res.status(200).json(rows[0]); // Return user profile data
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile data' });
  }
});

// Route to update user profile data
app.put('/profile', authenticateToken, async (req, res) => {
  const {
    name, email, dateOfBirth, gender,
    height, weight, bodyFatPercentage, musclePercentage,
    targetWeight, targetBodyFatPercentage, targetMusclePercentage,
    primaryGoal, secondaryGoal, weeklyWorkoutFrequency, preferredWorkoutType,
    dietType, calorieIntakeGoal, allergies
  } = req.body;

  const userId = req.user.id;

  try {
    const query = `
      UPDATE Users
      SET name = ?, email = ?, date_of_birth = ?, gender = ?, height_cm = ?, weight_kg = ?,
          body_fat_percentage = ?, muscle_percentage = ?, target_weight_kg = ?,
          target_body_fat_percentage = ?, target_muscle_percentage = ?, primary_goal = ?,
          secondary_goal = ?, weekly_workout_frequency = ?, preferred_workout_type = ?, diet_type = ?,
          calorie_intake_goal = ?
      WHERE user_id = ?
    `;

    console.log('Updating profile data:', req.body); // Debug log for profile data being updated
    await db.promise().query(query, [
      name, email, dateOfBirth, gender, height, weight, bodyFatPercentage, musclePercentage,
      targetWeight, targetBodyFatPercentage, targetMusclePercentage, primaryGoal,
      secondaryGoal, weeklyWorkoutFrequency, preferredWorkoutType, dietType, calorieIntakeGoal, userId
    ]);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
