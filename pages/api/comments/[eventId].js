import { MongoClient } from "mongodb"

async function handler(req, res) {
  const eventId = req.query.eventId
  const client = await MongoClient.connect(
    "mongodb+srv://Majdi:DLoutFnXU7oEmjko@cluster0.msrhy.mongodb.net/events?retryWrites=true&w=majority"
  )
  if (req.method === "POST") {
    // add serverside validation
    const { email, name, text } = req.body
    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "invalid input" })
      return
    }
    const newComment = {
      email,
      name,
      text,
      eventId,
    }
    const db = client.db()
    const result = await db.collection("comments").insertOne(newComment)
    console.log(result)
    res.status(201).json({ message: "added comment!", newComment })
  }
  if (req.method === "GET") {
    const db = client.db()
    const documents = await db
      .collection("comments")
      .find()
      .sort({ _id: -1 })
      .toArray()
    res.status(201).json({ comments: documents })
  }
  client.close()
}

export default handler
