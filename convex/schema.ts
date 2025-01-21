import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export type FileType = "image/jpeg" | "image/png" | "application/pdf" | "text/csv" | "application/x-compressed" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export default defineSchema({
  files: defineTable({ 
    name: v.string(),
    type: v.string(),
    orgId: v.optional(v.string()), 
    fileId: v.id('_storage'),
    isStarred: v.boolean(),
    isDeleted: v.optional(v.boolean()),
    size: v.number(),
  }).index("by_orgId",["orgId"]).index("by_fileId", ["fileId"]).index("by_isDeleted", ["isDeleted"]),
 
  users: defineTable({ 
    tokenIdentifier: v.string(), 
    orgIds: v.array(v.string()),
  }).index("by_tokenIdentifier", ['tokenIdentifier']),

});