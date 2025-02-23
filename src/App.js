import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import {loadUsers, saveUsers, loadChannels, saveChannels} from './services/api.js'
import AuthForm from './components/auth/AuthForm.jsx';
import RegisterForm from './components/auth/RegisterForm.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import ChatContainer from './components/chat/ChatContainer.jsx';
import ChannelInfo from './components/chat/ChannelInfo.jsx';
import MyBackground from './components/UI/MyBackground.jsx';
import './App.css';

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
  const [messageText, setMessageText] = useState('');
  const [channelForm, setChannelForm] = useState({
    name: '',
    description: '',
    avatar: ''
  });
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUserRef = useRef();

  // Функции управления каналами
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
      socket.current.emit('channels-updated', updated);
      return updated;
    });
  };

  const setActiveChat = (chat) => {
    setActiveChatId(chat.id);
    setActiveChatType(chat.type);
  };
  
  currentUserRef.current = currentUser;
  
  const activeChat = activeChatType === 'channel' 
    ? channels.find(c => c.id === activeChatId)
    : users.find(u => u.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

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

  useEffect(() => { 
    if (currentUser) {
      socket.current = io('http://localhost:3001');
      
      socket.current.on('message', (message) => {
        setChannels(prev => prev.map(channel => 
          channel.id === message.channelId ? {
            ...channel,
            messages: [...channel.messages, message]
          } : channel
        ));
      });

      socket.current.on('users-updated', setUsers);
      socket.current.on('channels-updated', setChannels);

      return () => socket.current.disconnect();
    }
  }, [currentUser]);

  const sendMessage = async () => {
    if (!messageText.trim() || !activeChat || activeChatType !== 'channel') return;

    const newMessage = {
      id: uuidv4(),
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

    const updatedChannels = channels.map(channel => {
      if (channel.id === activeChatId && 
          !channel.members.some(m => m.id === currentUser.id)) {
        return {
          ...channel,
          members: [...channel.members, {
            id: currentUser.id,
            name: currentUser.name,
            isAdmin: false
          }]
        };
      }
      return channel;
    });
    
    await saveChannels(updatedChannels);
    setChannels(updatedChannels);
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
    
    if (activeChatId === channelId) {
      setActiveChatId(null);
      setActiveChatType(null);
    }
    closeOverlay();
  };
  
  const handleSaveUser = async (updatedUser) => {
    const users = await loadUsers();
    const existing = users.some(u => 
      (u.name === updatedUser.name || u.password === updatedUser.password) && 
      u.id !== updatedUser.id
    );
  
    if (existing) {
      alert('Name or password already taken');
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
        useState={useState}
        loadUsers={loadUsers}
      />
    ) : (
      <RegisterForm 
        onRegister={setCurrentUser}
        switchToLogin={() => setAuthView('login')}
        useState={useState}
        loadUsers={loadUsers}
        saveUsers={saveUsers}
      />
    );
  }
  
  return (

    <MyBackground 
      main={
        <div className="chat-app">
        <div className="chat-app-grid">
          <Sidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            view={view}
            setView={setView}
            currentUser={currentUser}
            users={users}
            channels={channels}
            openOverlay={openOverlay}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
          />
  
          <ChatContainer
            activeChatType={activeChatType}
            activeChat={activeChat} 
            currentUser={currentUser} 
            handleJoinChannel={handleJoinChannel} 
            openOverlay={openOverlay} 
            messagesEndRef={messagesEndRef} 
            messageText={messageText} 
            setMessageText={setMessageText} 
            sendMessage={sendMessage} 
            handleSaveUser={handleSaveUser}
            setCurrentUser={setCurrentUser}
          />
  
          {showOverlay && (
            <ChannelInfo
            createChannel={createChannel}
            channelForm={channelForm}
            setChannelForm={setChannelForm}
            overlayType={overlayType}
            closeOverlay={closeOverlay}
            overlayData={overlayData} 
            currentUser={currentUser} 
            removeUserFromChannel={removeUserFromChannel} 
            addUserToChannel={addUserToChannel} 
            users={users} 
            deleteChannel={deleteChannel}
            />
          )}
        </div>
      </div>
      }
    />
  );
  }
  

export default App;
