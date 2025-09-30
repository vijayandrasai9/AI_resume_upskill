import React from 'react';

export default function ProfileProgress({ user }) {
  const filledFields = ['name', 'email', 'skills', 'roles', 'resumeUrl'].filter(f => user[f]);
  const percent = Math.round((filledFields.length / 5) * 100);

  return (
    <div>
      <h3>Profile Completion</h3>
      <progress value={percent} max="100" />
      <p>{percent}% complete</p>
    </div>
  );
}