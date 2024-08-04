import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, default: "" },
});

export default mongoose.models.users ||
  mongoose.model("users", usersSchema, "users");
