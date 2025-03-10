import axios from "axios";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log("Uploading file...");
    const response = await axios.post(
      "https://kpi-automatisation-flask-automatisation-kpi-calculating.up.railway.app//upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'upload du fichier:",
      error.response || error
    );
    throw error;
  }
};
