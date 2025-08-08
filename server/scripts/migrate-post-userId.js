import mongoose from "mongoose";
import "dotenv/config";
import Post from "../models/post.model.js";

await mongoose.connect(process.env.MONGO_URI);

const posts = await Post.find({ userId: { $type: "string" } });
for (const p of posts) {
  try {
    p.userId = new mongoose.Types.ObjectId(p.userId);
    // optional likes auch casten, wenn Strings:
    p.likes = (p.likes || []).map((id) => new mongoose.Types.ObjectId(id));
    await p.save();
    console.log("Migrated", p._id.toString());
  } catch (e) {
    console.warn("Skip", p._id.toString(), e.message);
  }
}

await mongoose.disconnect();
console.log("Done");
process.exit(0);
