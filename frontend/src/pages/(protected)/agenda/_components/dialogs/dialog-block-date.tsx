import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import type { IAvailabilitySettings } from '@/@types/IAgenda';
import { parseBackendDate } from '../../utilities/utilities';

interface DialogBlockDateProps {
  availabilitySettings: IAvailabilitySettings;
  dateToBlock: Date | undefined;
  setDateToBlock: (date: Date | undefined) => void;
  blockDate: () => void;
  unBlockDate: (date: Date) => void;
  blockReason: string;
  setBlockReason: (reason: string) => void;
  isDateBlocked: (date: Date) => boolean;
}

export const DialogBlockDate = ({
  availabilitySettings,
  dateToBlock,
  setDateToBlock,
  blockDate,
  unBlockDate,
  blockReason,
  setBlockReason,
  isDateBlocked,
}: DialogBlockDateProps) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Bloquear Datas</DialogTitle>
        <DialogDescription>
          Selecione datas para bloquear o atendimento
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="block-reason">Motivo do bloqueio</Label>
          <Input
            id="block-reason"
            placeholder="Ex: Feriado, Férias, etc."
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Selecione a data</Label>
          <Calendar
            mode="single"
            selected={dateToBlock}
            onSelect={setDateToBlock}
            className="rounded-md border"
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            modifiers={{
              blocked: availabilitySettings.blockedDates.map((blocked) =>
                parseBackendDate(blocked.date),
              ),
            }}
            modifiersStyles={{
              blocked: {
                textDecoration: 'line-through',
                color: 'hsl(var(--destructive))',
                opacity: 0.5,
              },
            }}
          />
        </div>

        {dateToBlock && (
          <div className="flex gap-2">
            <Button
              onClick={blockDate}
              disabled={!blockReason.trim() || isDateBlocked(dateToBlock)}
              className="flex-1"
            >
              {isDateBlocked(dateToBlock)
                ? 'Data Já Bloqueada'
                : 'Bloquear Data'}
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <Label>Datas bloqueadas</Label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {availabilitySettings.blockedDates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                Nenhuma data bloqueada
              </p>
            ) : (
              availabilitySettings.blockedDates.map((blocked) => {
                const blockedDate = parseBackendDate(blocked.date);
                return (
                  <Badge
                    key={blocked.date}
                    variant="destructive"
                    className="flex items-center gap-1 py-1 px-2 w-full justify-between"
                  >
                    <div className="flex-1 text-left">
                      <span>{blockedDate.toLocaleDateString('pt-BR')}</span>
                      {blocked.reason && (
                        <span className="text-xs ml-1 opacity-80">
                          ({blocked.reason})
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive-foreground/20"
                      onClick={() => unBlockDate(blockedDate)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
