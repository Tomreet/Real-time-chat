const { useState, useEffect, useRef } = React;

/*
  Generates unique ID for new users
  @param {Array} existingUsers - Array of existing users
  @returns {number} New unique ID
*/
const generateId = (existingUsers) => {
  const maxId = existingUsers.reduce((max, user) => Math.max(max, user.id), 0);
  return maxId + 1;
};

/*
  Gets authentication headers with current user ID
  @returns {Object} Headers object with X-User-ID
*/
// API functions
const getAuthHeader = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser ? { 'X-User-ID': currentUser.id } : {};
};
/*
  Fetches users from server
  @returns {Promise<Array>} Array of users
*/
const loadUsers = async () => {
  try {
    const response = await fetch('users.json');
    return await response.json();
  } catch (error) {
    return [];
  }
};
/*
  Saves users to server
  @param {Array} users - Array of users to save
*/
const saveUsers = async (users) => {
  try {
    await fetch('users.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users),
    });
  } catch (error) {
    console.error('Error saving users:', error);
  }
};
/*
  Fetches channels from server
  @returns {Promise<Array>} Array of channels
*/
const loadChannels = async () => {
  try {
    const response = await fetch('channels.json', {
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    return [];
  }
};
/*
  Saves channels to server
  @param {Array} channels - Array of channels to save
*/
const saveChannels = async (channels) => {
  try {
    await fetch('channels.json', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(channels),
    });
  } catch (error) {
    console.error('Error saving channels:', error);
  }
};

// AUTH COMPONENTS
/*
  Login form component
  @param {Object} props - Component props
  @param {Function} props.onLogin - Login callback
  @param {Function} props.switchToRegister - Switch to register form callback
*/
const AuthForm = ({ onLogin, switchToRegister }) => {
  const [credentials, setCredentials] = useState({ name: '', username: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.name.trim() || !credentials.username.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      const users = await loadUsers();
      const user = users.find(u => 
        u.name === credentials.name && u.username === credentials.username
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Incorrect data');
      }
    } catch (error) {
      console.error('Error during authorization:', error);
      setError('Authorization error');
    }
  };

  return (
    <div className="AuthForm">
      <div className="AuthFormScrollLeft"></div>
      <div className="AuthFormScrollRight"></div>
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <h2>Entrance</h2>
          <input
            type="text"
            placeholder="Name"
            value={credentials.name}
            onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
          <button type="button" onClick={switchToRegister}>
          Registration
          </button>
        </form>
      </div>
    </div>
  );
};
/*
  Registration form component
  @param {Object} props - Component props
  @param {Function} props.onRegister - Registration callback
  @param {Function} props.switchToLogin - Switch to login form callback
*/
const RegisterForm = ({ onRegister, switchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', username: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const users = await loadUsers();
    
    const existingName = users.some(u => u.name === formData.name);
    const existingUsername = users.some(u => u.username === formData.username);
    
    if (existingName || existingUsername) {
      setError(existingName ? 'The name is already taken' : 'Username is already taken');
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
    <div className="AuthForm">
      <div className="AuthFormScrollLeft"></div>
      <div className="AuthFormScrollRight"></div>
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <h2>Registration</h2>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">Register</button>
          <button type="button" onClick={switchToLogin}>
          Return to entrance
          </button>
        </form>
      </div>
    </div>
  );
};
// Default user template structure
const defaultUserTemplate = {
  name: "",
  username: "",
  email: "",
  address: {
    streetA: "",
    streetB: "",
    streetC: "",
    streetD: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    geo: { lat: "", lng: "" }
  },
  phone: "",
  website: "",
  company: {
    name: "",
    catchPhrase: "",
    bs: ""
  },
  posts: [],
  accountHistory: [],
  favorite: false,
  avatar: "https://cdn-icons-png.freepik.com/512/11702/11702778.png",
  id: 0
};
/*
  User profile component
  @param {Object} props - Component props
  @param {Object} props.user - User data
  @param {Function} props.onSave - Save handler
  @param {boolean} props.isCurrentUser - Flag if current user
*/
const UserInfo = ({ user, onSave, isCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);

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
        </div>
      )}

      {isEditing ? (
        <div className="edit-form">
          <input
            placeholder="Name"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
          />
          <input
            placeholder="Username"
            value={editData.username}
            onChange={(e) => setEditData({...editData, username: e.target.value})}
          />
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
            <p>{user.address ? `${user.address.city}, ${user.address.streetA}` : 'Not listed'}</p>
          </div>
          <div className="detail-item">
            <span>Company:</span>
            <p>{user.company?.name || 'Not listed'}</p>
          </div>
        </div>

        
      )}
    </div>
  );
};
// MAIN APP COMPONENT
/*
  Main application component
  Handles chat functionality, user management, and UI state
*/
function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authView, setAuthView] = useState('login');
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatType, setActiveChatType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('chats');
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState('');
  const [overlayData, setOverlayData] = useState(null);
  const socket = useRef(null);
  const [messageText, setMessageText] = useState('');
  const [channelForm, setChannelForm] = useState({
    name: '',
    description: '',
    avatar: ''
  });
// Refs
  const currentUserRef = useRef();
  currentUserRef.current = currentUser;
// Derived state
  const activeChat = activeChatType === 'channel' 
    ? channels.find(c => c.id === activeChatId)
    : users.find(u => u.id === activeChatId);
  /*
    Sets active chat session
    @param {Object} chat - Chat object (user or channel)
  */
    const setActiveChat = (chat) => {
      if (chat.type === 'user') {
        setActiveChatId(chat.id);
        setActiveChatType('user');
      } else {
        setActiveChatId(chat.id);
        setActiveChatType('channel');
      }
    };
// Data initialization
  useEffect(() => {
    const initializeData = async () => {
      if (currentUser) {
        const [usersData, channelsData] = await Promise.all([
          loadUsers(),
          loadChannels()
        ]);
        setUsers(usersData);
        setChannels(channelsData);
      }
    };
    initializeData();
  }, [currentUser]);
// WebSocket setup
  useEffect(() => {
    if (currentUser) {
      socket.current = io();
      
      socket.current.on('message', handleIncomingMessage);
      socket.current.on('users-updated', setUsers);
      socket.current.on('channels-updated', setChannels);

      return () => socket.current.disconnect();
    }
  }, [currentUser]);
  /*
    Handles incoming WebSocket messages
    @param {Object} message - Received message
  */
  const handleIncomingMessage = (message) => {
    if (message.sender === currentUserRef.current?.id) return;
    
    setChannels(prev => prev.map(channel => 
      channel.id === message.channelId ? {
        ...channel,
        messages: [...channel.messages, message]
      } : channel
    ));
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !activeChat || activeChatType !== 'channel') return;

    const newMessage = {
      id: Date.now() + Math.random(),
      text: messageText,
      sender: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date().toISOString(),
      channelId: activeChatId
    };

    setChannels(prev => {
      const updated = prev.map(channel => {
        if (channel.id === activeChatId) {
          return { ...channel, messages: [...channel.messages, newMessage] };
        }
        return channel;
      });
      
      socket.current.emit('message', {
        channelId: activeChatId,
        message: newMessage
      });
      
      saveChannels(updated);
      return updated;
    });

    setMessageText('');
  };

  const handleJoinChannel = async () => {
    if (!currentUser || !activeChat || activeChatType !== 'channel') return;

    try {
      const updatedChannels = channels.map(channel => {
        if (channel.id === activeChatId && 
            !channel.members.some(m => m.id === currentUser.id)) {
          return {
            ...channel,
            members: [...channel.members, {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
              isAdmin: false
            }]
          };
        }
        return channel;
      });
      
      await saveChannels(updatedChannels);
      setChannels(updatedChannels);
    } catch (error) {
      console.error('Error logging into channel:', error);
    }
  };

  const openOverlay = (type, data = null) => {
    setOverlayType(type);
    setOverlayData(data || activeChat);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setOverlayType('');
    setOverlayData(null);
  };

  const createChannel = () => {
    const newChannel = {
      id: Date.now(),
      type: 'channel',
      ...channelForm,
      adminId: currentUser.id,
      members: [{
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isAdmin: true
      }],
      messages: [],
    };
  
    setChannels(prev => {
      const updated = [...prev, newChannel];
      saveChannels(updated);
      socket.current.emit('channels-updated', updated);
      return updated;
    });
  
    setActiveChatId(newChannel.id);
    setActiveChatType('channel');
    setChannelForm({ name: '', description: '', avatar: '' });
    closeOverlay();
  };

  const deleteChannel = async (channelId) => {
    if (!channels.some(c => c.id === channelId && c.adminId === currentUser.id)) return;
    
    setChannels(prev => {
      const updated = prev.filter(c => c.id !== channelId);
      saveChannels(updated);
      socket.current.emit('channels-updated', updated);
      return updated;
    });
    
    setActiveChatId(null);
    closeOverlay();
  };

  const addUserToChannel = (userId) => {
    const user = users.find(u => u.id === Number(userId));
    if (!user || !overlayData) return;
  
    setChannels(prev => {
      const updated = prev.map(channel => {
        if (channel.id === overlayData.id && 
            !channel.members.some(m => m.id === user.id)) {
          return {
            ...channel,
            members: [...channel.members, {
              id: user.id,
              name: user.name,
              avatar: user.avatar || '',
              isAdmin: false
            }]
          };
        }
        return channel;
      });
      
      const updatedChannel = updated.find(c => c.id === overlayData.id);
      setOverlayData(updatedChannel);
      saveChannels(updated);
      socket.current.emit('channels-updated', updated);
      return updated;
    });
  };

  const removeUserFromChannel = (userId) => {
    if (!overlayData) return;

    setChannels(prev => {
      const updated = prev.map(channel => {
        if (channel.id === overlayData.id) {
          return {
            ...channel,
            members: channel.members.filter(m => m.id !== userId)
          };
        }
        return channel;
      });
      
      const updatedChannel = updated.find(c => c.id === overlayData.id);
      setOverlayData(updatedChannel);
      saveChannels(updated);
      socket.current.emit('channels-updated', updatedChannel);
      return updated;
    });
  };

  const handleSaveUser = async (updatedUser) => {
    const users = await loadUsers();
    const existing = users.some(u => 
      (u.name === updatedUser.name || u.username === updatedUser.username) && 
      u.id !== updatedUser.id
    );
  
    if (existing) {
      alert('Name or username is already taken');
      return;
    }
  
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id ? {...updatedUser} : u
    );
    
    await saveUsers(updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setUsers(updatedUsers);
  };

  if (!currentUser) {
    return authView === 'login' ? (
      <AuthForm 
        onLogin={setCurrentUser} 
        switchToRegister={() => setAuthView('register')}
      />
    ) : (
      <RegisterForm 
        onRegister={setCurrentUser}
        switchToLogin={() => setAuthView('login')}
      />
    );
  }

  return (
    <div className="AuthForm">
      <div className="AuthFormScrollLeft"></div>
      <div className="AuthFormScrollRight"></div>
      <div className="chat-app">
        <div className="chat-app-grid">
          <header className="app-header">
            <div>You are logged in as: {currentUser.name}</div>
            <button onClick={() => {
              localStorage.removeItem('currentUser');
              setCurrentUser(null);
            }}>Log out</button>
          </header>
          
          <div className="sidebar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="menu-buttons">
              <button 
                className={view === 'chats' ? 'active' : ''} 
                onClick={() => setView('chats')}
              >
                Users
              </button>
              <button 
                className={view === 'channels' ? 'active' : ''} 
                onClick={() => setView('channels')}
              >
                Channels
              </button>
            </div>

            <div className="menu-items">
              {view === 'chats' && (
                <button 
                  className="current-user"
                  onClick={() => setActiveChat({...currentUser, type: 'user'})}
                >
                  <img src='https://cdn-icons-png.freepik.com/512/11702/11702787.png?ga=GA1.1.7003719.1738498462' alt={currentUser.name} />
                  <span>{currentUser.name}</span>
                </button>
              )}

              {view === 'channels' && (
                <button onClick={() => openOverlay('createChannel')}>
                  <img src="https://cdn-icons-png.freepik.com/512/11702/11702669.png" alt="+" />
                  Create a channel
                </button>
              )}

              {(searchTerm ? 
                (view === 'chats' ? users : channels).filter(item => 
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                ) : 
                (view === 'chats' ? users : channels)
              ).filter(item => item.id !== currentUser.id).map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveChat(view === 'chats' ? {...item, type: 'user'} : item)}
                  className={activeChat?.id === item.id ? 'active' : ''}
                >
                  <img 
                    src='https://cdn-icons-png.freepik.com/512/11702/11702778.png'
                    alt={item.name} 
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-container">
            {activeChat ? (
              <div>
                <div className="chat-header">
                  <img 
                    src='https://cdn-icons-png.freepik.com/512/11702/11702597.png'
                    alt={activeChat.name} 
                  />
                  <div className="chat-info">
                    <h3>{activeChat.name}</h3>
                    {activeChatType === 'channel' && <p>{activeChat.description}</p>}
                  </div>
                  {activeChatType === 'channel' && (
                    <div className="chat-actions">
                      {!activeChat.members.some(m => m.id === currentUser.id) ? (
                        <button onClick={handleJoinChannel} className="join-btn">
                          Join
                        </button>
                      ) : (
                        <button 
                          onClick={() => openOverlay('info', activeChat)}
                          className="settings-btn"
                        >
                          <img src="https://cdn-icons-png.freepik.com/512/11873/11873503.png" alt="Settings" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {activeChatType === 'channel' ? (
                  <div>
                    <div className="chat-messages">
                    {activeChat.messages?.map(msg => {
                          const isOutgoing = msg.sender === currentUser.id;
                          const timeOptions = { hour: '2-digit', minute: '2-digit' };
                          
                          return (
                            <div 
                              key={msg.id} 
                              className={`message ${isOutgoing ? 'outgoing' : 'incoming'}`}
                            >
                              {!isOutgoing && (
                                <div className="message-header">
                                  <span className="message-sender">{msg.senderName}</span>
                                </div>
                              )}
                              <div className="message-content">{msg.text}</div>
                              <div className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString([], timeOptions)}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {activeChat.members.some(m => m.id === currentUser.id) ? (
                      <div className="message-input">
                        <input
                          type="text"
                          placeholder="Enter message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button onClick={sendMessage} disabled={!messageText.trim()}>
                        Send
                        </button>
                      </div>
                    ) : (
                      <div className="join-prompt">
                        Join the channel to send messages
                      </div>
                    )}
                  </div>
                ) : (
                    <UserInfo 
                      user={activeChat} 
                      onSave={handleSaveUser} 
                      isCurrentUser={activeChat?.id === currentUser.id}
                    />
                  )}
              </div>
            ) : (
              <div className="chat-placeholder">
                Select a chat or create a new channel
              </div>
            )}
          </div>

          {showOverlay && (
            <div className="overlay" onClick={closeOverlay}>
              <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                {overlayType === 'createChannel' && (
                  <div className="channel-form">
                    <h2>Create New Channel</h2>
                    <input
                      type="text"
                      placeholder="Channel name"
                      value={channelForm.name}
                      onChange={(e) => setChannelForm(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                      required
                    />
                    <textarea
                      placeholder="Channel Description"
                      value={channelForm.description}
                      onChange={(e) => setChannelForm(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                    />
                    <div className="form-actions">
                      <button className="cancellation-btn" onClick={closeOverlay}>Cancel</button>
                      <button 
                        className="create-btn" 
                        onClick={createChannel} 
                        disabled={!channelForm.name.trim()}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                )}

                {overlayType === 'info' && overlayData && (
                  <div className="channel-info">
                    <h2>{overlayData.name}</h2>
                    {overlayData.description && (
                      <p className="channel-description">{overlayData.description}</p>
                    )}

                    <div className="members-list">
                      <h3>Members ({overlayData.members?.length || 0})</h3>
                      {overlayData.members?.map(member => (
                        <div key={member.id} className="member-item">
                          <img 
                            src='https://cdn-icons-png.freepik.com/512/11702/11702778.png'
                            alt={member.name} 
                          />
                          <span>{member.name} {member.isAdmin && '(Admin)'}</span>
                          {overlayData.adminId === currentUser.id && !member.isAdmin && (
                            <button 
                              onClick={() => removeUserFromChannel(member.id)}
                              className="remove-btn"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {overlayData.adminId === currentUser.id && (
                      <div className="channel-admin-actions">
                        <div className="add-member">
                          <h3>Add member</h3>
                          <select
                            onChange={(e) => {
                              addUserToChannel(e.target.value);
                              e.target.value = '';
                            }}
                          >
                            <option value="">Select user</option>
                            {users
                              .filter(user => 
                                !overlayData.members?.some(m => m.id === user.id)
                              )
                              .map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <button 
                          className="btn-danger"
                          onClick={() => deleteChannel(overlayData.id)}
                        >
                          Delete channel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// render the component to the DOM
ReactDOM.render(<App />, document.getElementById('root'));
