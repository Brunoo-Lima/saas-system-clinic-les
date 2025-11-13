import {
  CalendarIcon,
  DollarSignIcon,
  HandCoinsIcon,
  TrendingUpIcon,
  UserIcon,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format-currency-in-cents';

interface IFinancial {
  totalclinic: number;
  total: number;
  totaldoctor: number;
  totalinsurance: number;
}

interface StatsCardsProps {
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  financial?: IFinancial[];
}

export const StatsCards = ({
  totalAppointments,
  totalPatients,
  totalDoctors,
  financial,
}: StatsCardsProps) => {
  const total = financial
    ?.filter((item) => item.total)
    .reduce((acc, item) => acc + item.total, 0);

  const totalInsurance = financial
    ?.filter((item) => item.totalinsurance)
    .reduce((acc, item) => acc + item.totalinsurance, 0);

  const totalDoctor = financial
    ?.filter((item) => item.totaldoctor)
    .reduce((acc, item) => acc + item.totaldoctor, 0);

  const totalClinic = financial
    ?.filter((item) => item.totalclinic)
    .reduce((acc, item) => acc + item.totalclinic, 0);

  const financialStats = [
    {
      title: 'Faturamento Clínica',
      value: formatCurrency(total || 0),
      description: 'Total recebido pela clínica',
      icon: DollarSignIcon,
    },
    {
      title: 'Repasse Médicos',
      value: formatCurrency(totalDoctor || 0),
      description: 'Total repassado aos médicos',
      icon: HandCoinsIcon,
    },
    {
      title: 'Repasse Convênios',
      value: formatCurrency(totalInsurance || 0),
      description: 'Total repassado aos convênios',
      icon: HandCoinsIcon,
    },
  ];

  const generalStats = [
    {
      title: 'Agendamentos',
      value: totalAppointments.toString(),
      description: 'Total de consultas agendadas',
      icon: CalendarIcon,
    },
    {
      title: 'Pacientes',
      value: totalPatients.toString(),
      description: 'Pacientes cadastrados',
      icon: UserIcon,
    },
    {
      title: 'Médicos',
      value: totalDoctors.toString(),
      description: 'Médicos ativos',
      icon: UserIcon,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 cards__container">
      {/* Card de Estatísticas Financeiras */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Financeiro</CardTitle>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold">
              {formatCurrency(totalClinic || 0)}
            </p>
            <TrendingUpIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="flex sm:items-center items-start gap-y-2 sm:gap-y-0 justify-between flex-col sm:flex-row"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Icon className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Card de Estatísticas Gerais */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Geral</CardTitle>
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          {generalStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Icon className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
