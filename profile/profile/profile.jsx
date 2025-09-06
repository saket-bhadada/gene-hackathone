import React, { useState, useEffect } from 'react';
import './profile.css'; // External CSS file you can create for styling

const Profile = () => {
  const defaultUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    username: "john_doe",
    bio: "Passionate learner and coding enthusiast."
  };

  const [user, setUser] = useState(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaultUser);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData(storedUser);
    }
  }, []);

  // Save to localStorage whenever user state changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const enterEditMode = () => {
    setIsEditing(true);
  };

  const saveProfile = () => {
    setUser(formData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=128`;

  return (
    <div className="container">
      <div className="profile-box">
        <div className="profile-header">
          <img src={avatarUrl} alt="Profile" className="profile-image" />
          <h2>{user.name}</h2>
        </div>
        <div className="profile-details">
          <div className="detail">
            <label>Email</label>
            {isEditing ? (
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            ) : (
              <p>{user.email}</p>
            )}
          </div>
          <div className="detail">
            <label>Username</label>
            {isEditing ? (
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            ) : (
              <p>{user.username}</p>
            )}
          </div>
          <div className="detail">
            <label>Bio</label>
            {isEditing ? (
              <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange}></textarea>
            ) : (
              <p>{user.bio}</p>
            )}
          </div>
        </div>
        <div id="action-buttons">
          {isEditing ? (
            <div className="button-group">
              <button onClick={saveProfile}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          ) : (
            <button onClick={enterEditMode}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
