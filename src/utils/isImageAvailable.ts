export const isImageAvailable = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, {
      method: "HEAD",
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}