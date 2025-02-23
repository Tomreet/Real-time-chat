const getAuthHeader = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? { 'X-User-ID': currentUser.id } : {};
};

export const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users.json')
  
      const text = await response.text();
  
      // Проверяем, содержит ли ответ HTML
      if (text.startsWith('<!DOCTYPE html>')) {
        throw new Error('Сервер вернул HTML вместо JSON');
      }
  
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.statusText}`);
      }
  
      return JSON.parse(text);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      return [];
    }
};

export const saveUsers = async (users) => {
    try {
      const response = await fetch('http://localhost:3001/users.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users),
      });
  
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error(`Ошибка сохранения: ${response.statusText}`);
      }
  
      return true; // Успешное сохранение
    } catch (error) {
      console.error('Ошибка сохранения пользователей:', error);
      return false; // Ошибка сохранения
    }
};

export const loadChannels = async () => {
    try {
      const response = await fetch('http://localhost:3001/channels.json', {
        headers: getAuthHeader()
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки каналов:', error);
      return [];
    }
};

export const saveChannels = async (channels) => {
    try {
      const response = await fetch('http://localhost:3001/channels.json', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(channels),
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка сохранения: ${response.statusText}`);
      }
  
      return true; // Успешное сохранение
    } catch (error) {
      console.error('Ошибка сохранения каналов:', error);
      return false; // Ошибка сохранения
    }
};