import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const personalProfilesTable = pgTable("personal_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  nationalId: text("national_id"),
  riskProfile: text("risk_profile"), // conservative | moderate | aggressive
  behavioralScore: integer("behavioral_score"),
  emotionalIndexStability: real("emotional_index_stability"),
  monthlyIncome: real("monthly_income"),
  monthlyExpenses: real("monthly_expenses"),
  currentSavings: real("current_savings"),
  currentInvestment: real("current_investment"),
  experienceLevel: text("experience_level"), // beginner | intermediate | advanced
  investmentGoal: text("investment_goal"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPersonalProfileSchema = createInsertSchema(personalProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPersonalProfile = z.infer<typeof insertPersonalProfileSchema>;
export type PersonalProfile = typeof personalProfilesTable.$inferSelect;
