export const doctorsList = [
  {
    id: 1,
    name: "Dr. João Silva",
    specialty: "Cardiologia",
    crm: "123456",
    servicePriceInCents: 50000,
    availableWeekDay: [
      {
        day: "2",
        intervals: [
          {
            from: "07:00",
            to: "17:00",
          },
        ],
      },
      {
        day: "4",
        intervals: [
          {
            from: "05:00",
            to: "09:00",
          },
          {
            from: "15:00",
            to: "19:00",
          },
        ],
      },
    ],
    status: true,
    justification: "",
    email: "j9iR9@example.com",
    phoneNumber: "11999999999",
    dateOfBirth: new Date("2000-01-01"),
    cpf: "12345678901",
    gender: "male",
    address: {
      zipCode: "12345-678",
      state: "SP",
      city: "Sao Paulo",
      neighborhood: "Bairro",
      street: "Rua",
      number: "123",
    },
  },
  {
    id: 2,
    name: "Dr. Maria Souza",
    specialty: "Ortopedia",
    crm: "654321",
    servicePriceInCents: 30000,
    availableWeekDay: [
      {
        day: "1",
        intervals: [
          {
            from: "08:00",
            to: "17:00",
          },
        ],
      },
    ],
    status: true,
    justification: "",
    email: "j9iR9@example.com",
    phoneNumber: "11999999999",
    dateOfBirth: new Date("2000-01-01"),
    cpf: "12345678902",
    gender: "female",
    address: {
      zipCode: "12345-678",
      state: "SP",
      city: "Sao Paulo",
      neighborhood: "Bairro",
      street: "Rua",
      number: "123",
    },
  },
  {
    id: 3,
    name: "Dr. Pedro Santos",
    specialty: "Dermatologia",
    crm: "987654",
    servicePriceInCents: 40000,
    availableWeekDay: [
      {
        day: "1",
        intervals: [
          {
            from: "08:00",
            to: "17:00",
          },
        ],
      },
    ],
    status: true,
    justification: "",
    email: "j9iR9@example.com",
    phoneNumber: "11999999999",
    dateOfBirth: new Date("2000-01-01"),
    cpf: "12345678903",
    gender: "male",
    address: {
      zipCode: "12345-678",
      state: "SP",
      city: "Sao Paulo",
      neighborhood: "Bairro",
      street: "Rua",
      number: "123",
    },
  },
  {
    id: 4,
    name: "Dr. Ana Oliveira",
    specialty: "Oftalmologia",
    crm: "321654",
    servicePriceInCents: 60000,
    availableWeekDay: [
      {
        day: "1",
        intervals: [
          {
            from: "08:00",
            to: "17:00",
          },
        ],
      },
    ],
    status: true,
    justification: "",
    email: "j9iR9@example.com",
    phoneNumber: "11999999999",
    dateOfBirth: new Date("2000-01-01"),
    cpf: "12345678904",
    gender: "female",
    address: {
      zipCode: "12345-678",
      state: "SP",
      city: "Sao Paulo",
      neighborhood: "Bairro",
      street: "Rua",
      number: "123",
    },
  },
];
