import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: Constants.expoConfig.extra?.API_URL || 'http://192.168.1.41:5000/api',
   // baseURL: Constants.expoConfig.extra?.API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Intercepteur de requête
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('userToken');
      // Rediriger vers l'écran de login si nécessaire
    }
    return Promise.reject(error);
  }
);

// Fonction pour sauvegarder les données de santé
export const saveHealthData = async (healthData) => {
  try {
    const response = await api.post('/health-data', healthData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
  }
};



// Fonction pour réinitialiser le mot de passe

export const checkEmail = async (email) => {
    if (!email) {
      throw new Error("L'email est requis");
    }
  
    try {
      const response = await api.post('/auth/check-email', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "L'email n'existe pas");
    }
  };
  
  export const resetPassword = async (userId, newPassword) => {
    if (!userId || !newPassword) {
      throw new Error("L'ID utilisateur et le nouveau mot de passe sont requis");
    }
  
    try {
      const response = await api.post('/auth/reset-password', { 
        userId,
        newPassword 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la réinitialisation du mot de passe');
    }
  };
  export const updatePassword1 = async (oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
      throw new Error("L'ancien mot de passe et le nouveau mot de passe sont requis");
    }
  
    try {
      const response = await api.post('/auth/update-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour du mot de passe');
    }
  };
  // Ajout des fonctions pour les activités
  export const getDailyActivities = async () => {
    try {
      const response = await api.get('/activities/daily');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération des activités du jour'
      );
    }
  };
// Fonctions supplémentaires peuvent être ajoutées ici
export default api;