import React from 'react';
import MessageImput from './MessageImput';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Message from './Message';

const ChatMessages = ({
    activeChat,
    currentUser,
    messagesEndRef,
    messageText,
    setMessageText,
    sendMessage
}) => {
    const [animationParent] = useAutoAnimate()

    return (
        <div>
        <div className="chat-messages" ref={animationParent}>
          {activeChat.messages?.map((msg, index) => {
            const isOutgoing = msg.sender === currentUser.id;
            const timeOptions = { hour: '2-digit', minute: '2-digit' };
            
            return (
                <Message
                    key={`${msg.id}-${index}`}
                    msg={msg}
                    isOutgoing={isOutgoing}
                    timeOptions={timeOptions}
                />
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {activeChat.members.some(m => m.id === currentUser.id) ? (
          <MessageImput
            messageText={messageText}
            setMessageText={setMessageText}
            sendMessage={sendMessage}
          />
        ) : (
          <div className="join-prompt">
            Join the channel to send messages
          </div>
        )}
      </div>
    );
};

export default ChatMessages;