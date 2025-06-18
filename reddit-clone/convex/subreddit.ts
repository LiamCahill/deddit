import { describe } from "node:test"
import {mutation, query} from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import {ConvexError, v} from "convex/values"

export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),

    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx) //we only want a user who is signed in to have the ability to create a subreddit
        const subreddit = await ctx.db.query("subreddit").collect()
        if(subreddit.some((s) => s.name === args.name)) {
            throw new ConvexError({message: "Subreddit already exists."})
        }
        await ctx.db.insert("subreddit", {
            name: args.name,
            description: args.description,
            authorId: user._id
        })
    }
})

export const get = query({
    args: {name: v.string()},
    handler: async(ctx, args) => {
        const subreddit = await ctx.db
        .query("subreddit")
        .filter((q) => q.eq(q.field("name"), args.name))
        .unique();
        if(!subreddit) return null
        return subreddit
    }
})