const HealthData = require('../models/dataUser.model');

const saveHealthData = async (req, res) => {
  try {
    console.log('Utilisateur authentifié:', req.user); // Debug 1
    const userId = req.user._id;
    
    console.log('Données reçues:', req.body); // Debug 2
    
    const newHealthData = new HealthData({
      userId,
      ...req.body
    });

    await newHealthData.save();
    console.log('Données sauvegardées DB:', newHealthData); // Debug 3
    res.status(201).json({ message: 'Success!', data: newHealthData });
  } catch (error) {
    console.error('Erreur sauvegarde:', error); // Debug 4
    res.status(500).json({ message: error.message });
  }
};

const getHealthData = async (req, res) => {
  const { userId } = req.params;

  try {
    const healthData = await HealthData.find({ userId }).sort({ createdAt: -1 });
    if (healthData.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée de santé trouvée pour cet utilisateur.' });
    }
    res.status(200).json({ message: 'Données de santé récupérées avec succès !', data: healthData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données de santé', error: error.message });
  }
};

// Nouvelle fonction pour récupérer un document par son ID
const getHealthDataById = async (req, res) => {
  const { id } = req.params;

  try {
    const healthData = await HealthData.findById(id);
    
    if (!healthData) {
      return res.status(404).json({ message: 'Donnée de santé non trouvée.' });
    }
    
    // Vérifier que l'utilisateur a le droit d'accéder à ces données
    // (optionnel - selon votre logique d'autorisation)
    if (req.user._id.toString() !== healthData.userId.toString()) {
      return res.status(403).json({ message: 'Non autorisé à accéder à ces données.' });
    }
    
    res.status(200).json({ 
      message: 'Donnée de santé récupérée avec succès !', 
      data: healthData 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la donnée de santé', 
      error: error.message 
    });
  }
};

const saveMultipleHealthData = async (req, res) => {
  const { userId, healthDataArray } = req.body; // healthDataArray est un tableau de données de santé

  try {
    const savedData = await HealthData.insertMany(
      healthDataArray.map(data => ({ userId, ...data })) // Associer userId à chaque entrée
    );
    res.status(201).json({ message: 'Données de santé enregistrées avec succès !', data: savedData });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement :', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement des données de santé', error: error.message });
  }
};

module.exports = {
  saveHealthData,
  getHealthData,
  getHealthDataById, // Exportez la nouvelle fonction
  saveMultipleHealthData,
};