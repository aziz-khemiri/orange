import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Réutilisable : Configuration globale des graphiques
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

// Composant carte graphique
const ChartCard = ({ title, data, color, decimalPlaces = 1 }) => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>{title}</Text>
    <LineChart
      data={{
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            data,
            color: (opacity = 1) => `rgba(${color}, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }}
      width={screenWidth - 40}
      height={220}
      chartConfig={{ ...chartConfig, decimalPlaces }}
      fromZero={false}
      bezier
      style={styles.chartStyle}
    />
  </View>
);

const TrendsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📈 Trend Analysis</Text>

      <ChartCard
        title="Total Oranges Trend"
        data={[420, 580, 720, 842]}
        color="255, 152, 0"
        decimalPlaces={0}
      />

      <ChartCard
        title="Quality Ratio Trend (%)"
        data={[84.2, 85.7, 86.3, 85.5]}
        color="76, 175, 80"
        decimalPlaces={1}
      />
    </ScrollView>
  );
};

export default TrendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#FF8C00',
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 30,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
    textAlign: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
