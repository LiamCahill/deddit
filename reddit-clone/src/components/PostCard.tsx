import {FaRegCommentAlt, FaTrash} from "react-icons/fa"
import {TbArrowBigUp, TbArrowBigDown} from "react-icons/tb"
import {Link, useNavigate} from "react-router-dom"
import { useMutation, useQuery } from "convex/react"
import {api} from "../../convex_generated/api"
import {Id} from "../../convex_generated/dataModel"
import {useUser} from "@clerk/clerk-react"
import "../styles/PostCard.css"

interface Post {
    _id: Id<"post">,
    subject: string;
    body: string;
    _creationTime: number;
    author_id: string,
    imageUrl?: string
    author?: {
        username: string
    }
    subreddit?: {
        name: string
    }
}
interface PostCardProps {
    post: Post;
    showSubreddit?: boolean;
    expandedView?: boolean;
}

interface PostHeaderProps {
    author?: {username: string}
    subreddit: {name: string}
    showSubreddit: boolean
    creationtime: number
}

interface PostContentProps {
    subject: string;
    body?: string;
    image?: string;
    expandedView: boolean;
}

const PostHeader = ({author, subreddit, showSubreddit, creationTime}: PostHeaderProps) => {
    
     
}