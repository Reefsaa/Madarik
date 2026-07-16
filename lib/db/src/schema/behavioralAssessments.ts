import { pgTable, serial, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const behavioralAssessmentsTable = pgTable("behavioral_assessments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  monthlyIncome: real("monthly_income"),
  monthlyExpenses: real("monthly_expenses"),
  currentSavings: real("current_savings"),
  currentInvestment: real("current_investment"),
  experienceLevel: text("experience_level"),
  investmentGoal: text("investment_goal"),
  riskTolerance: text("risk_tolerance"),
  lossReaction: text("loss_reaction"),
  socialMediaInfluence: text("social_media_influence"),
  marketKnowledge: integer("market_knowledge"),
  holdingPeriod: text("holding_period"),
  computedRiskProfile: text("computed_risk_profile"),
  computedBehavioralScore: integer("computed_behavioral_score"),
  answers: jsonb("answers"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBehavioralAssessmentSchema = createInsertSchema(behavioralAssessmentsTable).omit({ id: true, createdAt: true });
export type InsertBehavioralAssessment = z.infer<typeof insertBehavioralAssessmentSchema>;
export type BehavioralAssessment = typeof behavioralAssessmentsTable.$inferSelect;
