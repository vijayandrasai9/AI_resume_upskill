import React from 'react';

export default function AnalyticsCards({ stats }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div><h4>Projects</h4><p>{stats.projects}</p></div>
      <div><h4>Roles Applied</h4><p>{stats.rolesApplied}</p></div>
      <div><h4>Downloads</h4><p>{stats.downloads}</p></div>
    </div>
  );
}