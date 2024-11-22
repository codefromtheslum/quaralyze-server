import streamifier from "streamifier";
import cloudinary from "./cloudinary";

export const streamUpload: any = (req: any): Promise<any | null> => {
  return new Promise((resolve, reject) => {
    if (!req?.file?.buffer) {
      // Resolve with null if no file buffer exists
      return resolve(null);
    }

    const stream = cloudinary.uploader.upload_stream((error: any, result: any) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};
