// routes/metrics.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Metric from "../models/Metric.js";

const router = express.Router();

// GET /api/metrics
router.get("/", authenticateToken, async (req, res) => {
  const metrics = await Metric.find({ userId: req.user.id });
  // const today = new Date().toISOString().slice(0, 10);
  // const formatted = metrics.map((m) => {
  //   const todayEntry = m.entries.find(
  //     (h) => h.date.toISOString().slice(0, 10) === today
  //   );
  //   const value = todayEntry?.value || 0;

  //   return {
  //     _id: m._id,
  //     name: m.name,
  //     target: m.target,
  //     value,
  //     unit: m.unit,
  //     entries: m.entries,
  //   };
  // });
  const formatted = metrics.map(formatMetricWithValue);

  res.json(formatted);
  //res.json(metrics);
});

// POST /api/metrics
router.post("/", authenticateToken, async (req, res) => {
  const { name, description, target, unit } = req.body;
  const metric = await Metric.create({
    userId: req.user.id,
    name,
    description,
    target,
    unit,
    entries: [],
  });
  res.status(201).json(metric);
});

// PUT /api/metrics/:id
router.put("/:id", authenticateToken, async (req, res) => {
  const { name, description, target, unit } = req.body;
  const metric = await Metric.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { name, description, target, unit },
    { new: true }
  );
  if (!metric) return res.status(404).json({ message: "Metric not found" });

  res.json(formatMetricWithValue(metric));
});

// DELETE /api/metrics/:id
router.delete("/:id", authenticateToken, async (req, res) => {
  await Metric.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Metric deleted" });
});

// POST /api/metrics/:id/entry
router.post("/:id/entry", authenticateToken, async (req, res) => {
  const { value, date } = req.body;
  const metric = await Metric.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $push: { entries: { date, value } } },
    { new: true }
  );
  if (!metric) return res.status(404).json({ message: "Metric not found" });

  res.json(formatMetricWithValue(metric));
});

// GET /api/metrics/:id
router.get("/:id", authenticateToken, async (req, res) => {
  console.log(req.params.id);
  try {
    const metric = await Metric.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!metric) return res.status(404).json({ message: "Metric not found" });
    res.json(formatMetricWithValue(metric));
    // res.json(metric);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function formatMetricWithValue(metric) {
  const today = new Date().toISOString().slice(0, 10);
  const todayEntries = metric.entries.filter(
    (h) => h.date.toISOString().slice(0, 10) === today
  );
  let value = 0;
  if (metric.type === "cumulative") {
    value = todayEntries.reduce((sum, e) => sum + e.value, 0);
  } else {
    value = todayEntries.at(-1)?.value || 0;
  }
  return {
    _id: metric._id,
    name: metric.name,
    target: metric.target,
    type: metric.type,
    value,
    unit: metric.unit,
    entries: metric.entries,
  };
}

export default router;
