import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { getUser } from "./users";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("U r Not Logged IN");

  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  // If for some reason this stops working then shift the identity to the function themselves downthere
  const indentity = await ctx.auth.getUserIdentity();
  if (!indentity) throw new ConvexError("U r Not Logged IN");

  const user = await getUser(ctx, indentity.tokenIdentifier);
  const cond =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  if (!cond) throw new ConvexError("U dont have the access -  VASU");

  return cond;
}

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    type: v.union(
      v.literal("image/jpeg"),
      v.literal("application/x-compressed"),
      v.literal("image/png"),
      v.literal("application/pdf"),
      v.literal("text/csv"),
      v.literal(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ),
    fileId: v.id("_storage"),
    size: v.number(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) throw new ConvexError("U dont have the access -  VASU");

    await ctx.db.insert("files", {
      name: args.name,
      type: args.type,
      orgId: args.orgId,
      fileId: args.fileId,
      isStarred: false,
      size: args.size, // Add size property
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    toBeDeleted: v.optional(v.boolean()),
  }, // we ll be rendering the files of the organization that we passed from the front end ( only )...
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) return [];

    const file = ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    if (args.query === "" || args.query === null || args.query === undefined) {
      return file;
    } else {
      const filteredFiles = (await file).filter((file) =>
        file.name.toLowerCase().includes(args.query!.toLowerCase())
      ); //( '!' )keep this operator in mind this tells TypeScript that the query will definitely not null or undefined

      return filteredFiles;
    }
  },
});

export const deleteFile = internalMutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("isDeleted"), true))
      .collect();

    await Promise.all(
      files.map(async (file) => {
        await ctx.storage.delete(file.fileId as Id<"_storage">);
        return ctx.db.delete(file._id);
      })
    );
  },
});

export const list = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    // a query to find the file with the given fileId
    const file = await ctx.db
      .query("files")
      .withIndex("by_fileId", (q) => q.eq("fileId", args.fileId))
      .first();
    if (!file) throw new ConvexError("File not found");

    return await ctx.storage.getUrl(file?.fileId as Id<"_storage">);
  },
});

export const starFile = mutation({
  args: {
    fileId: v.id("files"),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess)
      throw new ConvexError("You don't have access to star this file");

    const existingFile = await ctx.db.get(args.fileId);
    if (!existingFile) throw new ConvexError("File not found");

    if (existingFile.orgId !== args.orgId) {
      throw new ConvexError(
        "File doesn't belong to the specified organization"
      );
    }

    await ctx.db.patch(args.fileId, {
      isStarred: true,
    });
  },
});

export const unstarFile = mutation({
  args: {
    fileId: v.id("files"),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess)
      throw new ConvexError("You don't have access to unstar this file");

    const existingFile = await ctx.db.get(args.fileId);
    if (!existingFile) throw new ConvexError("File not found");

    if (existingFile.orgId !== args.orgId) {
      throw new ConvexError(
        "File doesn't belong to the specified organization"
      );
    }

    await ctx.db.patch(args.fileId, {
      isStarred: false,
    });
  },
});

export const getStarredFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess)
      throw new ConvexError("You don't have access to get starred files");

    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
    return files
      .filter((file) => file.isStarred)
      .filter((file) => !file.isDeleted);
  },
});

export const deleteCron = mutation({
  args: {
    fileId: v.id("files"),
    orgId: v.string(),
    isDeleted: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess)
      throw new ConvexError("You don't have access to unstar this file");

    const existingFile = await ctx.db.get(args.fileId);
    if (!existingFile) throw new ConvexError("File not found");

    if (existingFile.orgId !== args.orgId) {
      throw new ConvexError(
        "File doesn't belong to the specified organization"
      );
    }

    await ctx.db.patch(args.fileId, {
      isDeleted: true,
    });
  },
});

export const notDeleteCron = mutation({
  args: {
    fileId: v.id("files"),
    orgId: v.string(),
    isDeleted: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess)
      throw new ConvexError("You don't have access to unstar this file");

    const existingFile = await ctx.db.get(args.fileId);
    if (!existingFile) throw new ConvexError("File not found");

    if (existingFile.orgId !== args.orgId) {
      throw new ConvexError(
        "File doesn't belong to the specified organization"
      );
    }

    await ctx.db.patch(args.fileId, {
      isDeleted: false,
    });
  },
});

export const getDeletedFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess)
      throw new ConvexError("You don't have access to get starred files");

    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
    return files.filter((file) => file.isDeleted);
  },
});

export const getStorageInfo = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess)
      throw new ConvexError("You don't have access to get starred files");

    // Fetch storage information from the _storage system table
    const storageItems = await ctx.db.query("files").withIndex("by_orgId", (q) => q.eq("orgId", args.orgId)).collect();

    // Calculate total storage used
    const totalStorage = storageItems.reduce((acc, item) => acc + item.size, 0);

    return {
      totalStorage,
      items: storageItems.map((item) => ({
        id: item._id,
        size: item.size / 1024 / 1024, // Convert bytes to MB
      })),
    };
  },
});
