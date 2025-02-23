import React from 'react';

const ChatForm = ({
    channelForm, 
    setChannelForm, 
    closeOverlay, 
    createChannel
}) => {
    return (
        <div className="channel-form">
        <h2>Create New Channel</h2>
        <input
          type="text"
          placeholder="Channel Name"
          value={channelForm.name}
          onChange={(e) => setChannelForm(prev => ({
            ...prev,
            name: e.target.value
          }))}
          required
        />
        <textarea
          placeholder="Description"
          value={channelForm.description}
          onChange={(e) => setChannelForm(prev => ({
            ...prev,
            description: e.target.value
          }))}
        />
        <div className="form-actions">
          <button className="cancel-btn" onClick={closeOverlay}>
            Cancel
          </button>
          <button 
            className="create-btn" 
            onClick={createChannel} 
            disabled={!channelForm.name.trim()}
          >
            Create
          </button>
        </div>
      </div>
    );
};

export default ChatForm;