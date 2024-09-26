import React, { useState, useEffect } from 'react';
import NavBar from '../common/NavBar.tsx'; // Import NavBar
import '../styles/workoutPlan.css'; // Import the CSS file

const workoutPlans = {
  beginner: [
    { day: 'Monday', focus: 'Full Body', exercises: ['Squats', 'Push-ups', 'Rows'] },
    { day: 'Wednesday', focus: 'Cardio', exercises: ['Jogging', 'Jumping Jacks', 'Burpees'] },
    { day: 'Friday', focus: 'Full Body', exercises: ['Lunges', 'Dips', 'Plank'] },
  ],
  intermediate: [
    { day: 'Monday', focus: 'Chest and Triceps', exercises: ['Bench Press', 'Incline Dumbbell Press', 'Tricep Pushdowns'] },
    { day: 'Wednesday', focus: 'Back and Biceps', exercises: ['Deadlifts', 'Pull-ups', 'Barbell Curls'] },
    { day: 'Friday', focus: 'Legs and Shoulders', exercises: ['Squats', 'Leg Press', 'Shoulder Press'] },
  ],
  advanced: [
    { day: 'Monday', focus: 'Chest and Back', exercises: ['Bench Press', 'Weighted Pull-ups', 'Incline Flyes'] },
    { day: 'Wednesday', focus: 'Legs', exercises: ['Squats', 'Romanian Deadlifts', 'Leg Extensions'] },
    { day: 'Friday', focus: 'Shoulders and Arms', exercises: ['Military Press', 'Lateral Raises', 'Skull Crushers'] },
  ],
};

const WorkoutPlan: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('beginner');
  const [completedWorkouts, setCompletedWorkouts] = useState<number>(0);

  useEffect(() => {
    const totalWorkouts = workoutPlans[selectedPlan].length;
    setCompletedWorkouts(Math.floor(Math.random() * (totalWorkouts + 1)));
  }, [selectedPlan]);

  const handlePlanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlan(event.target.value);
  };

  return (
    <div className="home-page"> {/* Use home-page class for consistent styling */}
      <header>
        <h1 className="logo">buffi</h1>
      </header>

      <div className="main-content">
        <NavBar /> {/* Use NavBar component here */}
        
        <main className="workout-container">
          <h1 className="workout-title">Your Workout Plan</h1>
          <select className="plan-select" value={selectedPlan} onChange={handlePlanChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <div className="workout-grid">
            {workoutPlans[selectedPlan].map((workout, index) => (
              <div key={index} className="workout-card">
                <h2 className="workout-day">{workout.day}</h2>
                <h3 className="workout-focus">{workout.focus}</h3>
                <ul className="workout-exercises">
                  {workout.exercises.map((exercise, i) => (
                    <li key={i}>{exercise}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="progress-card">
            <h2 className="progress-title">Weekly Progress</h2>
            <p className="progress-text">
              You've completed {completedWorkouts} out of {workoutPlans[selectedPlan].length} workouts this week. Keep up the good work!
            </p>
          </div>
        </main>
      </div>

      <footer>
        <p>&copy; 2023 Buffi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WorkoutPlan;
