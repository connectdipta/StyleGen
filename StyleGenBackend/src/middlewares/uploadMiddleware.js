import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set Storage Engine
// Default to memory storage (safe for serverless environments like Vercel).
// To enable disk storage locally set environment variable `LOCAL_UPLOADS=true`.
const useDisk = process.env.LOCAL_UPLOADS === 'true';
let storage = multer.memoryStorage();
if (useDisk) {
    const uploadDir = './src/uploads/';
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        storage = multer.diskStorage({
            destination: uploadDir,
            filename: (req, file, cb) => {
                cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
            }
        });
    } catch (err) {
        storage = multer.memoryStorage();
    }
}

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

export default upload;
