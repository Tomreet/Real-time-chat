import React from 'react';
import MyButton from '../UI/MyButton';
import { Eye, EyeClosed } from 'lucide-react';

const RegisterForm = ({ onRegister, switchToLogin, useState, loadUsers, saveUsers}) => {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const defaultUserTemplate = {
    name: "",
    password: "",
    email: "",
    address: "",
    phone: "",
    website: "",
    company: "",
    posts: [],
    accountHistory: [],
    favorite: false,
    avatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdXNlciI+PHBhdGggZD0iTTE5IDIxdi0yYTQgNCAwIDAgMC00LTRIOWE0IDQgMCAwIDAtNCA0djIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiLz48L3N2Zz4=",
    id: 0
  };
  
  const generateId = (existingUsers) => {
    const maxId = existingUsers.reduce((max, user) => Math.max(max, user.id), 0);
    return maxId + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const users = await loadUsers();
    
    const existingName = users.some(u => u.name === formData.name);
    const existingpassword = users.some(u => u.password === formData.password);
    
    if (existingName || existingpassword) {
      setError(existingName ? 'Name taken' : 'password taken');
      return;
    }

    const newUser = {
      ...defaultUserTemplate,
      ...formData,
      id: generateId(users),
    };

    await saveUsers([...users, newUser]);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    onRegister(newUser);
  };

  return (
    <div className="MyBackground">
      <div className="Left"></div>
      <div className="Right"></div>
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <MyButton
              type="button"
              style={{
                position: 'absolute',
                right: '10px',
                top: '63.5%',
                left: '65%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={() => setShowPassword(!showPassword)}
              icon={showPassword ? <EyeClosed stroke-width="1"/> : <Eye stroke-width="1"/>}
            />
          {error && <div className="error">{error}</div>}
          <button type="submit">Register</button>
          <button type="button" onClick={switchToLogin}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;