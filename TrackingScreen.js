import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const TrackingScreen = () => {
  const [dronePosition, setDronePosition] = useState({
    latitude: 36.8065,
    longitude: 10.1815,
  });
  const [flightPath, setFlightPath] = useState([]);
  const [droneStatus, setDroneStatus] = useState({
    battery: 78,
    altitude: 120,
    speed: 12,
    signal: 'Strong'
  });

  // Animation values
  const pulseAnim = new Animated.Value(1);
  const [rotation] = useState(new Animated.Value(0));

  const waypoints = [
    { latitude: 36.8055, longitude: 10.1805, name: 'Sector 1A' },
    { latitude: 36.8055, longitude: 10.182, name: 'Sector 1B' },
    { latitude: 36.807, longitude: 10.1805, name: 'Sector 2A' },
    { latitude: 36.807, longitude: 10.182, name: 'Sector 2B' },
    { latitude: 36.8065, longitude: 10.1815, name: 'Base Station' },
  ];

  // Pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Drone rotation animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const getClosestWaypoint = () => {
    const getDistance = (a, b) =>
      Math.sqrt(
        Math.pow(a.latitude - b.latitude, 2) + Math.pow(a.longitude - b.longitude, 2)
      );
    let closest = waypoints[0];
    let minDist = getDistance(dronePosition, closest);

    for (let wp of waypoints) {
      const dist = getDistance(dronePosition, wp);
      if (dist < minDist) {
        closest = wp;
        minDist = dist;
      }
    }
    return closest;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDronePosition(prev => {
        const newPos = {
          latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
          longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
        };
        setFlightPath(prevPath => [...prevPath, newPos]);
        return newPos;
      });

      setDroneStatus({
        battery: Math.max(70, Math.floor(78 - Math.random() * 5)),
        altitude: Math.floor(115 + Math.random() * 10),
        speed: (10 + Math.random() * 5).toFixed(1),
        signal: ['Strong', 'Medium', 'Weak'][Math.floor(Math.random() * 3)]
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const closestWaypoint = getClosestWaypoint();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="flight" size={28} color="#4a8cff" />
        <Text style={styles.title}>Drone Tracking System</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 36.8065,
            longitude: 10.1815,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          mapType="hybrid"
        >
          {flightPath.length > 1 && (
            <Polyline
              coordinates={flightPath}
              strokeColor="#4a8cff"
              strokeWidth={4}
              lineDashPattern={[1]}
            />
          )}

          <Marker coordinate={dronePosition}>
            <Animated.View style={[
              styles.droneMarker,
              {
                transform: [
                  { scale: pulseAnim },
                  { rotate: rotationInterpolate }
                ]
              }
            ]}>
              <FontAwesome5 name="drone" size={24} color="#4a8cff" />
            </Animated.View>
          </Marker>

          {waypoints.map((wp, index) => (
            <Marker
              key={index}
              coordinate={wp}
              title={wp.name}
              description={wp.name === 'Base Station' ? 'Home position' : `Waypoint ${index + 1}`}
            >
              <View style={[
                styles.waypointMarker,
                wp.name === closestWaypoint.name && styles.activeWaypoint
              ]}>
                <Text style={styles.waypointText}>
                  {wp.name === 'Base Station' ? '🏠' : index + 1}
                </Text>
              </View>
            </Marker>
          ))}

          <Polyline
            coordinates={waypoints}
            strokeColor="#ff7043"
            strokeWidth={2}
            lineDashPattern={[10, 5]}
          />
        </MapView>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Flight Information</Text>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridCard}>
            <MaterialIcons name="battery-full" size={24} color="#4caf50" />
            <Text style={styles.gridValue}>{droneStatus.battery}%</Text>
            <Text style={styles.gridLabel}>Battery</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialIcons name="terrain" size={24} color="#2196f3" />
            <Text style={styles.gridValue}>{droneStatus.altitude}m</Text>
            <Text style={styles.gridLabel}>Altitude</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialIcons name="speed" size={24} color="#ff9800" />
            <Text style={styles.gridValue}>{droneStatus.speed}km/h</Text>
            <Text style={styles.gridLabel}>Speed</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialIcons 
              name={droneStatus.signal === 'Strong' ? 'wifi' : droneStatus.signal === 'Medium' ? 'wifi-2' : 'wifi-1'} 
              size={24} 
              color={droneStatus.signal === 'Strong' ? '#4caf50' : droneStatus.signal === 'Medium' ? '#ff9800' : '#f44336'} 
            />
            <Text style={styles.gridValue}>{droneStatus.signal}</Text>
            <Text style={styles.gridLabel}>Signal</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mission Details</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Position:</Text>
            <Text style={styles.detailValue}>
              {dronePosition.latitude.toFixed(5)}, {dronePosition.longitude.toFixed(5)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Next Waypoint:</Text>
            <Text style={styles.detailValue}>{closestWaypoint.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distance Covered:</Text>
            <Text style={styles.detailValue}>{(flightPath.length * 0.03).toFixed(2)} km</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Area Scanned:</Text>
            <Text style={styles.detailValue}>5.7 acres</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  mapContainer: {
    height: 350,
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  droneMarker: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4a8cff',
  },
  waypointMarker: {
    backgroundColor: '#ff7043',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  activeWaypoint: {
    backgroundColor: '#4caf50',
    transform: [{ scale: 1.2 }],
  },
  waypointText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4a8cff',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  gridValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#333',
  },
  gridLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});

export default TrackingScreen;