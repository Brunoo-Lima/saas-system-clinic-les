import type { AppointmentAgenda } from '@/pages/(protected)/agenda/_components/agenda';

export const agendaList: AppointmentAgenda[] = [
  {
    id: '1',
    time: '09:00',
    patient: {
      name: 'Maria Silva',
      phone: '(11) 98765-4321',
      email: 'maria.silva@email.com',
    },
    duration: 30,
    status: 'confirmed',
  },
  {
    id: '2',
    time: '09:30',
    patient: {
      name: 'João Santos',
      phone: '(11) 91234-5678',
      email: 'joao.santos@email.com',
    },

    duration: 30,
    status: 'scheduled',
  },
  {
    id: '3',
    time: '10:30',
    patient: {
      name: 'Ana Costa',
      phone: '(11) 99876-5432',
      email: 'ana.costa@email.com',
    },
    duration: 60,
    status: 'confirmed',
  },
  {
    id: '4',
    time: '14:00',
    patient: {
      name: 'Pedro Oliveira',
      phone: '(11) 97654-3210',
      email: 'pedro.oliveira@email.com',
    },
    duration: 30,
    status: 'scheduled',
  },
  {
    id: '5',
    time: '15:00',
    patient: {
      name: 'Carla Mendes',
      phone: '(11) 96543-2109',
      email: 'carla.mendes@email.com',
    },
    duration: 45,
    status: 'completed',
  },
];
