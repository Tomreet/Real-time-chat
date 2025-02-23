import React from 'react';
import MemberItem from './MemberItem';

const ChannelModal = ({
    overlayData,
    currentUser,
    removeUserFromChannel,
    addUserToChannel,
    users = [],
    deleteChannel
}) => {
    return (
        <div className="channel-info">
        <h2>{overlayData.name}</h2>
        {overlayData.description && (
          <p className="channel-description">{overlayData.description}</p>
        )}

        <div className="members-list">
          <h3>Members ({overlayData.members?.length || 0})</h3>
          {overlayData.members?.map(member => (
            <MemberItem 
                key={member.id}
                member={member} 
                overlayData={overlayData} 
                currentUser={currentUser} 
                removeUserFromChannel={removeUserFromChannel}
            />
          ))}
        </div>

        {overlayData.adminId === currentUser.id && (
          <div className="channel-admin-actions">
            <div className="add-member">
              <h3>Add Member</h3>
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
              className="delete-channel-btn"
              onClick={() => deleteChannel(overlayData.id)}
            >
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdHJhc2gtMiI+PHBhdGggZD0iTTMgNmgxOCIvPjxwYXRoIGQ9Ik0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjYiLz48cGF0aCBkPSJNOCA2VjRjMC0xIDEtMiAyLTJoNGMxIDAgMiAxIDIgMnYyIi8+PGxpbmUgeDE9IjEwIiB4Mj0iMTAiIHkxPSIxMSIgeTI9IjE3Ii8+PGxpbmUgeDE9IjE0IiB4Mj0iMTQiIHkxPSIxMSIgeTI9IjE3Ii8+PC9zdmc+" alt=""/>
              Delete Channel
            </button>
          </div>
        )}
      </div>
    );
};

export default ChannelModal;