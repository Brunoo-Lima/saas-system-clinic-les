import { relations } from 'drizzle-orm';
import {
    stateTable,
    countryTable,
    cityTable,
    addressTable
} from './AddressSchema';

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


// Endereço → Cidade
export const addressRelation = relations(addressTable, ({ one }) => ({
  neighborhood: one(cityTable, {
    fields: [addressTable.city_id],
    references: [cityTable.id],
  })
}))
