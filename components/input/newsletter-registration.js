import { useContext, useRef } from "react"
import NotificationContext from "../../store/notification-context"
import classes from "./newsletter-registration.module.css"

function NewsletterRegistration() {
  const emailInputRef = useRef()
  const notificationCtx = useContext(NotificationContext)
  function registrationHandler(event) {
    event.preventDefault()
    const entredEmail = emailInputRef.current.value
    notificationCtx.showNotification({
      title: "Signing Up",
      message: "register to newsletter",
      status: "pending",
    })
    // fetch user input (state or refs)
    // optional: validate input
    // send valid data to API
    fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email: entredEmail }),
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
          message: "Successfully registered",
          status: "success",
        })
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Signing Up Failed",
          message: error.message || "Failed registration",
          status: "error",
        })
      })
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={emailInputRef}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  )
}

export default NewsletterRegistration
