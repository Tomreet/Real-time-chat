

// Функции управления каналами
export const addUserToChannel = ({
    userId, 
    users=[], 
    overlayData, 
    setChannels, 
    setOverlayData, 
    saveChannels, 
    socket
}) => {

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

export const removeUserFromChannel = ({
    userId, 
    overlayData, 
    setChannels, 
    setOverlayData, 
    saveChannels, 
    socket
}) => {

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

