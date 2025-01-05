import multer from "multer";

const configureMulter = (destination) =>
  multer({
    storage: multer.diskStorage({
      destination,
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedExtensions = /\.(l5x|L5X|csv|CSV)$/i;
      if (allowedExtensions.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new Error("Apenas arquivos .l5x e .csv são permitidos."));
      }
    },
  });

export default configureMulter;
