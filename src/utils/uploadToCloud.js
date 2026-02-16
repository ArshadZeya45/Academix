import cloudinary from "../config/cloud.js";

export const uploadToCloud = async (
  fileBuffer,
  folder,
  resourceType = "image",
) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(fileBuffer);
  });
  return result;
};
