import React, { useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Eye, EyeClosed } from 'lucide-react';
import MyButton from '../UI/MyButton';
const UserInfo = ({ user, onSave, isCurrentUser, setCurrentUser}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);
  const [showPassword, setShowPassword] = useState(false);
  const [animationParent] = useAutoAnimate()
  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  useEffect(() => {
    setIsEditing(false);
    setEditData(user);
  }, [user]);

  return (
    <div className="user-info">
      {isCurrentUser && (
        <div className="user-actions">
          <button className="btn-cancelEdit" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && <button className="bth-save" onClick={handleSave}>Save</button>}
          {!isEditing &&<button className='btn-exit' onClick={() => {
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        }}>Logout</button>}
        </div>
      )}

      {isEditing ? (
        <div className="edit-form" ref={animationParent}>
          <input
            placeholder="Name"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
          />
          <div style={{ display: 'flex', position: 'relative', flexDirection: 'column' }} ref={animationParent}>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={editData.password}
              onChange={(e) => setEditData({...editData, password: e.target.value})}
              style={{
                paddingRight: '40px',
                minWidth: '173px',
                maxWidth: '668px'
              }}
            />
            <MyButton
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={() => setShowPassword(!showPassword)}
              icon={showPassword ? <EyeClosed stroke-width="1"/> : <Eye stroke-width="1"/>}
            />
          </div>
          <input
            placeholder="Email"
            value={editData.email}
            onChange={(e) => setEditData({...editData, email: e.target.value})}
          />
          <input
            placeholder="Phone"
            value={editData.phone}
            onChange={(e) => setEditData({...editData, phone: e.target.value})}
          />
          <input
            placeholder="Address"
            value={editData.address}
            onChange={(e) => setEditData({...editData, address: e.target.value})}
          />
          <input
            placeholder="Company"
            value={editData.company}
            onChange={(e) => setEditData({...editData, company: e.target.value})}
          />
          <input
            placeholder="Avatar"
            value={editData.avatar}
            onChange={(e) => setEditData({...editData, avatar: e.target.value})}
          />
        </div>
      ) : (
        <div className="user-details">
          <h2>{user.name}</h2>
          <div className="detail-item">
            <span>Email:</span>
            <p>{user.email || 'Not listed'}</p>
          </div>
          <div className="detail-item">
            <span>Phone:</span>
            <p>{user.phone || 'Not listed'}</p>
          </div>
          <div className="detail-item">
            <span>Address:</span>
            <p>{user.address || 'Not listed'}</p>
          </div>
          <div className="detail-item">
            <span>Company:</span>
            <p>{user.company || 'Not listed'}</p>
          </div>
        </div>

        
      )}

    </div>
  );
};

export default UserInfo;