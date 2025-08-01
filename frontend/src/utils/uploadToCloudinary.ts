export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset"); // Must match the one in Cloudinary

  const cloudName = "dna6lldor"; // Replace with your Cloudinary cloud name
console.log('yss1')
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  console.log(data.secure_url)
  return data.secure_url;
};