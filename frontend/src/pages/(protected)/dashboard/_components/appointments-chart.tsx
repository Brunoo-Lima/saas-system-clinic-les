import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
dayjs.locale('pt-br');

import { DollarSign } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrencyInCents } from '@/utils/format-currency-in-cents';
import { useDashboard } from '@/hooks/use-dashboard';

interface IDailyAppointment {
  date: string;
  appointments: number;
  revenue: number | null;
}

interface IAppointmentsChartProps {
  dailyAppointmentsData: IDailyAppointment[];
}

export default function AppointmentsChart({
  dailyAppointmentsData,
}: IAppointmentsChartProps) {
  const { from, to } = useDashboard();

  // Cria um mapa dos dados existentes para busca rápida
  const dataMap = dailyAppointmentsData.reduce((acc, item) => {
    acc[item.date] = item;
    return acc;
  }, {} as Record<string, IDailyAppointment>);

  // Gera todos os dias do range selecionado
  const generateCompleteDateRange = () => {
    const startDate = dayjs(from);
    const endDate = dayjs(to);
    const daysDiff = endDate.diff(startDate, 'day');

    const completeData = [];

    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = startDate.add(i, 'day');
      const dateString = currentDate.format('YYYY-MM-DD');

      // Verifica se existe dado para esta data
      const existingData = dataMap[dateString];

      completeData.push({
        date: currentDate.format('DD/MM'),
        fullDate: dateString,
        appointments: existingData?.appointments || 0,
        revenue: existingData?.revenue || 0,
      });
    }

    return completeData;
  };

  const chartData = generateCompleteDateRange();

  const chartConfig = {
    appointments: {
      label: 'Agendamentos',
      color: '#0B68F7',
    },
    revenue: {
      label: 'Faturamento',
      color: '#10B981',
    },
  } satisfies ChartConfig;

  const hasNonZeroData = chartData.some(
    (item) => item.appointments > 0 || item.revenue > 0,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <DollarSign />
        <CardTitle>Agendamentos e Faturamento</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasNonZeroData ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Nenhum dado disponível para o período selecionado
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrencyInCents(v)}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label, payload) => {
                      const fullDate = payload?.[0]?.payload?.fullDate;
                      return fullDate
                        ? dayjs(fullDate).format('DD/MM/YYYY (dddd)')
                        : label;
                    }}
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [
                          formatCurrencyInCents(Number(value)),
                          ' Faturamento',
                        ];
                      }
                      return [value, ' Agendamentos'];
                    }}
                  />
                }
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="appointments"
                stroke="var(--color-appointments)"
                fill="var(--color-appointments)"
                fillOpacity={0.2}
                strokeWidth={2}
                name="appointments"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="var(--color-revenue)"
                fillOpacity={0.2}
                strokeWidth={2}
                name="revenue"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
