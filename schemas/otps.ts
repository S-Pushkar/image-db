// import mongoose from "mongoose";

// const otpsSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   otp: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
//   expireAt: { type: Date, default: Date.now, index: { expires: "5m" } },
// });

// export default mongoose.models.otps ||
//   mongoose.model("otps", otpsSchema, "otps");