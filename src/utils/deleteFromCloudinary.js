import cloudinary from "../config/cloud.js";

export const deleteFromCloudinary = async (publicId, resourceType) => {
  try {
    if (!publicId) {
      throw new Error("Public Id is required");
    }
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    throw error;
  }
};
