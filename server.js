const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('trackingData', async (data) => {
    try {
      const timestamp = new Date().toISOString();
      const trackingEntry = {
        timestamp,
        ...data
      };

      // Read existing data
      let existingData = [];
      try {
        const fileContent = await fs.readFile('tracking_data.json', 'utf-8');
        existingData = JSON.parse(fileContent);
      } catch (error) {
        // If file doesn't exist or is empty, start with an empty array
        console.log('No existing data found, starting fresh.');
      }

      // Add new entry
      existingData.push(trackingEntry);

      // Write updated data back to file
      await fs.writeFile('tracking_data.json', JSON.stringify(existingData, null, 2));
      console.log('Engagement, gaze, and emotion data saved successfully');
    } catch (error) {
      console.error('Error saving tracking data:', error);
    }
  });
});

http.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});