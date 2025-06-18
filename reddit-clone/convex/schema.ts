import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { describe } from "node:test";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        externalId: v.string(),
    })
    .index("byExternalId", ["externalId"])
    .index("byUsername", ["username"]),
    subreddit: defineTable ({
        name: v.string(),
        description: v.optional(v.string()),
        authorId: v.id("users") //to my understanding, this is quering my Convex db "users" table and somehow getting the id of the current user making the subreddit.
    }),
    post: defineTable ({
        subject: v.string(),
        body: v.string(),
        subreddit: v.id("subreddit"),
        authorId: v.id("users"),
        image: v.optional(v.id("_storage")) //optional, will be handled later
    })
    .index("bySubreddit", ["subreddit"])
    .index("byAuthor", ["authorId"])
});