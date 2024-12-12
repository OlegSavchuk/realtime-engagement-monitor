const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const faceapi = require('face-api.js');
const { Canvas, Image } = require('canvas');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');
const NodeWebcam = require('node-webcam');

// Load face-api models
const MODEL_URL = path.join(__dirname, 'models');
faceapi.env.monkeyPatch({ Canvas, Image });

// Initialize face-api
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
  faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_URL)
]).then(startServer);

// Engagement levels
const engagementLevels = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  UNKNOWN: 'Unknown'
};

// Engagement history
const engagementHistory = [];
const MAX_HISTORY = 100;

// Create a chart
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 400, height: 200 });

// Setup webcam
const webcam = NodeWebcam.create({
  width: 640,
  height: 480,
  quality: 100,
  output: "jpeg",
  device: false,
  callbackReturn: "buffer"
});

function startServer() {
  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  setInterval(async () => {
    webcam.capture("test_picture", async (err, data) => {
      if (err) {
        console.error("Failed to capture image:", err);
        return;
      }

      const image = data.toString('base64');
      
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + image;
      
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const engagementData = processEngagement(detections);
      
      const chart = await createEngagementChart();

      io.emit('frame', { image, engagementData, chart });
    });
  }, 1000);

  http.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

function processEngagement(detections) {
  const engagedEmotions = ['neutral', 'happy', 'surprised'];
  let totalEngagement = 0;
  let faceCount = 0;

  detections.forEach(detection => {
    const { expressions } = detection;
    let engagementScore = 0;

    engagedEmotions.forEach(emotion => {
      engagementScore += expressions[emotion];
    });

    totalEngagement += engagementScore;
    faceCount++;
  });

  const averageEngagement = faceCount > 0 ? totalEngagement / faceCount : 0;
  const engagementLevel = getEngagementLevel(averageEngagement);

  engagementHistory.push(averageEngagement);
  if (engagementHistory.length > MAX_HISTORY) {
    engagementHistory.shift();
  }

  return {
    level: engagementLevel,
    score: averageEngagement,
    faceCount
  };
}

function getEngagementLevel(score) {
  if (score > 0.7) return engagementLevels.HIGH;
  if (score > 0.4) return engagementLevels.MEDIUM;
  if (score > 0) return engagementLevels.LOW;
  return engagementLevels.UNKNOWN;
}

async function createEngagementChart() {
  const config = {
    type: 'line',
    data: {
      labels: Array.from({ length: engagementHistory.length }, (_, i) => i + 1),
      datasets: [{
        label: 'Engagement Level',
        data: engagementHistory,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 1
        }
      }
    }
  };

  const chartBuffer = await chartJSNodeCanvas.renderToBuffer(config);
  return chartBuffer.toString('base64');
}