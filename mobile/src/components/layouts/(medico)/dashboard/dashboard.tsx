import { ScrollView, Text, View, Dimensions } from 'react-native';
import styles from './styles';
import Header from '@/components/header/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useState, useMemo } from 'react';
import { SelectMonth } from '@/components/ui/select-month/select-month';
import { useAuth } from '@/contexts/(doctor)/user-context';
import { useGetFinancialDoctor } from '@/services/doctor/financial-doctor-service';
import dayjs from 'dayjs';

export default function Dashboard() {
  const screenWidth = Dimensions.get('window').width;
  const { doctor } = useAuth();
  const { data } = useGetFinancialDoctor(doctor?.id || '');
  const [selectedMonth, setSelectedMonth] = useState('Nov');

  const monthMap: Record<string, number> = {
    Jan: 1,
    Fev: 2,
    Mar: 3,
    Abr: 4,
    Mai: 5,
    Jun: 6,
    Jul: 7,
    Ago: 8,
    Set: 9,
    Out: 10,
    Nov: 11,
    Dez: 12,
  };

  const daysInMonth: Record<string, number> = {
    Jan: 31,
    Fev: 29,
    Mar: 31,
    Abr: 30,
    Mai: 31,
    Jun: 30,
    Jul: 31,
    Ago: 31,
    Set: 30,
    Out: 31,
    Nov: 30,
    Dez: 31,
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item: any) => {
      const month = dayjs(item.date).month() + 1;
      return month === monthMap[selectedMonth];
    });
  }, [data, selectedMonth]);

  const chartData = useMemo(() => {
    const totalDays = daysInMonth[selectedMonth];
    const dayValues: number[] = [];

    for (let day = 1; day <= totalDays; day++) {
      const found = filteredData.find(
        (item: any) => dayjs(item.date).date() === day,
      );
      dayValues.push(found ? found.totalDistributionDoctor : 0);
    }

    // Apenas alguns rótulos no eixo X (por exemplo, de 5 em 5 dias)
    const labels = Array.from({ length: totalDays }, (_, i) =>
      (i + 1) % 5 === 0 || i === 0 ? (i + 1).toString() : '',
    );

    return { labels, dayValues };
  }, [filteredData, selectedMonth]);

  const monthLabels = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  const monthlyTotals = monthLabels.map((_, index) => {
    const monthData = data?.filter(
      (item: any) => dayjs(item.date).month() === index,
    );
    const total = monthData?.reduce(
      (sum: number, item: any) => sum + (item.totalDistributionDoctor || 0),
      0,
    );
    return total || 0;
  });

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

          {/* Gráfico de ganhos diários */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={{
                labels: chartData.labels,
                datasets: [{ data: chartData.dayValues }],
              }}
              width={Math.max(screenWidth, chartData.dayValues.length * 15)}
              height={250}
              yAxisLabel="R$ "
              fromZero
              verticalLabelRotation={45}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(91, 92, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#5b5cff',
                },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </ScrollView>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Ganhos Totais no Ano</Text>

          <LineChart
            data={{
              labels: monthLabels,
              datasets: [{ data: monthlyTotals }],
            }}
            width={screenWidth - 32}
            height={250}
            yAxisLabel="R$ "
            fromZero
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(91, 92, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#5B5CFF',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
