require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// In-memory database (replace with real database for production)
let models = [];
let modelIdCounter = 1;

// =====================
// API Routes
// =====================

// Get all models
app.get('/api/models', (req, res) => {
  try {
    res.json({
      success: true,
      data: models,
      count: models.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch models',
      message: error.message
    });
  }
});

// Get single model by ID
app.get('/api/models/:id', (req, res) => {
  try {
    const model = models.find(m => m.id === parseInt(req.params.id));
    if (!model) {
      return res.status(404).json({
        success: false,
        error: 'Model not found'
      });
    }
    res.json({
      success: true,
      data: model
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch model',
      message: error.message
    });
  }
});

// Create new model
app.post('/api/models', (req, res) => {
  try {
    const { name, hair, eyes, personality, bio, image } = req.body;

    // Validation
    if (!name || !hair || !eyes || !personality || !bio) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'hair', 'eyes', 'personality', 'bio']
      });
    }

    if (name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Model name cannot be empty'
      });
    }

    if (bio.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Bio must be at least 10 characters'
      });
    }

    const model = {
      id: modelIdCounter++,
      name: name.trim(),
      hair,
      eyes,
      personality,
      bio: bio.trim(),
      image: image || null,
      createdAt: new Date().toISOString(),
      followers: 0,
      engagement: 0
    };

    models.push(model);
    res.status(201).json({
      success: true,
      data: model,
      message: 'Model created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create model',
      message: error.message
    });
  }
});

// Update model
app.put('/api/models/:id', (req, res) => {
  try {
    const modelIndex = models.findIndex(m => m.id === parseInt(req.params.id));
    if (modelIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Model not found'
      });
    }

    const { name, hair, eyes, personality, bio } = req.body;
    const updatedModel = {
      ...models[modelIndex],
      name: name !== undefined ? name.trim() : models[modelIndex].name,
      hair: hair || models[modelIndex].hair,
      eyes: eyes || models[modelIndex].eyes,
      personality: personality || models[modelIndex].personality,
      bio: bio !== undefined ? bio.trim() : models[modelIndex].bio,
      updatedAt: new Date().toISOString()
    };

    models[modelIndex] = updatedModel;
    res.json({
      success: true,
      data: updatedModel,
      message: 'Model updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update model',
      message: error.message
    });
  }
});

// Delete model
app.delete('/api/models/:id', (req, res) => {
  try {
    const modelIndex = models.findIndex(m => m.id === parseInt(req.params.id));
    if (modelIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Model not found'
      });
    }

    const deletedModel = models.splice(modelIndex, 1)[0];
    res.json({
      success: true,
      data: deletedModel,
      message: 'Model deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete model',
      message: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// =====================
// Serve HTML Frontend
// =====================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log('\n==========================================');
  console.log('AI Influencer Studio Running');
  console.log(`URL: http://${HOST}:${PORT}`);
  console.log('==========================================\n');
});

module.exports = app;
