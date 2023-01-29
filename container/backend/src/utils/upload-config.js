import path from "path";
import express from "express";
import multer from "multer";

function checkFileTypeOfImage(file, cb) {
  const fileTypes = /jpg|jpeg|png/;
  const extName = fileTypes.test(path.extname(file.originalname));
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb("Images only");
  }
}

export const storage = multer.diskStorage({
  destination(_req, file, cb) {
    cb(null, "uploads/");
  },
  filename(_req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
export const upload = multer({
  storage: storage,
  fileFilter: function (_req, file, cb) {
    checkFileTypeOfImage(file, cb);
  },
});
