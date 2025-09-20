import express from "express";
import Image from "../Models/Image.js";
import auth from "../Middleware/auth.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

router.options('/', (req, res) => {
  res.status(200).end();
});
// Public: get images
router.get("/", async (req, res, next) => {
  try {
    const images = await Image.find().sort({ order: 1 });
    res.json(images);
  } catch (err) {
    next(err);
  }
});

// Admin: upload
router.post("/admin", auth, upload.single("image"), async (req, res) => {
  const image = new Image({
    url: `/uploads/${req.file.filename}`,
    title: req.body.title || 'Untitled',
    order: Date.now()
  });
  await image.save();
  res.json(image);
});

// Admin: reorder
router.put("/admin/order", auth, async (req, res) => {
  const { order } = req.body; // array of {id, order}
  for (const item of order) {
    await Image.findByIdAndUpdate(item.id, { order: item.order });
  }
  res.json({ message: "Order updated" });
});

// Admin: delete
router.delete("/admin/:id", auth, async (req, res) => {
  await Image.findByIdAndDelete(req.params.id);
  res.json({ message: "Image deleted" });
});

export default router;
