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
import { formatCurrency } from '@/utils/format-currency-in-cents';
import { useDashboard } from '@/hooks/use-dashboard';

interface IFinancial {
  id: string;
  date: string;
  total: number;
  totalclinic: number;
  totaldoctor: number;
  totalinsurance: number;
}

interface IAppointmentsChartProps {
  financialData?: IFinancial[];
}

export default function AppointmentsChart({
  financialData = [],
}: IAppointmentsChartProps) {
  const { from, to } = useDashboard();

  // Transforma financialData no formato para o chart
  const transformFinancialData = () => {
    const groupedByDate = financialData.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          total: 0,
          totalclinic: 0,
          totaldoctor: 0,
          totalinsurance: 0,
        };
      }

      acc[item.date].total += item.total;
      acc[item.date].totalclinic += item.totalclinic;
      acc[item.date].totaldoctor += item.totaldoctor;
      acc[item.date].totalinsurance += item.totalinsurance;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedByDate).map((item: any) => ({
      date: item.date,
      total: item.total,
      totalclinic: item.totalclinic,
      totaldoctor: item.totaldoctor,
      totalinsurance: item.totalinsurance,
    }));
  };

  const transformedData = transformFinancialData();

  const dataMap = transformedData.reduce((acc, item) => {
    acc[item.date] = item;
    return acc;
  }, {} as Record<string, any>);

  // Gera todos os dias do range selecionado
  const generateCompleteDateRange = () => {
    const startDate = dayjs(from);
    const endDate = dayjs(to);
    const daysDiff = endDate.diff(startDate, 'day');

    const completeData = [];

    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = startDate.add(i, 'day');
      const dateString = currentDate.format('YYYY-MM-DD');

      const existingData = dataMap[dateString];

      completeData.push({
        date: currentDate.format('DD/MM'),
        fullDate: dateString,
        total: existingData?.total || 0,
        totalclinic: existingData?.totalclinic || 0,
        totaldoctor: existingData?.totaldoctor || 0,
        totalinsurance: existingData?.totalinsurance || 0,
      });
    }

    return completeData;
  };

  const chartData = generateCompleteDateRange();

  const chartConfig = {
    totalclinic: {
      label: 'Faturamento Clínica',
      color: '#10B981',
    },
    total: {
      label: 'Faturamento Total',
      color: '#0B68F7',
    },
    totaldoctor: {
      label: 'Repasse Médicos',
      color: '#F59E0B',
    },
    totalinsurance: {
      label: 'Repasse Convênios',
      color: '#EF4444',
    },
  } satisfies ChartConfig;

  const hasNonZeroData = chartData.some(
    (item) =>
      item.total > 0 ||
      item.totalclinic > 0 ||
      item.totaldoctor > 0 ||
      item.totalinsurance > 0,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <DollarSign />
        <CardTitle>Dashboard Financeiro</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasNonZeroData ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Nenhum dado financeiro disponível para o período selecionado
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
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v)}
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
                      const formattedValue = formatCurrency(Number(value));
                      const label =
                        chartConfig[name as keyof typeof chartConfig]?.label ||
                        name;
                      return [formattedValue, ' ', label];
                    }}
                  />
                }
              />
              {/* Faturamento Clínica */}
              <Area
                type="monotone"
                dataKey="totalclinic"
                stroke="var(--color-totalclinic)"
                fill="var(--color-totalclinic)"
                fillOpacity={0.2}
                strokeWidth={2}
                name="totalclinic"
              />
              {/* Faturamento Total */}
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-total)"
                fill="var(--color-total)"
                fillOpacity={0.2}
                strokeWidth={2}
                name="total"
              />
              {/* Repasse Médicos */}
              <Area
                type="monotone"
                dataKey="totaldoctor"
                stroke="var(--color-totaldoctor)"
                fill="var(--color-totaldoctor)"
                fillOpacity={0.2}
                strokeWidth={2}
                name="totaldoctor"
              />
              {/* Repasse Convênios */}
              <Area
                type="monotone"
                dataKey="totalinsurance"
                stroke="var(--color-totalinsurance)"
                fill="var(--color-totalinsurance)"
                fillOpacity={0.2}
                strokeWidth={2}
                name="totalinsurance"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
