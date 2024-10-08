import { ConvexError, v } from "convex/values"
import {mutation, MutationCtx, query, QueryCtx} from "./_generated/server"
import { Organization } from "@clerk/nextjs/server";
import { getUser } from "./users";

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
    },
    async handler(ctx, args){ 
        
        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        if(!hasAccess) throw new ConvexError("U dont have the access -  VASU");     

        await ctx.db.insert("files",{
            name: args.name, 
            orgId: args.orgId,
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
