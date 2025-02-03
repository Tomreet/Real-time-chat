const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// Initializing files on startup
const initFiles = () => {
  const files = ['users.json', 'channels.json'];
  files.forEach(file => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]');
    }
  });
};

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading ${filePath}`);
  }
};

const writeJSONFile = async (filePath, data) => {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    throw new Error(`Error writing to ${filePath}`);
  }
};

// Routes
app.get('/users.json', async (req, res) => {
  try {
    const users = await readJSONFile('users.json');
    res.json(users);
  } catch (err) {
    res.status(500).send('Error loading users');
  }
});

app.post('/users.json', async (req, res) => {
  try {
    const newUser = req.body;
    const users = await readJSONFile('users.json');
    
    if (users.some(u => u.id === newUser.id)) {
      return res.status(409).send('The user already exists');
    }
    
    users.push(newUser);
    await writeJSONFile('users.json', users);
    
    io.emit('user-created', newUser);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send('Error adding user');
  }
});

app.put('/users.json', async (req, res) => {
  try {
    const updatedUsers = req.body;
    if (!Array.isArray(updatedUsers)) {
      return res.status(400).send('Invalid data format');
    }
    
    await writeJSONFile('users.json', updatedUsers);
    io.emit('users-updated', updatedUsers);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Error updating users');
  }
});

app.get('/channels.json', async (req, res) => {
  try {
    const channels = await readJSONFile('channels.json');
    res.json(channels);
  } catch (err) {
    res.status(500).send('Error loading channels');
  }
});

app.post('/channels.json', async (req, res) => {
  try {
    const newChannel = req.body;
    const channels = await readJSONFile('channels.json');
    
    if (channels.some(c => c.id === newChannel.id)) {
      return res.status(409).send('The channel already exists');
    }
    
    channels.push(newChannel);
    await writeJSONFile('channels.json', channels);
    
    io.emit('channel-created', newChannel);
    res.status(201).json(newChannel);
  } catch (err) {
    res.status(500).send('Error creating channel');
  }
});

app.put('/channels.json', async (req, res) => {
  try {
    const updatedChannels = req.body;
    if (!Array.isArray(updatedChannels)) {
      return res.status(400).send('Invalid data format');
    }
    
    await writeJSONFile('channels.json', updatedChannels);
    io.emit('channels-updated', updatedChannels);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Error updating channels');
  }
});

// WebSocket
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('message', async (data) => {
    try {
      const users = await readJSONFile('users.json');
      const sender = users.find(u => u.id === data.message.sender);
      const enrichedMessage = {
        ...data.message,
        senderName: sender?.name || 'Unknown',
        senderAvatar: sender?.avatar || 'https://cdn-icons-png.freepik.com/512/11702/11702778.png'
      };

      // Updating the channel in channels.json
      const channels = await readJSONFile('channels.json');
      const updatedChannels = channels.map(channel => {
        if (channel.id === data.channelId) {
          return {
            ...channel,
            messages: [...channel.messages, enrichedMessage]
          };
        }
        return channel;
      });

      // Save updated channels
      await writeJSONFile('channels.json', updatedChannels);

      // We are sending the updated channel to all clients
      io.emit('channels-updated', updatedChannels);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('The user has disconnected:', socket.id);
  });
});

// Starting the server
server.listen(PORT, () => {
  initFiles();
  console.log(`The server is running on http://localhost:${PORT}`);
});
