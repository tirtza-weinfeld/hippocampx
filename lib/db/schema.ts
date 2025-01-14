import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const algorithms = pgTable("algorithms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), 
  bestCase: text("best_case").notNull(),        
  averageCase: text("average_case").notNull(), 
  worstCase: text("worst_case").notNull(), 
});