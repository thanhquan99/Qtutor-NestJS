import { diskStorage } from 'multer';

export const storage = diskStorage({
  destination: './public/img',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file) {
  return `${Date.now()}.${file.originalname}`;
}
