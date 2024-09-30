import React, { useState, useEffect } from 'react';
import NavBar from '../common/NavBar.tsx';
import { ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import '../styles/workoutPlan.css';

interface Workout {
  name: string;
  description: string;
  duration: string;
  equipment: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Workout[];
}

const workoutPlans: { [key: string]: WorkoutDay[] } = {
  beginner: [
    { day: 'Monday', focus: 'Full Body', exercises: [
      { name: 'Squats', description: 'Lower body exercise', duration: '3 sets of 10 reps', equipment: 'Bodyweight or Dumbbells' },
      { name: 'Push-ups', description: 'Upper body exercise', duration: '3 sets of 10 reps', equipment: 'Bodyweight' },
      { name: 'Rows', description: 'Back exercise', duration: '3 sets of 10 reps', equipment: 'Resistance Band' }
    ]},
    { day: 'Wednesday', focus: 'Cardio', exercises: [
      { name: 'Jogging', description: 'Cardiovascular exercise', duration: '20 minutes', equipment: 'None' },
      { name: 'Jumping Jacks', description: 'Full body cardio', duration: '3 sets of 30 seconds', equipment: 'None' },
      { name: 'Burpees', description: 'High-intensity exercise', duration: '3 sets of 10 reps', equipment: 'None' }
    ]},
    { day: 'Friday', focus: 'Full Body', exercises: [
      { name: 'Lunges', description: 'Lower body exercise', duration: '3 sets of 10 reps per leg', equipment: 'Bodyweight or Dumbbells' },
      { name: 'Dips', description: 'Upper body exercise', duration: '3 sets of 10 reps', equipment: 'Parallel bars or Chair' },
      { name: 'Plank', description: 'Core exercise', duration: '3 sets of 30 seconds', equipment: 'None' }
    ]},
  ],
  // ... (intermediate and advanced plans)
};

const WorkoutPlan: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('beginner');
  const [completedWorkouts, setCompletedWorkouts] = useState<number>(0);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    const totalWorkouts = workoutPlans[selectedPlan].length;
    setCompletedWorkouts(Math.floor(Math.random() * (totalWorkouts + 1)));
  }, [selectedPlan]);

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
    setExpandedDays([]);
    setIsSelectOpen(false);
  };

  const toggleDayExpansion = (day: string) => {
    setExpandedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="home-page">
      <header>
        <h1 className="logo">buffi</h1>
      </header>

      <div className="main-content">
        <NavBar />
        
        <main className="workout-container">
          <h1 className="workout-title">Your Workout Plan</h1>
          
          <div className="select-container">
            <button 
              className="select-button" 
              onClick={() => setIsSelectOpen(!isSelectOpen)}
            >
              {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
              <ChevronDown className={`select-icon ${isSelectOpen ? 'rotate' : ''}`} />
            </button>
            {isSelectOpen && (
              <div className="select-options">
                <button onClick={() => handlePlanChange('beginner')}>Beginner</button>
                <button onClick={() => handlePlanChange('intermediate')}>Intermediate</button>
                <button onClick={() => handlePlanChange('advanced')}>Advanced</button>
              </div>
            )}
          </div>

          <div className="workout-grid">
            {workoutPlans[selectedPlan].map((workout, index) => (
              <div key={index} className="workout-card">
                <div 
                  className="workout-card-header"
                  onClick={() => toggleDayExpansion(workout.day)}
                >
                  <h3 className="workout-day">{workout.day}</h3>
                  <div className="workout-focus">
                    <span>{workout.focus}</span>
                    {expandedDays.includes(workout.day) ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>
                <div className="workout-card-content">
                  <ul className="workout-exercises">
                    {workout.exercises.map((exercise, i) => (
                      <li key={i}>
                        <Dumbbell size={16} />
                        <span>{exercise.name}</span>
                      </li>
                    ))}
                  </ul>
                  {expandedDays.includes(workout.day) && (
                    <div className="exercise-details">
                      {workout.exercises.map((exercise, i) => (
                        <div key={i} className="exercise-detail">
                          <h4>{exercise.name}</h4>
                          <p><strong>Description:</strong> {exercise.description}</p>
                          <p><strong>Duration:</strong> {exercise.duration}</p>
                          <p><strong>Equipment:</strong> {exercise.equipment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="progress-card">
            <div className="progress-card-header">
              <h3>Weekly Progress</h3>
            </div>
            <div className="progress-card-content">
              <p>
                You've completed {completedWorkouts} out of {workoutPlans[selectedPlan].length} workouts this week. Keep up the good work!
              </p>
            </div>
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