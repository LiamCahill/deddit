import {mutation, query} from "./_generated/server"
import {v} from "convex/values"
import { getCurrentUser, getCurrentUserOrThrow } from "./users"
import {counts} from "./counter"

type VoteType = "upvote" | "downvote"

function voteKey(postId: string, voteType: VoteType): string {
    return `${voteType}:${postId}`
}

export function createToggleVoteMutation(voteType: VoteType){
    return mutation({
        args: {postId: v.id("post")},
        handler: async (ctx, args) => {
            const user = await getCurrentUserOrThrow(ctx)
            const oppositeVoteType : VoteType = voteType === "upvote" ? "downvote" : "upvote"

            const existingVote = await ctx.db
            .query(voteType).withIndex("byPost", (q) => q.eq("postId", args.postId))
            .filter((q) => q.eq(q.field("userId"), user._id))
            .unique();

            if (existingVote) {
                await ctx.db.delete(existingVote._id);
                await counts.dec(ctx, voteKey(args.postId, voteType));
                return
            }

            const existingOppositeVote = await ctx.db
            .query(oppositeVoteType).withIndex("byPost", (q) => q.eq("postId", args.postId))
            .filter((q) => q.eq(q.field("userId"), user._id))
            .unique();
        }


    })
}