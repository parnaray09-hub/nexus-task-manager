import { pgTable, uuid, text, timestamp, pgEnum, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("user_role", ["ADMIN", "MEMBER"]);
export const statusEnum = pgEnum("task_status", ["PENDING", "IN_PROGRESS", "COMPLETED"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  role: roleEnum("role").default("MEMBER").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  assigneeId: uuid("assignee_id").references(() => profiles.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  status: statusEnum("status").default("PENDING").notNull(),
  dueDate: date("due_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({ tasks: many(tasks) }));
export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  assignee: one(profiles, { fields: [tasks.assigneeId], references: [profiles.id] }),
}));
export const profilesRelations = relations(profiles, ({ many }) => ({ tasks: many(tasks) }));