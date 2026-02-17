
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'notes-app',
        resource_type: 'auto', // Allow all file types
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx'],
    } as any, // Type cast to avoid TS issues if types are missing
});

const upload = multer({ storage });

export default upload;
