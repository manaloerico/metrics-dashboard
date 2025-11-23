// models/RefreshToken.js
import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate tokens
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceInfo: {
    type: String, // optional, e.g., browser/device fingerprint
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});

export default mongoose.model("RefreshToken", RefreshTokenSchema);

// meron akong angular / node app, na may login and gusto ko lagyan ng session management, sa session management, ang gusto ko sana is kapag walang api call within 14mins 50 seconds may magpoprompt na dialog na you will be logged out in 10seconds , ung dialog may button na u can resume the session ,pag hinit nia ung resume, magcacall si front end ng refresh token and magrereset ung timer ng pagwalang api call within 14min 50 second. pero if nagkaron ng api call, within 14mins, dapat magrerequest lang ng refresh token kapag 14mins, para di naman maspam ung refreshtoken call
