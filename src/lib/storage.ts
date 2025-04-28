export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

export const saveImageToStorage = (image: GeneratedImage) => {
  // Get existing images
  const savedImages = localStorage.getItem("generatedImages");
  const images: GeneratedImage[] = savedImages ? JSON.parse(savedImages) : [];

  // Add new image
  images.push(image);

  // Save back to localStorage
  localStorage.setItem("generatedImages", JSON.stringify(images));
};

export const getImagesFromStorage = (): GeneratedImage[] => {
  const savedImages = localStorage.getItem("generatedImages");
  return savedImages ? JSON.parse(savedImages) : [];
};
