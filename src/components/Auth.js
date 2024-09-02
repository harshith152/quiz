import React, { useState } from 'react';
import './Auth.css';
import logo from '../Assets/images/QUIZZIE.png';

const Auth = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});

  const validateName = (name) => name.length > 2;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateConfirmPassword = (password, confirmPassword) =>
    password === confirmPassword;

  const handleTabSwitch = (login) => {
    setIsLogin(login);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!isLogin && !validateName(name)) {
      validationErrors.name = 'Invalid Name';
    }

    if (!validateEmail(email)) {
      validationErrors.email = 'Invalid Email';
    }

    if (!validatePassword(password)) {
      validationErrors.password = 'Weak Password';
    }

    if (!isLogin && !validateConfirmPassword(password, confirmPassword)) {
      validationErrors.confirmPassword = 'Password doesn’t match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      if (isLogin) {
        onLogin(email, password); // Handle login process
      } else {
        onSignup(email, password); // Handle signup process
        handleTabSwitch(true); // Switch to login tab after successful signup
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={logo} alt="Logo" className="logo" />
        <div className="tab-menu">
          <button
            className={`tab ${isLogin ? '' : 'active'}`}
            onClick={() => handleTabSwitch(false)}
          >
            Sign Up
          </button>
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => handleTabSwitch(true)}
          >
            Log In
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder={errors.name ? errors.name : ''}
              />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder={errors.email ? errors.email : ''}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder={errors.password ? errors.password : ''}
            />
          </div>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder={errors.confirmPassword ? errors.confirmPassword : ''}
              />
            </div>
          )}
          <button type="submit" className="auth-btn">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
