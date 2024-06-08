import connectToDatabase from "../../../../lib/mongodb";
import Media from "../../../../models/Media";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case "GET":
      try {
        const media = await Media.find({});
        res.status(200).json({ success: true, data: media });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const media = await Media.create(req.body);
        res.status(201).json({ success: true, data: media });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
