import { useContext, useEffect, useState } from "react"

import CommentList from "./comment-list"
import NewComment from "./new-comment"
import classes from "./comments.module.css"
import NotificationContext from "../../store/notification-context"

function Comments({ eventId }) {
  const [showComments, setShowComments] = useState(false)
  const [fetchingComments, setFetchingComments] = useState(false)
  const notificationCtx = useContext(NotificationContext)
  const [comments, setComments] = useState([])
  useEffect(() => {
    if (showComments) {
      setFetchingComments(true)
      fetch("/api/comments/" + eventId)
        .then((res) => res.json())
        .then((data) => {
          setComments(data.comments)
          setFetchingComments(false)
        })
    }
  }, [showComments])
  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus)
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: "Sending comment...",
      message: "your comment is currently being stored in db",
      status: "pending",
    })
    // send data to API
    fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return res.json().then((data) => {
          throw new Error(data.message || "something went wrong")
        })
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "comment saved",
          status: "success",
        })
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "error!",
          message: error.message || "something went wrong",
          status: "error",
        })
      })
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !fetchingComments && <CommentList items={comments} />}
      {showComments && fetchingComments && <p>Loading...</p>}
    </section>
  )
}

export default Comments
