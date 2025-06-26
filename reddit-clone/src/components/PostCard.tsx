import {FaRegCommentAlt, FaTrash} from "react-icons/fa"
import {TbArrowBigUp, TbArrowBigDown} from "react-icons/tb"
import {Link, useNavigate} from "react-router-dom"
import { useMutation, useQuery } from "convex/react"
import {api} from "../../convex_generated/api"
import {Id} from "../../convex_generated/dataModel"
import {useUser} from "@clerk/clerk-react"
import "../styles/PostCard.css"
import { create } from "domain"
import { userPosts } from "../../convex/post"
import { useState } from "react"

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
    return (
    <div className="post-header">
        {author ? (
            <Link to={`/u/${author.username}`}>u{author?.username}</Link>
         ) : (
         <span className="post-author">u/deleted</span>
        )}
        {showSubreddit && subreddit && (
            <> 
            <span className="post-dot">-</span>
            <Link to={`/r/${subreddit.name}`} className="post-subreddit">
                r/{subreddit.name}
            </Link> 
        </>
        )}
        <span className="post-dot">-</span>
        <span className="post-timestamp">
            {new Date(creationTime).toLocaleString()}
        </span>
    </div>
    );
}

const PostContent = ({subject, body, image, expandedView}: PostContentProps) => {
    return (
    <>
        {expandedView ? (
            <>
            <h1 className="post-title">{subject}</h1>
            {image && (
                <div className="post-image-container">
                    <img src={image} alt="Post content" className="post-image"/>
                </div>
                )}
                {body && <p className="post-body">{body}</p>}
        </> 
        ) : (
            <div className="preview-post">
                <div>
                    <h2 className="post-title">{subject}</h2>
                    {body && <p className="post-body">{body}</p>}
                </div>
                {image &&(
                    <div className="post-image-container small-img">
                    <img src={image} alt="Post content" className="post-image"/>
                </div>
                )}
        </div>)}
    </>
    );
};

const PostCard = ({post, showSubreddit, expandedView}: PostCardProps) => {
    const [showComments, setShowComments] = useState(expandedView)
    const navigate = useNavigate()
    const {user} = useUser();
    const ownedByCurrentUser = post.author?.username === user?.username;

    const handleComment = () => {}

    const handleDelete = () => {

    }

    const handleSubmit = (content: string) => {}

    return <div className={`post-card ${expandedView ? "expanded" : ""}`}>
        <div className="post=content">
            <PostHeader />
            <PostContent />
        </div>
    </div>
}