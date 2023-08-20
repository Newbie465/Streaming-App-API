import {pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'

export const users = pgTable(
    'users', 
    {
        id : uuid("id").primaryKey().defaultRandom(),
        email: varchar("email", { length: 256 }).unique().notNull(),
        name: varchar("name", { length: 256 }).notNull(),
        password: varchar("password", { length: 256 }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    }
)