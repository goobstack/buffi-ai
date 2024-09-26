import React, { useState } from 'react';
import { Button } from "../common/Button.tsx";
import { Card, CardContent } from "../common/Card.tsx";
import { Check } from 'lucide-react';
import NavBar from '../common/NavBar.tsx'; // Import NavBar component
import '../styles/mealPlan.css'; // Import the CSS file

export default function MealPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const mealPlans = [
    { id: 1, name: "Weight Loss", description: "Calorie-controlled plan for effective weight loss" },
    { id: 2, name: "Muscle Gain", description: "High-protein plan for muscle building" },
    { id: 3, name: "Balanced Nutrition", description: "Well-rounded plan for overall health" },
    { id: 4, name: "Vegan", description: "Plant-based plan rich in nutrients" },
  ];

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">buffi</h1>
      </header>

      <div className="content">
        {/* Use NavBar component here instead of inline navigation */}
        <NavBar />

        <main className="main">
          <h2 className="pageTitle">AI-Powered Meal Plans</h2>
          <p className="pageDescription">Select a meal plan tailored to your fitness goals. Our AI will customize it based on your preferences and nutritional needs.</p>

          <div className="planGrid">
            {mealPlans.map((plan) => (
              <Card key={plan.id} className={`planCard ${selectedPlan === plan.id ? 'selectedPlan' : ''}`} onClick={() => setSelectedPlan(plan.id)}>
                <CardContent className="planCardContent">
                  <div className="planHeader">
                    <h3 className="planTitle">{plan.name}</h3>
                    {selectedPlan === plan.id && <Check className="checkIcon" />}
                  </div>
                  <p className="planDescription">{plan.description}</p>
                  <Button className="planButton">
                    {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPlan && (
            <Card className="customPlanCard">
              <CardContent className="customPlanContent">
                <h3 className="customPlanTitle">Your AI-Customized Meal Plan</h3>
                <p className="customPlanDescription">Our AI is generating a personalized meal plan based on your selection. This plan will take into account your dietary preferences, nutritional needs, and fitness goals.</p>
                <div className="aiAnalysis">
                  <p>AI is analyzing your data and creating your custom meal plan...</p>
                </div>
                <Button className="generateButton">
                  Generate Meal Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2023 Buffi. All rights reserved.</p>
      </footer>
    </div>
  );
}
