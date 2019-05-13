import multer from 'multer';
import multerCloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});
const storage = multerCloudinaryStorage({
  cloudinary,
  folder: 'authorsHeaven',
  allowedFormat: ['jpg', 'png', 'jpeg', 'gif'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});
const multerConfiguration = multer({ storage }).single('image');


export default multerConfiguration;
