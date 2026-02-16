import cloudinary from "../config/cloud.js";

export const generateVideoThumbnail = (publicId, second = 2) => {
  try {
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        {
          start_offset: second,
        },
      ],
    });
    return thumbnailUrl;
  } catch (error) {
    throw error;
  }
};
