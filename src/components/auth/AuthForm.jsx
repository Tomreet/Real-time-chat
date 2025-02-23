import React from 'react';

const AuthForm = ({ onLogin, switchToRegister, useState, loadUsers}) => {
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.name.trim() || !credentials.password.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      const users = await loadUsers();
      const user = users.find(u => 
        u.name === credentials.name && u.password === credentials.password
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Incorrect data');
      }
    } catch (error) {
      console.error('Authorization error:', error);
      setError('Authorization error');
    }
  };

  return (
    <div className="MyBackground">
      <div className="Left"></div>
      <div className="Right"></div>
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Name"
            value={credentials.name}
            onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
          <button type="button" onClick={switchToRegister}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;