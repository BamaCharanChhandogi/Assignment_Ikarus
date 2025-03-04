const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json'); // You'll need to create this file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const modelsCollection = db.collection('models');

// Middleware
app.use(cors());
app.use(express.json());

// GET /models endpoint
app.get('/models', async (req, res) => {
  try {
    const modelsSnapshot = await modelsCollection.get();
    const models = [];
    
    modelsSnapshot.forEach(doc => {
      models.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// POST /upload endpoint
app.post('/upload', async (req, res) => {
  try {
    const { name, description, url } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }
    
    const newModel = {
      name,
      description: description || '',
      url,
      uploadDate: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await modelsCollection.add(newModel);
    
    res.status(201).json({
      id: docRef.id,
      ...newModel,
      uploadDate: new Date().toISOString() // For response only
    });
  } catch (error) {
    console.error('Error uploading model:', error);
    res.status(500).json({ error: 'Failed to upload model' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});