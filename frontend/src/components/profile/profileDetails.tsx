import React, { useEffect, useState } from 'react';
import { Save, ChevronLeft } from 'lucide-react';
import NavBar from '../common/NavBar.tsx'; // Import the NavBar component
import '../styles/profileDetails.css'; // Import the CSS file
import PORT from '../../serverPort.js';

interface ProfileData {
  // Private Information
  name: string;
  email: string;
  dateOfBirth: string | null;
  gender: string;

  // Current Body Type
  height: string | null;
  weight: string | null;
  bodyFatPercentage: string | null;
  musclePercentage: string | null;

  // Desired Body Type
  targetWeight: string | null;
  targetBodyFatPercentage: string | null;
  targetMusclePercentage: string | null;

  // Fitness Goals
  primaryGoal: string;
  secondaryGoal: string;
  weeklyWorkoutFrequency: string | null;
  preferredWorkoutType: string;

  // Dietary Preferences
  dietType: string;
  calorieIntakeGoal: string | null;
  allergies: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    dateOfBirth: null,
    gender: '',
    height: null,
    weight: null,
    bodyFatPercentage: null,
    musclePercentage: null,
    targetWeight: null,
    targetBodyFatPercentage: null,
    targetMusclePercentage: null,
    primaryGoal: '',
    secondaryGoal: '',
    weeklyWorkoutFrequency: null,
    preferredWorkoutType: '',
    dietType: '',
    calorieIntakeGoal: null,
    allergies: '',
  });

  const [activeSection, setActiveSection] = useState('private');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not logged in');
        return;
      }

      try {
        const response = await fetch(`http://localhost:${PORT}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched profile data:', data);

          // Handle null and format dateOfBirth for input field (YYYY-MM-DD)
          const formattedData = {
            ...data,
            dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : '',
            height: data.height_cm || '',
            weight: data.weight_kg || '',
            bodyFatPercentage: data.body_fat_percentage || '',
            musclePercentage: data.muscle_percentage || '',
            targetWeight: data.target_weight_kg || '',
            targetBodyFatPercentage: data.target_body_fat_percentage || '',
            targetMusclePercentage: data.target_muscle_percentage || '',
            weeklyWorkoutFrequency: data.weekly_workout_frequency || '',
            calorieIntakeGoal: data.calorie_intake_goal || '',
          };

          setProfile(formattedData);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error fetching profile data');
        }
      } catch (err) {
        setError('Error fetching profile data');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value === '' ? null : value, // Convert empty string to null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not logged in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:${PORT}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error updating profile');
      }
    } catch (err) {
      setError('Error updating profile');
    }
  };

  const renderSection = (section: string) => {
    console.log('Rendering section:', section);
    switch (section) {
      case 'private':
        return (
          <>
            <h2>Private Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={profile.dateOfBirth || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={profile.gender || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
              <input
                type="number"
                id="height"
                name="height"
                value={profile.height || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Current Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={profile.weight || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="bodyFatPercentage">Body Fat Percentage</label>
              <input
                type="number"
                id="bodyFatPercentage"
                name="bodyFatPercentage"
                value={profile.bodyFatPercentage || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="musclePercentage">Muscle Percentage</label>
              <input
                type="number"
                id="musclePercentage"
                name="musclePercentage"
                value={profile.musclePercentage || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 'desired':
        return (
          <>
            <h2>Desired Body Type</h2>
            <div className="form-group">
              <label htmlFor="targetWeight">Target Weight (kg)</label>
              <input
                type="number"
                id="targetWeight"
                name="targetWeight"
                value={profile.targetWeight || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="targetBodyFatPercentage">Target Body Fat Percentage</label>
              <input
                type="number"
                id="targetBodyFatPercentage"
                name="targetBodyFatPercentage"
                value={profile.targetBodyFatPercentage || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="targetMusclePercentage">Target Muscle Percentage</label>
              <input
                type="number"
                id="targetMusclePercentage"
                name="targetMusclePercentage"
                value={profile.targetMusclePercentage || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 'goals':
        return (
          <>
            <h2>Fitness Goals</h2>
            <div className="form-group">
              <label htmlFor="primaryGoal">Primary Goal</label>
              <select
                id="primaryGoal"
                name="primaryGoal"
                value={profile.primaryGoal || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select primary goal</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Gain Muscle">Gain Muscle</option>
                <option value="Improve Endurance">Improve Endurance</option>
                <option value="Maintain Health">Maintain Health</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="secondaryGoal">Secondary Goal</label>
              <select
                id="secondaryGoal"
                name="secondaryGoal"
                value={profile.secondaryGoal || ''}
                onChange={handleChange}
              >
                <option value="">Select secondary goal</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Gain Muscle">Gain Muscle</option>
                <option value="Improve Endurance">Improve Endurance</option>
                <option value="Maintain Health">Maintain Health</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="weeklyWorkoutFrequency">Weekly Workout Frequency</label>
              <select
                id="weeklyWorkoutFrequency"
                name="weeklyWorkoutFrequency"
                value={profile.weeklyWorkoutFrequency || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select frequency</option>
                <option value="1-2">1-2 times per week</option>
                <option value="3-4">3-4 times per week</option>
                <option value="5+">5+ times per week</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="preferredWorkoutType">Preferred Workout Type</label>
              <select
                id="preferredWorkoutType"
                name="preferredWorkoutType"
                value={profile.preferredWorkoutType || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select workout type</option>
                <option value="Weight Lifting">Weight Lifting</option>
                <option value="Cardio">Cardio</option>
                <option value="Yoga">Yoga</option>
                <option value="HIIT">HIIT</option>
                <option value="Mixed">Mixed</option>
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
              <select
                id="dietType"
                name="dietType"
                value={profile.dietType || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select diet type</option>
                <option value="Omnivore">Omnivore</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
                <option value="Paleo">Paleo</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="calorieIntakeGoal">Daily Calorie Intake Goal</label>
              <input
                type="number"
                id="calorieIntakeGoal"
                name="calorieIntakeGoal"
                value={profile.calorieIntakeGoal || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="allergies">Allergies or Food Restrictions</label>
              <textarea
                id="allergies"
                name="allergies"
                value={profile.allergies || ''}
                onChange={handleChange}
              ></textarea>
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
        {error && <p className="error-message">{error}</p>}
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
          <button
            className={activeSection === 'private' ? 'active' : ''}
            onClick={() => setActiveSection('private')}
          >
            <ChevronLeft /> Private Information
          </button>
          <button
            className={activeSection === 'current' ? 'active' : ''}
            onClick={() => setActiveSection('current')}
          >
            <ChevronLeft /> Current Body Type
          </button>
          <button
            className={activeSection === 'desired' ? 'active' : ''}
            onClick={() => setActiveSection('desired')}
          >
            <ChevronLeft /> Desired Body Type
          </button>
          <button
            className={activeSection === 'goals' ? 'active' : ''}
            onClick={() => setActiveSection('goals')}
          >
            <ChevronLeft /> Fitness Goals
          </button>
          <button
            className={activeSection === 'diet' ? 'active' : ''}
            onClick={() => setActiveSection('diet')}
          >
            <ChevronLeft /> Dietary Preferences
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ProfilePage;
