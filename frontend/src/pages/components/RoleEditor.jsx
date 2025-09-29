import React, { useState } from 'react';

export default function RoleEditor({ roles, setUser }) {
  const [newRole, setNewRole] = useState('');

  const addRole = async () => {
    const res = await fetch('/api/user/add-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    const updated = await res.json();
    setUser(updated);
    setNewRole('');
  };

  return (
    <div>
      <h3>Desired Roles</h3>
      <ul>{roles.map(r => <li key={r}>{r}</li>)}</ul>
      <input value={newRole} onChange={e => setNewRole(e.target.value)} />
      <button onClick={addRole}>Add Role</button>
    </div>
  );
}