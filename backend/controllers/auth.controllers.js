const User = require('../models/User.model');
const bcrypt = require('bcrypt');

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier si l'email existe dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Email non trouvé' });
    }

    // Renvoyer l'ID de l'utilisateur
    res.status(200).json({ userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // Valider la longueur du mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Trouver l'utilisateur par son ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Sauvegarder les modifications
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Récupérer l'ID de l'utilisateur connecté depuis le middleware d'authentification

    // Trouver l'utilisateur par son ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Ancien mot de passe incorrect' });
    }

    // Valider la longueur du nouveau mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Sauvegarder les modifications
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};