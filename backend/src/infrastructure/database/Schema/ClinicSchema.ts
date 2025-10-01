import {
  pgTable,
  uuid,
  varchar,
  real,
  time,
  primaryKey,
  timestamp,
} from 'drizzle-orm/pg-core';
import { addressTable } from './AddressSchema';
import { insuranceTable } from './InsuranceSchema';
import { doctorTable } from './DoctorSchema';
import { relations } from 'drizzle-orm/relations';
import { userTable } from './UserSchema';
import { specialtyTable } from './SpecialtySchema';

// Clinica
export const clinicTable = pgTable('clinic', {
  id: uuid('cli_id').primaryKey().defaultRandom(),
  name: varchar('cli_name').notNull().unique(),
  cnpj: varchar('cli_cnpj').notNull().unique(),
  timeToConfirmScheduling: time('cli_time_to_confirm_scheduling').notNull(),
  phone: varchar('cli_phone').notNull(),
  user_id: uuid('fk_cli_use_id').references(() => userTable.id),
  address_id: uuid('fk_cli_add_id').references(() => addressTable.id),
  created_at: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updated_at: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
});

// RELACIONAMENTOS
// Tabela de relacionamento intermediaria: Clinica e Plano de saude
export const clinicToInsuranceTable = pgTable(
  'clinic_to_insurance',
  {
    clinic_id: uuid('fk_cin_cli_id').references(() => clinicTable.id),
    insurance_id: uuid('fk_cin_ins_id').references(() => insuranceTable.id),
  },
  (t) => [
    {
      pk: primaryKey({
        columns: [t.clinic_id, t.insurance_id],
      }),
    },
  ],
);

export const clinicToSpecialtyTable = pgTable(
  "clinic_to_specialty",
  {
    price: real('csp_price').default(0).notNull(), // Preço a clinica cobra por especilidade
    specialty_id: uuid("fk_csp_spe_id").references(() => specialtyTable.id),
    clinic_id: uuid("fk_csp_cli_id").references(() => clinicTable.id)
  }, 
  (t) => [
    {
      pk: primaryKey({
        columns: [t.clinic_id, t.specialty_id]
      })
    }
  ]
)

// Relacionamento intermediario entre: Clinica e Plano de saude
export const clinicToInsuranceRelation = relations(
  clinicToInsuranceTable,
  ({ one }) => ({
    clinic: one(clinicTable, {
      fields: [clinicToInsuranceTable.clinic_id],
      references: [clinicTable.id],
    }),
    insurance: one(insuranceTable, {
      fields: [clinicToInsuranceTable.insurance_id],
      references: [insuranceTable.id],
    }),
  }),
);

export const clinicToSpecialtyRelation = relations(clinicToSpecialtyTable, ({ one }) => ({
  clinic: one(clinicTable, {
    fields: [clinicToSpecialtyTable.clinic_id],
    references: [clinicTable.id]
  }),
  specialty: one(specialtyTable, {
    fields: [clinicToSpecialtyTable.specialty_id],
    references: [specialtyTable.id]
  })
}))

// Clinica Relations
export const clinicRelations = relations(clinicTable, ({ one, many }) => ({
  doctor: many(doctorTable),
  user: one(userTable, {
    fields: [clinicTable.user_id],
    references: [userTable.id],
  }),
  address: one(addressTable, {
    fields: [clinicTable.address_id],
    references: [addressTable.id],
  }),
}));
