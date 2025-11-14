import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadToCloudinary = (fileBuffer, folderName, mimeType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName || 'resumes',
        access_mode: 'public',
      },
      (error, result) => {
        if (error) return reject(error);
        let fileUrl = result.secure_url;
        if (fileUrl.includes('/upload/')) {
          fileUrl = fileUrl.replace('/upload/', '/upload/fl_attachment:false/');
        }
        if (!fileUrl.endsWith('.pdf')) fileUrl += '.pdf';
        resolve(fileUrl);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
