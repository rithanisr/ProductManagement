const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    bufferToStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = uploadImage;
