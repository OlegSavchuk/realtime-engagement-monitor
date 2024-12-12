# Real-time Engagement Monitor 🎯

A sophisticated real-time facial analysis system that monitors user engagement during video streams. Built with face-api.js, this system provides instant feedback on audience engagement through emotion detection, gaze tracking, and comprehensive analytics.

![System Architecture](/images/architecture.png)

## 🚀 Features

- **Real-time Face Detection** - Tracks multiple faces simultaneously
- **Emotion Analysis** - Detects 7 basic emotions (neutral, happy, sad, angry, fearful, disgusted, surprised)
- **Gaze Tracking** - Monitors attention direction
- **Engagement Scoring** - Real-time engagement level calculation
- **Data Visualization** - Live charts and metrics
- **Session Recording** - Comprehensive engagement data logging

![App in action](/images/app.png)

## 📊 Sample Output

```json
{
  "timestamp": "2024-12-11T23:50:16.122Z",
  "overallEngagementLevel": "High",
  "averageEngagement": 0.997,
  "overallGazeStatus": "Looking at camera",
  "averageGazeScore": 0.970,
  "overallEmotion": "neutral",
  "emotionSummary": {
    "neutral": 1
  },
  "faceCount": 1
}
```

## 🛠️ Technical Stack

- **Frontend**: HTML5, Canvas API
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Face Detection**: face-api.js
- **Data Visualization**: Chart.js
- **Machine Learning**: TensorFlow.js (via face-api.js)

## 📋 Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)
- Webcam access
- Modern web browser (Chrome recommended)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/realtime-engagement-monitor.git
cd realtime-engagement-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Download face-api.js models:
```bash
# Create models directory
mkdir -p public/models

# Download models from face-api.js GitHub repository
# Place them in the public/models directory
```

4. Start the server:
```bash
node server.js
```

5. Access the application:
```
Open http://localhost:3000 in your browser
```

## 📁 Project Structure

```
/
├── server.js           # Main server file
├── package.json        # Dependencies
├── public/
│   ├── index.html     # Frontend interface
│   └── script.ts      # Processing logic
└── models/            # face-api.js models
```

## 💻 Usage

1. Grant camera permissions when prompted
2. The system will automatically:
   - Detect faces in the video feed
   - Analyze emotions and engagement
   - Track gaze direction
   - Generate real-time metrics
   - Log engagement data

## 📈 Data Analysis

The system tracks multiple metrics:

- **Engagement Levels**: High, Medium, Low
- **Emotions**: 7 basic emotional states
- **Gaze Direction**: Camera focus tracking
- **Session Statistics**: Comprehensive engagement data

## 🔍 How It Works

1. **Video Capture**
   - Real-time webcam feed processing
   - Face detection using TinyFaceDetector

2. **Analysis Pipeline**
   - Facial landmark detection
   - Expression analysis
   - Gaze direction calculation
   - Engagement score computation

3. **Data Processing**
   - Real-time metric generation
   - JSON-based data logging
   - Session history tracking

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 📞 Contact

- Your Name - [@OlehSavcuk](https://x.com/OlehSavcuk)

---
