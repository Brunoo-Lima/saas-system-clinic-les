import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { CalendarIcon } from 'lucide-react';

export const AppointmentToday = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CalendarIcon className="text-muted-foreground" />
          <CardTitle className="text-base">Agendamentos de hoje</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* <DataTable columns={appointmentsTableColumns} data={[]} /> */}
      </CardContent>
    </Card>
  );
};
