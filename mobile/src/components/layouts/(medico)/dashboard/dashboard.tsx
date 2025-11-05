import { ScrollView, Text, View, Dimensions } from 'react-native';
import styles from './styles';
import Header from '@/components/header/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useState } from 'react';
import { SelectMonth } from '@/components/ui/select-month/select-month';
import { useAuth } from '@/contexts/(doctor)/user-context';

export default function Dashboard() {
  const screenWidth = Dimensions.get('window').width;
  const { doctor } = useAuth();
  // const { data } = useGetFinancialDoctor(user?.id || '');

  const [selectedMonth, setSelectedMonth] = useState('Jan');

  // ganhos fictícios por mês (valores em R$ mil)
  const monthlyTotals: Record<string, number> = {
    Jan: 45,
    Fev: 52,
    Mar: 60,
    Abr: 38,
    Mai: 72,
    Jun: 50,
    Jul: 80,
    Ago: 65,
    Set: 40,
    Out: 70,
    Nov: 55,
    Dez: 90,
  };

  // ganhos por semana/dia dentro de cada mês (exemplo)
  const dataByMonth: Record<string, number[]> = {
    Jan: [20, 15, 10, 45],
    Fev: [25, 10, 8, 9],
    Mar: [15, 20, 15, 10],
    Abr: [10, 8, 12, 8],
    Mai: [18, 20, 17, 17],
    Jun: [12, 13, 15, 10],
    Jul: [20, 25, 15, 20],
    Ago: [15, 16, 18, 16],
    Set: [10, 12, 9, 9],
    Out: [18, 20, 17, 15],
    Nov: [13, 14, 15, 13],
    Dez: [22, 23, 20, 25],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ganhos do Médico" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.containerFilter}>
            <Text>Selecione o mês</Text>

            <SelectMonth
              selectedMonth={selectedMonth}
              onChangeMonth={setSelectedMonth}
            />
          </View>

          <LineChart
            data={{
              labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
              datasets: [
                {
                  data: dataByMonth[selectedMonth],
                },
              ],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel="R$ "
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#2b6cb0',
              },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />

          <Text
            style={{
              fontSize: 18,
              marginTop: 32,
              marginBottom: 16,
              fontWeight: 'bold',
            }}
          >
            Visão Anual
          </Text>

          {/* Gráfico anual (barra com total de cada mês) */}
          <BarChart
            data={{
              labels: Object.keys(monthlyTotals),
              datasets: [{ data: Object.values(monthlyTotals) }],
            }}
            width={screenWidth - 32}
            height={250}
            yAxisLabel="R$ "
            yAxisSuffix=""
            withInnerLines={false}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              barPercentage: 0.5,
              color: (opacity = 0.2) => `rgba(43, 108, 176, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
