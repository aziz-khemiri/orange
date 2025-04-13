const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jourSchema = new Schema({
  jour: {
    type: String,
    required: true,
    enum: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
  },
  activite_physique_id: {
    type: Schema.Types.ObjectId,
    ref: 'siazizs', 
    required: true
  },
  activite_nutrition_id: {
    type: Schema.Types.ObjectId,
    ref: 'siazizs',
    required: true
  },
  activite_physique2_id: { 
    type: Schema.Types.ObjectId,
    ref: 'siazizs',
    default: null
  }
});

const semaineSchema = new Schema({
  semaine: [jourSchema]
}, { timestamps: true });

module.exports = mongoose.model('Semaine', semaineSchema);
