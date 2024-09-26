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

function updateWorkoutPlan(plan) {
    const workoutGrid = document.querySelector('.workout-grid');
    workoutGrid.innerHTML = '';

    workoutPlans[plan].forEach(workout => {
        const card = document.createElement('div');
        card.className = 'workout-card';
        card.innerHTML = `
            <h2>${workout.day}</h2>
            <h3>${workout.focus}</h3>
            <ul>
                ${workout.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
            </ul>
        `;
        workoutGrid.appendChild(card);
    });

    updateProgress(plan);
}

function updateProgress(plan) {
    const progressCard = document.querySelector('.progress-card p');
    const totalWorkouts = workoutPlans[plan].length;
    const completedWorkouts = Math.floor(Math.random() * (totalWorkouts + 1)); // Simulating completed workouts
    progressCard.textContent = `You've completed ${completedWorkouts} out of ${totalWorkouts} workouts this week. Keep up the good work!`;
}

document.getElementById('workout-plan').addEventListener('change', (e) => {
    updateWorkoutPlan(e.target.value);
});

// Initialize with beginner plan
updateWorkoutPlan('beginner');