import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  pgTable,
  primaryKey,
  real,
  smallint,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  avatar: text("avatar"),
  status: boolean("status").default(true),
  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});


// Address Schemas
export const countryTable = pgTable("country", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull()
})

export const stateTable = pgTable("state", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull(),
  country_id: uuid("country_id").references(() => countryTable.id)
})

export const cityTable = pgTable("city", {
  id: uuid("id").primaryKey(),
  cep: varchar("cep").notNull(),
  name: varchar("name").notNull(),
  state_id: uuid("state_id").references(() => stateTable.id)
})

export const neighborhoodTable = pgTable("neighborhood", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull(),
  city_id: uuid("city_id").references(() => cityTable.id)
})

export const addressTable = pgTable("address", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull(),
  number: varchar("number").notNull(),
  street: varchar("street").notNull(),
  neighborhood_id: uuid("neighborhood_id").references(() => neighborhoodTable.id)
})

// Tabela de planos de saúde
export const insuranceTable = pgTable("insurance", {
  id: uuid("id").primaryKey(),
  type: varchar("type").notNull(),
});

// Tabela de especialidades
export const specialtyTable = pgTable("specialty", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull(),
  price: real("price").default(0),
});


// Pacientes
export const patientTable = pgTable("patient", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull(),
  dateOfBirth: date("dateOfBirth").notNull(),
  contact1: varchar("contact1").notNull(),
  cpf: varchar("cpf").notNull().unique(),
  user_id: uuid("user_id").references(() => userTable.id),
  address_id: uuid("address_id").references(() => addressTable.id)
})

// Doctors
export const doctorTable = pgTable("doctor", {
  id: uuid("id").primaryKey(),
  crm: varchar("crm").notNull().unique(),
  contact1: varchar("contact1").notNull(),
  user_id: uuid("user_id").references(() => userTable.id),
  clinic_id: uuid("clinic_id").references(() => clinicTable.id),
  address_id: uuid("address_id").references(() => addressTable.id)
})

// Period
export const periodDoctorTable = pgTable("period", {
  id: uuid("id").primaryKey(),
  periodType: varchar("periodType", {length: 20}).notNull(),
  dayWeek: smallint("dayWeek").notNull(),
  timeFrom: time("timeFrom").notNull(),
  timeTo: time("timeTo").notNull(),
  doctor_id: uuid("doctor_id").references(() => doctorTable.id)

}) 

//Agendamentos
export const schedulingTable = pgTable("scheduling", {
  id: uuid("id").primaryKey(),
  date: date().notNull(),
  doctor_id: uuid("doctor_id").references(() => doctorTable.id),
  patient_id: uuid("patient_id").references(() => patientTable.id),
  insurance_id: uuid("insurance_id").references(() => insuranceTable.id),
  specialty_id: uuid("specialty_id").references(() => specialtyTable.id),
  status: varchar("status").notNull(),
  type: varchar("typeScheduling").notNull()
})

//Movimentacoes 
export const movementsTable = pgTable("appointment", {
  id: uuid("id").primaryKey(),
  total: real("total").default(0),
  dateAppointment: date("dateAppointment").notNull(),
  percentInsurance: real("percentInsurance").notNull(),
  percentDoctor: real("percentDoctor").notNull(),
  patient_id: uuid("patient_id").references(() => patientTable.id),
  doctor_id: uuid("doctor_id").references(() => doctorTable.id),
  clinic_id: uuid("clinic_id").references(() => clinicTable.id)
})

// Clinica
export const clinicTable = pgTable("clinic", {
  id: uuid("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  timeToConfirmScheduling: time().notNull(),
  contact1: varchar("contact1").notNull(),
  address_id: uuid("address_id").references(() => addressTable.id)
})


//Tabelas de relacionamento

// Tabela de relacionamento intermediaria: Paciente e Plano de saude
export const patientToInsuranceTable = pgTable(
  "patient_to_insurance",
  {
    patient_id: uuid("patient_id").references(() => patientTable.id),
    insurance_id: uuid("insurance_id").references(() => insuranceTable.id)
  },
  (t) => [
    {
        pk: primaryKey({ // Chave primaria composta
        columns: [t.patient_id, t.insurance_id]
      })
    }
  ]
)

// Tabela de relacionamento intermediaria: Doutor e Especialidades
export const doctorToSpecialtyTable = pgTable(
  "doctor_to_specialty", 
  {
    doctor_id: uuid("doctor_id").references(() => doctorTable.id),
    specialty_id: uuid("specialty_id").references(() => specialtyTable.id)
  }, 
  (t) => [
  {
    pk:  primaryKey({
      columns: [t.doctor_id, t.specialty_id]
    })
  }
])


// Tabela de relacionamento intermediaria: Clinica e Plano de saude
export const clinicToInsuranceTable = pgTable(
  "clinic_to_insurance",
  {
    clinic_id: uuid("clinic_id").references(() => clinicTable.id),
    insurance_id: uuid("insurance_id").references(() => insuranceTable.id)
  }, 
  (t) => [
   {
    pk:  primaryKey({
      columns: [t.clinic_id, t.insurance_id]
    })
   }
  ]
)

// Tabela de relacionamento intermediaria: Plano de saude e Especialidade
export const insuranceToSpecialtyTable = pgTable(
  "insurance_to_specialty",
  {
    insurance_id: uuid("insurance_id").references(() => insuranceTable.id),
    specialty_id: uuid("specialty_id").references(() => specialtyTable.id),
  },
  (t) => [
    {
      pk: primaryKey({
      columns: [t.insurance_id, t.specialty_id],
    }),
    }
  ]
);

// Relacionamentos de tabelas intermediarias (Many to Many)

// Relacionamento intermediario entre: Paciente e Plano de saude
export const patientToInsuranceRelations = relations(
  patientToInsuranceTable, 
  ({one}) => ({
    patient: one(patientTable, {
      fields: [patientToInsuranceTable.patient_id],
      references: [patientTable.id]
    }),
    insurance: one(insuranceTable, {
      fields: [patientToInsuranceTable.insurance_id],
      references: [insuranceTable.id]
    })
  })
)

// Relacionamento intermediario entre: Doutor e Especialidade
export const doctorToSpecialtyRelation = relations(doctorToSpecialtyTable, ({one}) => ({
  doctor: one(doctorTable, {
    fields: [doctorToSpecialtyTable.doctor_id],
    references: [doctorTable.id]
  }),
  specialty: one(specialtyTable, {
    fields: [doctorToSpecialtyTable.specialty_id],
    references: [specialtyTable.id]
  })
}))


// Relacionamento intermediario entre: Clinica e Plano de saude
export const clinicToInsuranceRelation = relations(clinicToInsuranceTable, ({one}) => ({
  clinic: one(clinicTable, {
    fields: [clinicToInsuranceTable.clinic_id], 
    references: [clinicTable.id]
  }),
  insurance: one(insuranceTable, {
    fields: [clinicToInsuranceTable.insurance_id],
    references: [insuranceTable.id]
  })
}))


// Relacionamento intermediario entre: Planos de saude e especialidades
export const insuranceToSpecialtyRelations = relations(
  insuranceToSpecialtyTable,
  ({ one }) => ({
    insurance: one(insuranceTable, {
      fields: [insuranceToSpecialtyTable.insurance_id],
      references: [insuranceTable.id],
    }),
    specialty: one(specialtyTable, {
      fields: [insuranceToSpecialtyTable.specialty_id],
      references: [specialtyTable.id],
    }),
  })
);

// Relacionamentos de tabelas (One to One or One to Many)

/* 
  Paciente e Pagamentos
  Doutor e Pagamentos,
  Clinica e Pagamentos
*/
export const appointmentRelation = relations(movementsTable, ({one}) => ({
  patient: one(patientTable, {
    fields: [movementsTable.patient_id],
    references: [patientTable.id]
  }),
  doctor: one(doctorTable, {
    fields: [movementsTable.doctor_id],
    references: [doctorTable.id]
  }),
  clinic: one(clinicTable, {
    fields: [movementsTable.clinic_id],
    references: [clinicTable.id]
  })
}))

/* 
  Paciente e Usuário 
  Paciente e endereco
*/
export const patientRelations = relations(patientTable, ({one, many}) => ({
  user: one(userTable,
    {
      fields: [patientTable.user_id],
      references: [userTable.id]
    }
  ),
  address: one(addressTable, {
    fields: [patientTable.address_id],
    references: [addressTable.id]
  })
}))



// Doctor relations
/* 
  Doutor e Periodo,
*/
export const periodRelation = relations(periodDoctorTable, ({one}) => (
  {
    doctor: one(doctorTable, {
      fields: [periodDoctorTable.doctor_id],
      references: [doctorTable.id]
    })
  })
)


/* 
  Doutor e Clinica
  Doutor e Periodos,
*/
export const doctorRelation = relations(doctorTable, ({one, many}) => ({
    periods: many(periodDoctorTable),
    address: one(addressTable, {
      fields: [doctorTable.address_id],
      references: [addressTable.id]
    }),
    clinic: one(clinicTable, {
      fields: [doctorTable.clinic_id],
      references: [clinicTable.id]
    })
  })
)

// Clinica Relations
export const clinicRelations = relations(clinicTable, ({one, many}) => ({
  doctor: many(doctorTable),
  address: one(addressTable, {
    fields: [clinicTable.address_id],
    references: [addressTable.id]
  })
}))


// Relações inversas: Insurance
export const insuranceRelations = relations(insuranceTable, ({ many }) => ({
  specialties: many(insuranceToSpecialtyTable),
}));

// Relações inversas: Specialty
export const specialtyRelations = relations(specialtyTable, ({ many }) => ({
  insurances: many(insuranceToSpecialtyTable),
}));


// Address Relations
export const countryRelations = relations(countryTable, ({ many }) => ({
  states: many(stateTable)
}))

// Estado → País e Cidades
export const stateRelations = relations(stateTable, ({ one, many }) => ({
  country: one(countryTable, {
    fields: [stateTable.country_id],
    references: [countryTable.id],
  }),
  cities: many(cityTable)
}))

// Cidade → Estado e Bairros
export const cityRelations = relations(cityTable, ({ one, many }) => ({
  state: one(stateTable, {
    fields: [cityTable.state_id],       
    references: [stateTable.id],
  }),
  neighborhoods: many(neighborhoodTable)
}))

// Bairro → Cidade
export const neighborhoodRelations = relations(neighborhoodTable, ({ one }) => ({
  city: one(cityTable, {
    fields: [neighborhoodTable.city_id],
    references: [cityTable.id],
  })
}))

// Endereço → Bairro
export const addressRelation = relations(addressTable, ({ one }) => ({
  neighborhood: one(neighborhoodTable, {
    fields: [addressTable.neighborhood_id],
    references: [neighborhoodTable.id],
  })
}))
