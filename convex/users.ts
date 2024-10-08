import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";

//making a helper function >>>> to find a user
export async function getUser( ctx: QueryCtx | MutationCtx , tokenIdentifier: string){
  
   const user = await ctx.db.
   query("users").
   withIndex('by_tokenIdentifier', (q)=>q.eq("tokenIdentifier", tokenIdentifier)).
   first();

   if(!user) throw new ConvexError("The user isnt really being authorized - Vasu");
   
   return user; // clerk gives us a token and this getUser function just checks if it is there in the db or not..
}


export const createUser = internalMutation({
    args:{ tokenIdentifier: v.string() },
    async handler(ctx, args){
      
        await ctx.db.insert("users",{
            tokenIdentifier: args.tokenIdentifier,
            orgIds: []
        })
    }
})

export const addOrgIdToUser = internalMutation({
    args:{ tokenIdentifier: v.string(), orgId: v.string() },
    async handler(ctx, args){
        
        //getting the user information ...
        const user = await getUser(ctx, args.tokenIdentifier)
        
        //now to update the user's org id ... .. . . .
        await ctx.db.patch(user._id,{
            orgIds: [...user.orgIds, args.orgId] //appending(...) coz there might be many orgIds associated with thisuser
        })
    }
})