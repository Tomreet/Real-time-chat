import React from 'react';
import SearchBar from './SearchBar';
import MenuButtons from './MenuButtons';
import MenuItems from './MenuItems';


const Sidebar = ({ 
  searchTerm, 
  setSearchTerm, 
  view, 
  setView, 
  currentUser, 
  users = [], 
  channels = [], 
  openOverlay, 
  activeChat, 
  setActiveChat 
}) => {
    
    return (
        <div className="sidebar">
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <MenuButtons
            view={view}
            setView={setView}
          />

          <MenuItems
            view={view}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            currentUser={currentUser}
            users={users}
            channels={channels}
            openOverlay={openOverlay}
            searchTerm={searchTerm}
          />

      </div>
    );
};

export default Sidebar;