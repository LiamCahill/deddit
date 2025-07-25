import "../styles/SubmitPage.css";
import { useNavigate, useParams } from "react-router-dom"; //how we get the subreddit
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {api} from "../../convex/_generated/api"
import { FaImage } from "react-icons/fa";
import {IoMdClose, IoMdReturnLeft} from "react-icons/io"

const SubmitPage = () => {
  const {subredditName} = useParams()
  const navigate = useNavigate()
  const subreddit = useQuery(api.subreddit.get, {name: subredditName || ""})

  if(subreddit === undefined) return <p>Loading...</p>

  if (!subreddit) {
    return <div className="content-container">
      <div className="not-found">
        <h1>Subreddit not found</h1>
        <p>The subreddit r/{subredditName} does not exist. (Try creating it!)</p>
      </div>
    </div>
  }


  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createPost = useMutation(api.post.create)
  const generateUploadUrl = useMutation(api.image.generateUploadUrl)

  const handleImageSelect = (e: React.ChangeEvent<HTLMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      if(file.size > 5 * 1024 * 1024) {
        alert("Image size should be less thatn 5MB")
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!title.trim() || !subreddit) {
      alert("Please enter a title and select a subreddit")
      return
    }

    try {
      setIsSubmitting(true);
      let imageUrl = undefined;

      if (selectedImage) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: {"Content-Type":selectedImage.type},
          body: selectedImage
        })
        if(!result.ok) throw new Error('Failed to upload image.')

          const {storageId} = await result.json()
          imageUrl = storageId;

      }


      await createPost({
        subject: title.trim(),
        body: body.trim(),
        subreddit: subreddit._id,
        storageId: imageUrl
      })
      navigate(`/r/${subredditName}`)
      
    } catch (error) {
      alert("Failed to create post. Please try again.")
      console.log(error)
    }
    finally {
      setIsSubmitting(false)
    }
  };



    return <div className="content-container">
      <div className="submit-container">
        <h1>Create a post in r/{subredditName}</h1>
        <form className="submit-form" onSubmit={handleSubmit}>
          <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => {setTitle(e.target.value)}} 
          className="submit-title" 
          maxLength={100}
          />
          <div className="media-input-container">
            <label className="image-upload-label">
              <FaImage className="image-icon" />
              Upload Image
              <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect}
              style={{ display: "none"}}
              />
            </label>
            {imagePreview && (
            <div className="image-preview-container">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="image-preview" 
                />
              <button 
              type="button" 
              className="remove-image-button" 
              onClick={handleRemoveImage}
              >
                <IoMdClose />
                </button>
              </div>
            )}
          </div>
          <textarea 
          placeholder="Text (Optional)" 
          value={body} 
          onChange={(e) => setBody(e.target.value)}
          className="submit-body"
          />
        <div className="submit-actions">
          <button 
          type="button" 
          onClick={() => navigate(`/r/${subredditName}`)}
          className="back-button"
          disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting || !title.trim()} //this is a way to check that there is content in the title before submitting something.
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>

        </div>
        </form>
      </div>
    </div>
}
  
  export default SubmitPage;