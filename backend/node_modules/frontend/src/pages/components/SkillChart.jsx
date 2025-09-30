import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function SkillChart({ skills }) {
  const data = {
    labels: skills.map(s => s.name),
    datasets: [{
      label: 'Skill Level',
      data: skills.map(s => s.level),
      backgroundColor: '#3182ce'
    }]
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Bar data={data} />
    </div>
  );
}