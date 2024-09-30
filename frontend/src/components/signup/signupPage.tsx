import React, { useState } from 'react';
import '../styles/signupPage.css'; // Import the CSS file
import PORT from '../../serverPort.js';


const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1); // Track the current step
  const [showDialog, setShowDialog] = useState(false); // Show/hide dialog
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'Other',
    height: '',
    weight: '',
    primaryGoal: '',
    secondaryGoal: '',
    weeklyWorkoutFrequency: ''
  });
  const [error, setError] = useState<string | null>(null); // Store error message

  const handleNext = () => {
    setStep(2); // Move to step 2
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSkip = () => {
    setShowDialog(true); // Show dialog if trying to skip
  };

  const handleContinueAnyway = () => {
    setShowDialog(false);
    submitForm(); // Submit the form even if fitness details are skipped
  };

  const handleGoBack = () => {
    setShowDialog(false); // Hide dialog and allow the user to continue filling out step 2
  };

  const submitForm = async () => {
    // Send the form data to the API
    try {
      const response = await fetch(`http://localhost:${PORT}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered successfully:', data.message);
        // Optionally redirect the user or show a success message
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Set error message to display on the frontend
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Error during sign-up:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous error
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    submitForm(); // Proceed with form submission if passwords match
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {error && <p className="error-message">{error}</p>} {/* Display error message */}

        {step === 1 && (
          <div id="step-1" className="form-step active">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Next Button */}
            <div className="form-group">
              <button type="button" className="next-button" onClick={handleNext}>Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div id="step-2" className="form-step active">
            {/* Date of Birth */}
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Height */}
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            {/* Weight */}
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            {/* Primary Fitness Goal */}
            <div className="form-group">
              <label htmlFor="primary_goal">Primary Fitness Goal</label>
              <input
                type="text"
                id="primary_goal"
                name="primaryGoal"
                value={formData.primaryGoal}
                onChange={handleChange}
              />
            </div>

            {/* Secondary Fitness Goal */}
            <div className="form-group">
              <label htmlFor="secondary_goal">Secondary Fitness Goal</label>
              <input
                type="text"
                id="secondary_goal"
                name="secondaryGoal"
                value={formData.secondaryGoal}
                onChange={handleChange}
              />
            </div>

            {/* Weekly Workout Frequency */}
            <div className="form-group">
              <label htmlFor="weekly_workout_frequency">Weekly Workout Frequency</label>
              <input
                type="number"
                id="weekly_workout_frequency"
                name="weeklyWorkoutFrequency"
                value={formData.weeklyWorkoutFrequency}
                onChange={handleChange}
                min="1"
              />
            </div>

            {/* Submit and Skip */}
            <div className="form-group">
              <button type="submit" className="signup-button">Submit</button>
              <button type="button" className="skip-button" onClick={handleSkip}>Skip for Now</button>
            </div>
          </div>
        )}
      </form>

      {/* Dialog Box for Skipping */}
      {showDialog && (
        <div className="dialog">
          <div className="dialog-content">
            <p>This additional information will help us personalize our suggestions. Are you sure you want to skip?</p>
            <button onClick={handleContinueAnyway} className="dialog-button">Yes, Continue</button>
            <button onClick={handleGoBack} className="dialog-button">Go Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
