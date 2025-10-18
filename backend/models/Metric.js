// models/Metric.js
import mongoose from "mongoose";

const MetricSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  target: Number, // daily target, e.g. 8 hours sleep, 3 workouts
  unit: String, // e.g. 'hours', 'tasks', 'km',
  type: { type: String, enum: ["cumulative", "latest"], default: "cumulative" },
  entries: [
    {
      date: { type: Date, required: true },
      value: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Metric", MetricSchema);
