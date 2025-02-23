import React from 'react';
import MyButton from '../UI/MyButton';

const MessageImput = ({
    messageText,
    setMessageText,
    sendMessage 
}) => {
    return (
        <div className="message-input">
            <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />

            <MyButton
                onClick={sendMessage} 
                disabled={!messageText.trim()}
                text={<span>{"Send"}</span>}
            />
        </div>
    );
};

export default MessageImput;