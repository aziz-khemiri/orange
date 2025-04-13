// app.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');
const healthDataRoutes = require('./routes/userData.Routes');
const authRoutes = require('./routes/auth.routes');
const activityRoutes = require('./routes/activity.routes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8081', // Limiter aux origines autorisées
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configuration des routes
app.use('/api/users', userRoutes);
app.use('/api/health-data', healthDataRoutes);
app.use('/api/auth', authRoutes); // Préfixe toutes les routes d'authentification
app.use('/uploads', express.static('uploads'));
app.use('/api/activities', activityRoutes);
  

// Connexion DB + Démarrage Serveur
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n=== SERVEUR DÉMARRÉ SUR PORT ${PORT} ===`);
    });
  })
  .catch(error => {
    console.error('Échec de la connexion à la base de données:', error);
    process.exit(1);
  });