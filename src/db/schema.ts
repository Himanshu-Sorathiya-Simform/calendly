import {
	integer,
	pgTable,
	serial,
	text,
	time,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	name: varchar("name", { length: 255 }).notNull(),
	googleRefreshToken: text("google_refresh_token"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const eventTypes = pgTable("event_types", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.references(() => users.id)
		.notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	duration: integer("duration").notNull(), // in minutes
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const availability = pgTable("availability", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.references(() => users.id)
		.notNull(),
	dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
});

export const bookings = pgTable("bookings", {
	id: serial("id").primaryKey(),
	eventTypeId: integer("event_type_id")
		.references(() => eventTypes.id)
		.notNull(),
	guestEmail: varchar("guest_email", { length: 255 }).notNull(),
	guestName: varchar("guest_name", { length: 255 }).notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
