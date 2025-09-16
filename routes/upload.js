import express from 'express';
import multer from 'multer';
import { uploadImage } from '../utils/cloudinary.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/upload/image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const result = await uploadImage(req.file.path);
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

export default router;
