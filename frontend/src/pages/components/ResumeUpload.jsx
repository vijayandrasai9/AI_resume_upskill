import React from 'react';

export default function ResumeUpload({ setUser }) {
  const handleUpload = async e => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('/api/user/upload-resume', {
      method: 'POST',
      body: formData
    });

    const updated = await res.json();
    setUser(updated);
  };

  return (
    <div>
      <h3>Upload Resume</h3>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}