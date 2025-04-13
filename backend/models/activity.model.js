const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Main activity schema with embedded Objectif sub-schema
const activitySchema = new Schema({
    Categorie: {
        type: String,
        required: [true, "La catégorie est obligatoire"],
        trim: true
    },
    Description: {
        type: String,
        required: [true, "La description est obligatoire"],
        trim: true
    },
    Objectif: {  // Sub-schema intégré directement
        duree: {
            type: String,
            required: [true, "La durée est obligatoire"],
            trim: true
        },
        difficulte: {
            type: String,
            required: [true, "La difficulté est obligatoire"],
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner"
        },
        frequence: {
            type: String,
            required: [true, "La fréquence est obligatoire"],
            trim: true
        }
    },
    idActivite: {
        type: Number,
        unique: true,
        required: [true, "L'identifiant de l'activité est obligatoire"]
    },
    TypeActivite: {
        type: String,
        required: [true, "Le type d'activité est obligatoire"],
        trim: true,
        enum: ["Cardio", "Strength Training", "Yoga", "Pilates", "Other"]
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('siaziz', activitySchema);
