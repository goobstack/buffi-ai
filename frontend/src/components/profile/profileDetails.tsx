import React, { useState } from 'react';
import { Save, ChevronLeft } from 'lucide-react';
import NavBar from '../common/NavBar.tsx'; // Import the NavBar component
import '../styles/profileDetails.css'; // Import the CSS file

interface ProfileData {
  // Private Information
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;

  // Current Body Type
  height: string;
  weight: string;
  bodyFatPercentage: string;
  musclePercentage: string;

  // Desired Body Type
  targetWeight: string;
  targetBodyFatPercentage: string;
  targetMusclePercentage: string;

  // Fitness Goals
  primaryGoal: string;
  secondaryGoal: string;
  weeklyWorkoutFrequency: string;
  preferredWorkoutType: string;

  // Dietary Preferences
  dietType: string;
  calorieIntakeGoal: string;
  allergies: string;
}

const ProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('private');
  const [profile, setProfile] = useState<ProfileData>({
    name: '', email: '', dateOfBirth: '', gender: '',
    height: '', weight: '', bodyFatPercentage: '', musclePercentage: '',
    targetWeight: '', targetBodyFatPercentage: '', targetMusclePercentage: '',
    primaryGoal: '', secondaryGoal: '', weeklyWorkoutFrequency: '', preferredWorkoutType: '',
    dietType: '', calorieIntakeGoal: '', allergies: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile data submitted:', profile);
    // Here you would typically send the data to a server
  };

  const renderSection = (section: string) => {
    switch (section) {
      case 'private':
        return (
          <>
            <h2>Private Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={profile.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={profile.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        );
      case 'current':
        return (
          <>
            <h2>Current Body Type</h2>
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input type="number" id="height" name="height" value={profile.height} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Current Weight (kg)</label>
              <input type="number" id="weight" name="weight" value={profile.weight} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="bodyFatPercentage">Body Fat Percentage</label>
              <input type="number" id="bodyFatPercentage" name="bodyFatPercentage" value={profile.bodyFatPercentage} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="musclePercentage">Muscle Percentage</label>
              <input type="number" id="musclePercentage" name="musclePercentage" value={profile.musclePercentage} onChange={handleChange} />
            </div>
          </>
        );
      case 'desired':
        return (
          <>
            <h2>Desired Body Type</h2>
            <div className="form-group">
              <label htmlFor="targetWeight">Target Weight (kg)</label>
              <input type="number" id="targetWeight" name="targetWeight" value={profile.targetWeight} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="targetBodyFatPercentage">Target Body Fat Percentage</label>
              <input type="number" id="targetBodyFatPercentage" name="targetBodyFatPercentage" value={profile.targetBodyFatPercentage} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="targetMusclePercentage">Target Muscle Percentage</label>
              <input type="number" id="targetMusclePercentage" name="targetMusclePercentage" value={profile.targetMusclePercentage} onChange={handleChange} />
            </div>
          </>
        );
      case 'goals':
        return (
          <>
            <h2>Fitness Goals</h2>
            <div className="form-group">
              <label htmlFor="primaryGoal">Primary Goal</label>
              <select id="primaryGoal" name="primaryGoal" value={profile.primaryGoal} onChange={handleChange} required>
                <option value="">Select primary goal</option>
                <option value="loseWeight">Lose Weight</option>
                <option value="gainMuscle">Gain Muscle</option>
                <option value="improveEndurance">Improve Endurance</option>
                <option value="maintainHealth">Maintain Health</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="secondaryGoal">Secondary Goal</label>
              <select id="secondaryGoal" name="secondaryGoal" value={profile.secondaryGoal} onChange={handleChange}>
                <option value="">Select secondary goal</option>
                <option value="loseWeight">Lose Weight</option>
                <option value="gainMuscle">Gain Muscle</option>
                <option value="improveEndurance">Improve Endurance</option>
                <option value="maintainHealth">Maintain Health</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="weeklyWorkoutFrequency">Weekly Workout Frequency</label>
              <select id="weeklyWorkoutFrequency" name="weeklyWorkoutFrequency" value={profile.weeklyWorkoutFrequency} onChange={handleChange} required>
                <option value="">Select frequency</option>
                <option value="1-2">1-2 times per week</option>
                <option value="3-4">3-4 times per week</option>
                <option value="5+">5+ times per week</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="preferredWorkoutType">Preferred Workout Type</label>
              <select id="preferredWorkoutType" name="preferredWorkoutType" value={profile.preferredWorkoutType} onChange={handleChange} required>
                <option value="">Select workout type</option>
                <option value="weightLifting">Weight Lifting</option>
                <option value="cardio">Cardio</option>
                <option value="yoga">Yoga</option>
                <option value="hiit">HIIT</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </>
        );
      case 'diet':
        return (
          <>
            <h2>Dietary Preferences</h2>
            <div className="form-group">
              <label htmlFor="dietType">Diet Type</label>
              <select id="dietType" name="dietType" value={profile.dietType} onChange={handleChange} required>
                <option value="">Select diet type</option>
                <option value="omnivore">Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="calorieIntakeGoal">Daily Calorie Intake Goal</label>
              <input type="number" id="calorieIntakeGoal" name="calorieIntakeGoal" value={profile.calorieIntakeGoal} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="allergies">Allergies or Food Restrictions</label>
              <textarea id="allergies" name="allergies" value={profile.allergies} onChange={handleChange}></textarea>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <NavBar /> {/* NavBar added here */}
      <div className="profile-content">
        <h1>Your Profile</h1>
        <form onSubmit={handleSubmit}>
          {renderSection(activeSection)}
          <button type="submit" className="submit-button">
            <Save className="icon" />
            Save Profile
          </button>
        </form>
      </div>
      <div className="profile-sidebar">
        <nav>
          <button className={activeSection === 'private' ? 'active' : ''} onClick={() => setActiveSection('private')}>
            <ChevronLeft /> Private Information
          </button>
          <button className={activeSection === 'current' ? 'active' : ''} onClick={() => setActiveSection('current')}>
            <ChevronLeft /> Current Body Type
          </button>
          <button className={activeSection === 'desired' ? 'active' : ''} onClick={() => setActiveSection('desired')}>
            <ChevronLeft /> Desired Body Type
          </button>
          <button className={activeSection === 'goals' ? 'active' : ''} onClick={() => setActiveSection('goals')}>
            <ChevronLeft /> Fitness Goals
          </button>
          <button className={activeSection === 'diet' ? 'active' : ''} onClick={() => setActiveSection('diet')}>
            <ChevronLeft /> Dietary Preferences
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ProfilePage;
