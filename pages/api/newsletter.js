import { connectDataBase, insertDocument } from "../../helpers/db-utils"

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email

    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "invalid email address" })
      return
    }
    let client
    try {
      client = await connectDataBase()
    } catch (error) {
      res.status(500).json({ message: "connecting to the database failed" })
      return
    }
    try {
      await insertDocument(client, "newsletter", { email: userEmail })
      client.close()
    } catch (error) {
      res.status(500).json({ message: "inserting database failed" })
      return
    }
    res.status(201).json({ message: "Success! Signed up" })
  }
}

export default handler
