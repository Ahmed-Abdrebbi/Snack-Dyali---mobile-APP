import express from 'express';
import cors from 'cors';
import platsRoutes from './routes/plats.routes.js';
import { apiReference } from '@scalar/express-api-reference';
import { openapiSpec } from './docs/openapi.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plats', platsRoutes);

// Documentation Scalar UI
app.use('/docs', apiReference({
  spec: {
    content: openapiSpec,
  },
}));

// Route par défaut (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

export default app;