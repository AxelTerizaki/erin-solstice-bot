CREATE TABLE "daily" IF NOT EXISTS (
	"type" varchar PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"regress" numeric NOT NULL DEFAULT (0.25),
	"firstcall" numeric NOT NULL DEFAULT (2)
);

CREATE TABLE "daily_user" IF NOT EXISTS (
	"userid" varchar PRIMARY KEY NOT NULL,
	"date" datetime NOT NULL DEFAULT (datetime('now')),
	"dailyType" varchar,
	CONSTRAINT "FK_e829c59ac444a42e6d9388a6817" FOREIGN KEY ("dailyType") REFERENCES "daily" ("type") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "inventory" IF NOT EXISTS (
	"nb" integer NOT NULL,
	"userId" varchar NOT NULL,
	"itemId" integer NOT NULL,
	CONSTRAINT "FK_fe4917e809e078929fe517ab762" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "FK_6227c61eff466680f9bb9933305" FOREIGN KEY ("itemId") REFERENCES "item" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "itemId")
);

CREATE TABLE "item" IF NOT EXISTS (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"name" varchar NOT NULL,
	"emote" varchar NOT NULL,
	"price" integer NOT NULL
);

CREATE TABLE "reminder" IF NOT EXISTS (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"content" varchar NOT NULL,
	"created_at" datetime NOT NULL DEFAULT (datetime('now')),
	"remind_at" datetime NOT NULL,
	"channel_id" varchar NOT NULL
);

CREATE TABLE "role" IF NOT EXISTS (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"assignable" boolean NOT NULL DEFAULT (0)
);

CREATE TABLE "setting" IF NOT EXISTS (
	"setting" varchar PRIMARY KEY NOT NULL,
	"value" varchar NOT NULL
);

CREATE TABLE "user" IF NOT EXISTS (
	"id" varchar PRIMARY KEY NOT NULL,
	"money" integer NOT NULL
);

CREATE TABLE "user_level" IF NOT EXISTS (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"avatar" varchar NOT NULL,
	"messages" integer NOT NULL,
	"xp" integer NOT NULL,
	"class" text,
	"level" integer NOT NULL
);
