const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({
  origin: 'http://localhost:8081', // Remplacez par l'URL de votre application React Native
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));