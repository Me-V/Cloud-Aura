import { ConvexError, v } from "convex/values"
import {mutation, MutationCtx, query, QueryCtx} from "./_generated/server"
// import { Organization } from "@clerk/nextjs/server";
import { getUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity) throw new ConvexError("U r Not Logged IN");


    return await ctx.storage.generateUploadUrl();
})

export async function hasAccessToOrg( ctx: QueryCtx | MutationCtx, orgId: string ) {
    
    // If for some reason this stops working then shift the identity to the function themselves downthere
    const indentity = await ctx.auth.getUserIdentity(); 
    if(!indentity) throw new ConvexError("U r Not Logged IN"); 
    
    const user = await getUser(ctx, indentity.tokenIdentifier);
    const cond = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

    if(!cond) throw new ConvexError("U dont have the access -  VASU");
    
    return cond;
}

export const createFile = mutation({
    args:{
        name: v.string(),
        orgId: v.string(),  
        type: v.union(v.literal("image/jpeg"), v.literal("application/pdf"), v.literal("text/csv")),
        fileId: v.id('_storage'),
    },
    async handler(ctx, args){ 
        
        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        if(!hasAccess) throw new ConvexError("U dont have the access -  VASU");     

        await ctx.db.insert("files",{
            name: args.name, 
            type: args.type,
            orgId: args.orgId,
            fileId: args.fileId,
        })
    }    
})

export const getFiles = query({
    args:{ orgId: v.string()}, // we ll be rendering the files of the organization that we passed from the front end ( only )...
    async handler (ctx, args){
       
       const hasAccess = await hasAccessToOrg(ctx, args.orgId)
       if(!hasAccess) return [];   

       return ctx.db.query("files").withIndex("by_orgId", (q)=> q.eq("orgId", args.orgId))
       .collect();
    }
})

export const deleteFile = mutation({
    args: {
        id: v.id("files"),
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId);
        if (!hasAccess) throw new ConvexError("You don't have access to delete this file");

        const existingFile = await ctx.db.get(args.id);
        if (!existingFile) throw new ConvexError("File not found");

        if (existingFile.orgId !== args.orgId) {
            throw new ConvexError("File doesn't belong to the specified organization");
        }
        
        return await ctx.db.delete(args.id);
    }
});
 