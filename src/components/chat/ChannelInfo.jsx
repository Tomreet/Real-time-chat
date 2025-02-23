import React from 'react';
import ChatForm from './ChatForm';
import ChannelModal from './ChannelModal';

const ChannelInfo = ({
    createChannel,
    channelForm,
    setChannelForm,
    overlayType,
    closeOverlay,
    overlayData, 
    currentUser, 
    removeUserFromChannel, 
    addUserToChannel, 
    users = [], 
    deleteChannel
}) => {
    return (

        <div className="overlay" onClick={closeOverlay}>
        <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
          {overlayType === 'createChannel' && (
            <ChatForm 
              channelForm={channelForm} 
              setChannelForm={setChannelForm} 
              closeOverlay={closeOverlay} 
              createChannel={createChannel}
            />
          )}

          {overlayType === 'info' && overlayData && (
            <ChannelModal 
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

    );
};

export default ChannelInfo;