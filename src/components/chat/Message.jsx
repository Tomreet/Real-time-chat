import React from 'react';

const Message = ({
    msg,
    isOutgoing,
    timeOptions
}) => {
    return (
        <div  
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
};

export default Message;