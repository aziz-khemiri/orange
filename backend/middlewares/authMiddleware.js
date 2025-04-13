const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token reçu:', token); // Debug token
    
    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log('Token décodé:', decodedToken); // Debug payload
    
    const user = await User.findById(decodedToken.userId);
    if (!user) throw new Error('Utilisateur non trouvé');

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur auth middleware:', error.message);
    res.status(401).json({ error: 'Authentification échouée' });
  }
};