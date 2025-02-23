import { Settings } from 'lucide-react';
import React from 'react';
import MyButton from '../UI/MyButton';

const ChatHeader = ({
    activeChat,
    activeChatType,
    currentUser,
    handleJoinChannel,
    openOverlay,
}) => {
    return (
        <div className="chat-header">
        <img
        src={activeChat.avatar || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtc2xhY2siPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjgiIHg9IjEzIiB5PSIyIiByeD0iMS41Ii8+PHBhdGggZD0iTTE5IDguNVYxMGgxLjVBMS41IDEuNSAwIDEgMCAxOSA4LjUiLz48cmVjdCB3aWR0aD0iMyIgaGVpZ2h0PSI4IiB4PSI4IiB5PSIxNCIgcng9IjEuNSIvPjxwYXRoIGQ9Ik01IDE1LjVWMTRIMy41QTEuNSAxLjUgMCAxIDAgNSAxNS41Ii8+PHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iMyIgeD0iMTQiIHk9IjEzIiByeD0iMS41Ii8+PHBhdGggZD0iTTE1LjUgMTlIMTR2MS41YTEuNSAxLjUgMCAxIDAgMS41LTEuNSIvPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjMiIHg9IjIiIHk9IjgiIHJ4PSIxLjUiLz48cGF0aCBkPSJNOC41IDVIMTBWMy41QTEuNSAxLjUgMCAxIDAgOC41IDUiLz48L3N2Zz4='}
          alt={activeChat.name} 
        />
        <div className="chat-info">
          <h3>{activeChat.name}</h3>
        </div>
        {activeChatType === 'channel' && (
          <div className="chat-actions">
            {!activeChat.members.some(m => m.id === currentUser.id) ? (
            <MyButton
                onClick={handleJoinChannel} 
                className="join-btn"
                text={"Join"}
            />
            ) : (
            <MyButton 
                onClick={() => openOverlay('info', activeChat)}
                className="settings-btn"
                icon={<Settings color='#000000' strokeWidth={0.5} size={60}/>}
            />
            )}
          </div>
        )}
      </div>
    );
};

export default ChatHeader;