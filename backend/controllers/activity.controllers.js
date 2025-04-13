const Activity = require('../models/activity.model');
const Semaine = require('../models/semaine.model');

// Récupérer les activités du jour actuel
exports.getDailyActivities = async (req, res) => {
  try {
    // Tableau des jours de la semaine
    const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const today = new Date();
    const jourActuel = jours[today.getDay()]; // Récupère le jour actuel
    
    // Trouver la semaine et le jour correspondant
    const semaine = await Semaine.findOne();
    if (!semaine) {
      return res.status(404).json({ message: "Aucune semaine trouvée" });
    }
    
    const jour = semaine.semaine.find(j => j.jour === jourActuel);
    if (!jour) {
      return res.status(404).json({ message: "Aucune activité prévue pour aujourd'hui" });
    }
    
    // Récupérer toutes les activités du jour
    const activitePhysique = await Activity.findById(jour.activite_physique_id);
    const activiteNutrition = await Activity.findById(jour.activite_nutrition_id);
    const activitePhysique2 = jour.activite_physique2_id 
      ? await Activity.findById(jour.activite_physique2_id) 
      : null;
    
    const activites = {
      physique: activitePhysique,
      nutrition: activiteNutrition,
      physique2: activitePhysique2
    };
    
    res.status(200).json({
      jour: jourActuel,
      activites
    });
    
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur",
      details: err.message 
    });
  }
};