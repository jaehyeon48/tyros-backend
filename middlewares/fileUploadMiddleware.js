const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/jpeg': 'jpeg'
};

const fileUploadMiddleware = multer({
  limits: 500000, // 5KB
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'avatars');
    },
    filename: (req, file, cb) => {
      const fileExtension = MIME_TYPE_MAP[file.mimetype];
      cb(null, `${uuidv4()}.${fileExtension}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValidExtension = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValidExtension ? null : new Error('Invalid mime-type!');
    cb(error, isValidExtension);
  }
});

module.exports = fileUploadMiddleware;