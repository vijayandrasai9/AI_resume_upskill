import React from 'react';

export default function ThemeToggle({ currentTheme }) {
  const toggleTheme = async () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    await fetch('/api/user/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newTheme })
    });
    window.location.reload(); // or use context/state
  };

  return (
    <button onClick={toggleTheme}>
      Switch to {currentTheme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
}