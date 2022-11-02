import {
  connectDataBase,
  getAllDocumenst,
  insertDocument,
} from "../../../helpers/db-utils"

async function handler(req, res) {
  const eventId = req.query.eventId
  let client
  try {
    client = await connectDataBase()
  } catch (error) {
    res.status(500).json({ message: "connecting to the database failed" })
    return
  }

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
      client.close()
      return
    }
    const newComment = {
      email,
      name,
      text,
      eventId,
    }
    let result
    try {
      result = await insertDocument(client, "comments", newComment)
      newComment._id = result.insertedId
      res.status(201).json({ message: "added comment!", newComment })
    } catch (error) {
      res.status(500).json({ message: "inserted comment failed failed" })
    }
  }
  if (req.method === "GET") {
    let documents
    try {
      documents = await getAllDocumenst(client, "comments", { _id: -1 })
      res.status(201).json({ comments: documents })
    } catch (error) {
      res.status(500).json({ message: "getting comments failed" })
    }
  }
  client.close()
}

export default handler
