const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      profileImage: '', // Image par défaut
    });

    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Connexion
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide' });
    }

    // Valider le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Connexion réussie', token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Déconnexion
exports.logoutUser = (req, res) => {
  try {
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclure les mots de passe
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les informations de l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token depuis les en-têtes
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET); // Décoder le token
    const user = await User.findById(decodedToken.userId).select('-password'); // Récupérer l'utilisateur

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, gender, age, height, birthday, category } = req.body;
    let profileImage = req.file ? req.file.path : undefined; // Si une image est uploadée

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, gender, age, height, birthday, category, ...(profileImage && { profileImage }) },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Profil mis à jour avec succès', updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware pour l'upload d'image
exports.uploadProfileImage = upload.single('profileImage');