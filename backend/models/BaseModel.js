/**
 * BaseModel properties definition. 
 * In Prisma + PostgreSQL, these fields are defined statically inside schema.prisma:
 * - id: String (@id @default(uuid()))
 * - createdAt: DateTime (@default(now()))
 * - updatedAt: DateTime (@updatedAt)
 * - deletedAt: DateTime?
 */
export const BaseModelProperties = {
  id: 'String (UUID) - Primary Key',
  createdAt: 'DateTime - Creation Timestamp',
  updatedAt: 'DateTime - Last Update Timestamp',
  deletedAt: 'DateTime (Nullable) - Soft Delete Timestamp'
}

// Keep a dummy plugin export to retain import compatibility
export function BaseModelPlugin() {}

export default BaseModelPlugin
