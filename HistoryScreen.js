import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const HistoryScreen = () => {
  const screenWidth = Dimensions.get('window').width;

  const historicalData = [
    { month: 'May', total: 1380, good: 1210, bad: 170, quality: '87.7%', change: '↑ 1.3%' },
    { month: 'June', total: 1420, good: 1250, bad: 170, quality: '88.0%', change: '↑ 0.3%' },
    { month: 'July', total: 1510, good: 1330, bad: 180, quality: '88.1%', change: '↑ 0.1%' },
    { month: 'August', total: 1620, good: 1430, bad: 190, quality: '88.3%', change: '↑ 0.2%' },
    { month: 'September', total: 1730, good: 1520, bad: 210, quality: '87.9%', change: '↓ 0.4%' },
    { month: 'October', total: 1680, good: 1470, bad: 210, quality: '87.5%', change: '↓ 0.4%' },
    { month: 'November', total: 1750, good: 1530, bad: 220, quality: '87.4%', change: '↓ 0.1%' },
    { month: 'December', total: 1820, good: 1590, bad: 230, quality: '87.4%', change: '0.0%' }
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#ffa726'
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Historical Orange Data</Text>

      {/* Table Header */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.tableCell]}>Month</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Total</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Good</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Bad</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Quality</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Change</Text>
        </View>

        {/* Table Body */}
        {historicalData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.month}</Text>
            <Text style={styles.tableCell}>{item.total.toLocaleString()}</Text>
            <Text style={styles.tableCell}>{item.good.toLocaleString()}</Text>
            <Text style={styles.tableCell}>{item.bad.toLocaleString()}</Text>
            <Text style={styles.tableCell}>{item.quality}</Text>
            <Text
              style={[
                styles.tableCell,
                item.change.includes('↑') ? styles.positive : item.change.includes('↓') ? styles.negative : styles.neutral
              ]}
            >
              {item.change}
            </Text>
          </View>
        ))}
      </View>

      {/* Chart */}
      <Text style={styles.chartTitle}>📈 Annual Production & Quality (%)</Text>
      <LineChart
        data={{
          labels: historicalData.map(item => item.month),
          datasets: [
            {
              data: historicalData.map(item => item.total),
              color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: historicalData.map(item => parseFloat(item.quality)),
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              strokeWidth: 2,
            }
          ],
          legend: ['Total Oranges', 'Quality %']
        }}
        width={screenWidth - 40}
        height={300}
        chartConfig={chartConfig}
        bezier
        style={styles.chartStyle}
      />
    </ScrollView>
  );
};

export default HistoryScreen;
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
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fdfdfd',
    elevation: 3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tableHeader: {
    backgroundColor: '#ffa726',
    color: '#fff',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    fontSize: 13,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  positive: {
    color: 'green',
    fontWeight: '600',
  },
  negative: {
    color: 'red',
    fontWeight: '600',
  },
  neutral: {
    color: '#555',
  },
});
