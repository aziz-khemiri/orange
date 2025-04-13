import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          🍊 <Text style={styles.orange}>Orange</Text>
          <Text style={styles.sense}>Sense</Text>{' '}
          <Text style={styles.dashboard}>Dashboard</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Summary')}
          accessibilityLabel="Navigate to Summary"
        >
          <Text style={styles.buttonText}>📊 Résumé</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Trends')}
          accessibilityLabel="Navigate to Trends Analysis"
        >
          <Text style={styles.buttonText}>📈 Analyse des tendances</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('History')}
          accessibilityLabel="Navigate to History"
        >
          <Text style={styles.buttonText}>📅 Historique</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Tracking')}
          accessibilityLabel="Navigate to Drone Tracking"
        >
          <Text style={styles.buttonText}>🛰️ Suivi par drone</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6E0',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF8C00',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  orange: {
    color: '#FF8C00',
  },
  sense: {
    color: '#FF4500',
  },
  dashboard: {
    color: '#444',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF8C00',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    maxWidth: 300,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});