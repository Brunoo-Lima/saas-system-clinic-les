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

export const neighborhoodTable = pgTable("neighborhood", {
    id: uuid("id").primaryKey(),
    name: varchar("name").notNull(),
    city_id: uuid("city_id").references(() => cityTable.id)
})

export const addressTable = pgTable("address", {
    id: uuid("add_id").primaryKey(),
    name: varchar("add_name").notNull(),
    number: varchar("add_number").notNull(),
    street: varchar("add_street").notNull(),
    cep: varchar("add_cep").notNull(),
    city_id: uuid("fk_add_cty_id").references(() => neighborhoodTable.id)
})
