import React from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import UserInfo from '../user/UserInfo';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';

const ChatContainer = ({
    onShowMenu,
    activeChatType,
    activeChat, 
    currentUser, 
    handleJoinChannel, 
    openOverlay, 
    messagesEndRef, 
    messageText, 
    setMessageText, 
    sendMessage, 
    handleSaveUser,
    setCurrentUser
}) => {

  const [animationParent] = useAutoAnimate()

    return (
        <div className="chat-container" ref={animationParent}>
        {activeChat ? (
          <div>
            <ChatHeader
              onShowMenu={onShowMenu}
              activeChat={activeChat}
              activeChatType={activeChatType}
              currentUser={currentUser}
              handleJoinChannel={handleJoinChannel}
              openOverlay={openOverlay}
            />

            {activeChatType === 'channel' ? (
              <ChatMessages
                activeChat={activeChat}
                currentUser={currentUser}
                messagesEndRef={messagesEndRef}
                messageText={messageText}
                setMessageText={setMessageText}
                sendMessage={sendMessage}
              />
            ) : (
              <UserInfo 
                user={activeChat} 
                onSave={handleSaveUser} 
                isCurrentUser={activeChat?.id === currentUser.id}
                setCurrentUser={setCurrentUser}
              />
            )}
          </div>
        ) : (
          <div className="chat-placeholder">
            Select a chat or create a new channel
          </div>
        )}
      </div>
    );
};

export default ChatContainer;