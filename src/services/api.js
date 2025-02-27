const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Получение заголовков авторизации
const getAuthHeader = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  return currentUser ? { 
    'X-User-ID': currentUser.id.toString(),
    'Authorization': `Bearer ${currentUser.token || ''}`
  } : {};
};

// Загрузка пользователей
export const loadUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users.json`, {
      headers: getAuthHeader()
    });

    if (response.status === 401) {
      localStorage.removeItem('currentUser');
      window.location.reload();
      return [];
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Received invalid users data format');
    }
    return data;
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Сохранение пользователей
export const saveUsers = async (users) => {
  if (!Array.isArray(users)) {
    console.error('Attempting to save non-array users:', users);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users.json`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(users),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

// Загрузка каналов
export const loadChannels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/channels.json`, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Received invalid channels data format');
    }
    return data;
  } catch (error) {
    console.error('Error loading channels:', error);
    return [];
  }
};

// Сохранение каналов
export const saveChannels = async (channels) => {
  if (!Array.isArray(channels)) {
    console.error('Attempting to save non-array channels:', channels);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/channels.json`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(channels),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error saving channels:', error);
    return false;
  }
};
