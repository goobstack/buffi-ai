import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import NavBar from '../common/NavBar.tsx';  // Import your NavBar component
import '../styles/Progress.css';  // Import the CSS file

const mockData = {
  weight: [
    { date: '2023-01-01', value: 80 },
    { date: '2023-02-01', value: 78 },
    { date: '2023-03-01', value: 76 },
    { date: '2023-04-01', value: 75 },
    { date: '2023-05-01', value: 74 },
  ],
  bodyFat: [
    { date: '2023-01-01', value: 22 },
    { date: '2023-02-01', value: 21 },
    { date: '2023-03-01', value: 20 },
    { date: '2023-04-01', value: 19 },
    { date: '2023-05-01', value: 18 },
  ],
  benchPress: [
    { date: '2023-01-01', value: 60 },
    { date: '2023-02-01', value: 65 },
    { date: '2023-03-01', value: 70 },
    { date: '2023-04-01', value: 75 },
    { date: '2023-05-01', value: 80 },
  ],
  squat: [
    { date: '2023-01-01', value: 80 },
    { date: '2023-02-01', value: 85 },
    { date: '2023-03-01', value: 90 },
    { date: '2023-04-01', value: 95 },
    { date: '2023-05-01', value: 100 },
  ],
};

const statOptions = [
  { value: 'weight', label: 'Weight (kg)' },
  { value: 'bodyFat', label: 'Body Fat (%)' },
  { value: 'benchPress', label: 'Bench Press (kg)' },
  { value: 'squat', label: 'Squat (kg)' },
];

const ProgressPage: React.FC = () => {
  const [selectedStat, setSelectedStat] = useState(statOptions[0].value);

  const handleStatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStat(event.target.value);
  };

  return (
    <div className="progress-container">
      <NavBar /> {/* Insert Navbar here */}
      <div className="progress-content">
        <h1>Your Progress</h1>
        <div className="stat-selector">
          <select value={selectedStat} onChange={handleStatChange}>
            {statOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="select-icon" />
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockData[selectedStat as keyof typeof mockData]}>
              <CartesianGrid stroke="#B8B5D1" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#F0E68C" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-summary">
          <h2>Summary</h2>
          <div className="stat-grid">
            {statOptions.map((stat) => (
              <div key={stat.value} className="stat-card">
                <h3>{stat.label}</h3>
                <p className="stat-value">
                  {mockData[stat.value as keyof typeof mockData][4].value}
                  {stat.value === 'bodyFat' ? '%' : ' kg'}
                </p>
                <p className="stat-change">
                  {(mockData[stat.value as keyof typeof mockData][4].value -
                    mockData[stat.value as keyof typeof mockData][0].value).toFixed(1)}
                  {stat.value === 'bodyFat' ? '%' : ' kg'} change
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
