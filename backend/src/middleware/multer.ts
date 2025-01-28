import multer from "multer";
import path from "path";

const mediaPath: string = path.resolve(__dirname, "../../public/aadhar");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, mediaPath);
    },
    filename: (req, file, cb) => {
      cb(null, "aadhar.jpg");
    },
  }),
});

export const uploadAadhar = upload.single("aadhar");
