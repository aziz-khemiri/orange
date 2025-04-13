const mongoose = require('mongoose');
const HealthData = require('../models/dataUser.model');
const User = require('../models/User.model'); // Supposons que vous avez un modèle User

const MONGODB_URI = "mongodb+srv://medazizkhemiri23:aziz1234@ypE0I2RwTxfrnbWH.kwwtg.mongodb.net/pfe";

async function checkEmailExists(email) {
  try {
    const user = await User.findOne({ email: email });
    return !!user; // Retourne true si l'email existe
  } catch (error) {
    console.error('❌ Erreur de recherche:', error.message);
    return false;
  }
}

async function checkData() {
  try {
    console.log('🔍 URI:', MONGODB_URI);

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ Connecté à MongoDB Atlas');

    // Vérification de données existantes
    const data = await HealthData.find();
    console.log('📊 Données trouvées:', data.length);

    // Vérification d'un email spécifique
    const testEmail = 'utilisateur@example.com';
    const emailExists = await checkEmailExists(testEmail);
    
    console.log(emailExists ? 
      `📩 L'email ${testEmail} existe dans la base` :
      `📭 L'email ${testEmail} n'existe pas`);

  } catch (error) {
    console.error('❌ Erreur principale:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Déconnexion de MongoDB');
  }
}

// Exemple d'utilisation
checkData();

/* Pour utiliser depuis un autre fichier :
const emailCheck = await checkEmailExists('test@example.com');
*/