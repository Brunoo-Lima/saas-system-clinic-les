CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" varchar,
	"created_at" timestamp DEFAULT '2025-08-18 23:02:10.467' NOT NULL,
	"updated_at" timestamp DEFAULT '2025-08-18 23:02:10.467' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
