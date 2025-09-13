export const doctorsList = [
  {
    id: 1,
    name: 'Dr. João Silva',
    crm: '123456',
    servicePriceInCents: 50000,
    specialties: [
      {
        specialty: 'cardiologia',
        availableWeekDay: [
          {
            day: '1',
            intervals: [
              { from: '08:00', to: '12:00' },
              { from: '14:00', to: '18:00' },
            ],
          },
        ],
      },
      {
        specialty: 'pediatria',
        availableWeekDay: [
          {
            day: '2',
            intervals: [{ from: '09:00', to: '17:00' }],
          },
        ],
      },
    ],
    status: true,
    justification: '',
    email: 'j9iR9@example.com',
    phoneNumber: '11999999999',
    dateOfBirth: new Date('2000-01-01'),
    cpf: '12345678901',
    gender: 'male',
    address: {
      zipCode: '12345-678',
      state: 'SP',
      city: 'Sao Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      number: '123',
    },
  },
  {
    id: 2,
    name: 'Dr. Maria Souza',
    specialty: 'Ortopedia',
    crm: '654321',
    servicePriceInCents: 30000,
    specialties: [
      {
        specialty: 'Ortopedia',
        availableWeekDay: [
          {
            day: '3',
            intervals: [
              { from: '08:00', to: '12:00' },
              { from: '14:00', to: '18:00' },
            ],
          },
        ],
      },
      {
        specialty: 'Ginecologia',
        availableWeekDay: [
          {
            day: '6',
            intervals: [{ from: '09:00', to: '17:00' }],
          },
        ],
      },
    ],
    status: true,
    justification: '',
    email: 'j9iR9@example.com',
    phoneNumber: '11999999999',
    dateOfBirth: new Date('2000-01-01'),
    cpf: '12345678902',
    gender: 'female',
    address: {
      zipCode: '12345-678',
      state: 'SP',
      city: 'Sao Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      number: '123',
    },
  },
  {
    id: 3,
    name: 'Dr. Pedro Santos',
    crm: '987654',
    servicePriceInCents: 40000,
    specialties: [
      {
        specialty: 'Dermatologia',
        availableWeekDay: [
          {
            day: '3',
            intervals: [
              { from: '08:00', to: '12:00' },
              { from: '14:00', to: '18:00' },
            ],
          },
        ],
      },
      {
        specialty: 'Urologia',
        availableWeekDay: [
          {
            day: '4',
            intervals: [{ from: '09:00', to: '17:00' }],
          },
        ],
      },
    ],
    status: true,
    justification: '',
    email: 'j9iR9@example.com',
    phoneNumber: '11999999999',
    dateOfBirth: new Date('2000-01-01'),
    cpf: '12345678903',
    gender: 'male',
    address: {
      zipCode: '12345-678',
      state: 'SP',
      city: 'Sao Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      number: '123',
    },
  },
  {
    id: 4,
    name: 'Dr. Ana Oliveira',
    crm: '321654',
    servicePriceInCents: 60000,
    specialties: [
      {
        specialty: 'Oftalmologia',
        availableWeekDay: [
          {
            day: '5',
            intervals: [
              { from: '08:00', to: '12:00' },
              { from: '14:00', to: '18:00' },
            ],
          },
        ],
      },
    ],
    status: true,
    justification: '',
    email: 'j9iR9@example.com',
    phoneNumber: '11999999999',
    dateOfBirth: new Date('2000-01-01'),
    cpf: '12345678904',
    gender: 'female',
    address: {
      zipCode: '12345-678',
      state: 'SP',
      city: 'Sao Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      number: '123',
    },
  },
];
