const mongoose = require('mongoose');

const dataUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Clé étrangère vers l'utilisateur
  weight: { type: Number, required: true },
  bloodType: { type: String, required: true },
  bloodPressure: { type: String, required: true },
  heartRate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('aziz', dataUserSchema);