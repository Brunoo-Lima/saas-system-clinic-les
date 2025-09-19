import { relations } from "drizzle-orm";
import {
    pgTable,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

// Address Schemas
export const countryTable = pgTable("country", {
    id: uuid("cou_id").primaryKey(),
    name: varchar("cou_name").notNull()
})

export const stateTable = pgTable("state", {
    id: uuid("sta_id").primaryKey(),
    name: varchar("sta_name").notNull(),
    uf: varchar("sta_uf").notNull(),
    country_id: uuid("fk_sta_cou_id").references(() => countryTable.id)
})

export const cityTable = pgTable("city", {
    id: uuid("cty_id").primaryKey(),
    name: varchar("cty_name").notNull(),
    state_id: uuid("fk_sta_cty_id").references(() => stateTable.id)
})

export const addressTable = pgTable("address", {
    id: uuid("add_id").primaryKey(),
    name: varchar("add_name").notNull().unique(),
    number: varchar("add_number").notNull(),
    neighborhood: varchar("add_neighborhood").notNull(),
    street: varchar("add_street").notNull(),
    cep: varchar("add_cep").notNull(),
    city_id: uuid("fk_add_cty_id").references(() => cityTable.id)
})


// Relations

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
