import multer from "multer";
import { put } from "@vercel/blob";
import path from "path";

// Custom storage engine for Vercel Blob
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware to handle Vercel Blob upload
export const uploadToBlob = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `uploads/${Date.now()}-${path.basename(req.file.originalname)}`;

    // Upload to Vercel Blob
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: req.file.mimetype,
    });

    // Add blob info to request
    req.blobUrl = blob.url;
    next();
  } catch (error) {
    console.error('Blob upload error:', error);
    next(error);
  }
};

export default upload;
