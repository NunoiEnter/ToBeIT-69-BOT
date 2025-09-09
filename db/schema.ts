import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
});

export const personalData = pgTable("personalData", {
  id: text("id").primaryKey(),
  prefix: text("prefix"),
  firstname: text("firstname"),
  surname: text("surname"),
  nickname: text("nickname"),
  phone: text("phone"),
  bDate: timestamp("bDate"),
  image: text("image"),
  region: text("region"),
  studyPlan: text("study_plan"),
  grade: text("grade"),
  school: text("school"),
  userId: text("userId").references(() => users.id),
  discordId: text("discord_id"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
});