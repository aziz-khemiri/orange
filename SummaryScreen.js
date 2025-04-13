import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

// Données
const pieData = [
  {
    name: 'Bonnes oranges',
    population: 1576,
    color: '#8BC34A',
    legendFontColor: '#333',
    legendFontSize: 12,
    percentage: '85%',
    description: 'Oranges de qualité optimale',
  },
  {
    name: 'Mauvaises oranges',
    population: 266,
    color: '#F44336',
    legendFontColor: '#333',
    legendFontSize: 12,
    percentage: '15%',
    description: 'Oranges à rejeter',
  },
];

// Calcul total oranges
const getTotal = (data) => data.reduce((sum, item) => sum + item.population, 0);

// Composant Carte
const InfoCard = ({ emoji, label, value, change, style = {} }) => (
  <View style={[styles.cardBox, style]} accessible accessibilityLabel={`${label}: ${value}, ${change}`}>
    <Text style={styles.cardEmoji}>{emoji}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardChange}>{change}</Text>
  </View>
);

// Composant Statistique
const StatBox = ({ value, label, style }) => (
  <View style={[styles.statBox, style]} accessible accessibilityLabel={`${label}: ${value}`}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Légende interactive
const Legend = ({ data, onSelect, selectedItem }) => (
  <View style={styles.legendContainer}>
    {data.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.legendItem,
          selectedItem?.name === item.name && styles.selectedLegendItem
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
        <Text style={styles.legendText}>{item.name}</Text>
        {selectedItem?.name === item.name && (
          <Text style={styles.legendPercentage}>{item.percentage}</Text>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

// Section graphique améliorée
const PieChartSection = ({ data, selectedPart, onSelect }) => {
  const chartSize = Math.max(Dimensions.get('window').width * 0.8, 280);
  const total = getTotal(data);

  return (
    <View style={styles.chartContainer}>
      <TouchableOpacity 
        onPress={() => onSelect(null)}
        activeOpacity={1}
        style={styles.chartTouchable}
      >
        <PieChart
          data={data}
          width={chartSize}
          height={chartSize}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={false}
          center={[
            (selectedPart?.population / total) * 50 + 25 || 50,
            (selectedPart?.population / total) * 50 + 25 || 50
          ]}
          avoidFalseZero
        />
        {selectedPart && (
          <View style={styles.chartCenterText}>
            <Text style={styles.chartCenterValue}>{selectedPart.population}</Text>
            <Text style={styles.chartCenterLabel}>{selectedPart.name}</Text>
            <Text style={styles.chartCenterPercentage}>{selectedPart.percentage}</Text>
          </View>
        )}
        {!selectedPart && (
          <View style={styles.chartCenterText}>
            <Text style={styles.chartCenterValue}>{total}</Text>
            <Text style={styles.chartCenterLabel}>Total Oranges</Text>
          </View>
        )}
      </TouchableOpacity>

      <Legend 
        data={data} 
        onSelect={onSelect} 
        selectedItem={selectedPart} 
      />
    </View>
  );
};

// Écran principal amélioré
const SummaryScreen = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const totalOranges = getTotal(pieData);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>🍊 OrangeSense Summary</Text>

      <View style={styles.cardsRow}>
        <InfoCard
          emoji="🍊"
          label="Total Oranges"
          value={totalOranges}
          change="+12% from last week"
          style={styles.blueCard}
        />
        <InfoCard
          emoji="👍"
          label="Good Oranges"
          value={pieData[0].population}
          change="+9% from last week"
          style={styles.greenCard}
        />
      </View>
      <View style={styles.cardsRow}>
        <InfoCard
          emoji="👎"
          label="Bad Oranges"
          value={pieData[1].population}
          change="+3% from last week"
          style={styles.redCard}
        />
        <InfoCard
          emoji="📊"
          label="Quality Score"
          value="92/100"
          change="+2 points"
          style={styles.purpleCard}
        />
      </View>

      <PieChartSection 
        data={pieData} 
        selectedPart={selectedPart}
        onSelect={setSelectedPart} 
      />

      {selectedPart && (
        <View style={[
          styles.selectedInfoBox,
          { 
            backgroundColor: selectedPart.color + '20',
            borderColor: selectedPart.color
          }
        ]}>
          <Text style={[styles.selectedInfoText, { color: selectedPart.color }]}>
            {selectedPart.population} oranges ({selectedPart.percentage})
          </Text>
          <Text style={styles.selectedInfoDescription}>
            {selectedPart.description}
          </Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <StatBox 
          value="95%" 
          label="Maturité optimale" 
          style={styles.goodStat} 
        />
        <StatBox 
          value="4.5%" 
          label="Sous-maturation" 
          style={styles.warningStat} 
        />
        <StatBox 
          value="0.5%" 
          label="Pourriture" 
          style={styles.badStat} 
        />
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Quality Tips</Text>
        <Text style={styles.tipsText}>
          {selectedPart?.name === 'Mauvaises oranges' 
            ? 'Inspectez les zones d\'humidité dans votre stockage pour réduire les oranges défectueuses.'
            : 'Maintenez la température de stockage entre 3-8°C pour préserver la qualité.'}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6E0',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8C00',
    marginBottom: 25,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  cardBox: {
    width: '48%',
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    padding: 15,
    marginBottom: 0,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  blueCard: {
    backgroundColor: '#E3F2FD',
  },
  greenCard: {
    backgroundColor: '#E8F5E9',
  },
  redCard: {
    backgroundColor: '#FFEBEE',
  },
  purpleCard: {
    backgroundColor: '#F3E5F5',
  },
  cardEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e88e5',
    marginTop: 4,
  },
  cardChange: {
    fontSize: 12,
    color: '#4caf50',
    marginTop: 4,
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  chartTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterText: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartCenterValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  chartCenterLabel: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
  chartCenterPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 6,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
  },
  selectedLegendItem: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  statBox: {
    width: '30%',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  goodStat: {
    backgroundColor: '#E8F5E9',
  },
  warningStat: {
    backgroundColor: '#FFF3E0',
  },
  badStat: {
    backgroundColor: '#FFEBEE',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedInfoBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  selectedInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  selectedInfoDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  tipsContainer: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8F00',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 20,
  },
});