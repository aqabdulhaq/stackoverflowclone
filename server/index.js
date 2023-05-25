import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

import userRoutes from './routes/users.js';
import questionRoutes from './routes/Questions.js';
import answerRoutes from './routes/Answers.js';
import connectDB from './connectMongoDb.js';

dotenv.config();
connectDB();
const app = express();
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/user', userRoutes);
app.use('/questions', questionRoutes);
app.use('/answer', answerRoutes);

app.get('/', (req, res) => {

  res.send('Hello, welcome to the server!');
});

const PORT = process.env.PORT || 5000;

// Dialogflow integration
const projectId = process.env.PROJECT_ID;
const sessionClient = new SessionsClient({
  keyFilename: process.env.SERVICE_KEY,
});

app.post('/api/chatbot', async (req, res) => {
  const { query } = req.body;

  try {
    const sessionId = uuidv4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: 'en',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ response: result.fulfillmentText });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});