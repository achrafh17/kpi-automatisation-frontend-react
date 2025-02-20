import axios from 'axios';

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Uploading file...');
    const response = await axios.post('https://kpi-backend-api.onrender.com', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('Upload success:', response);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error.response || error);
    throw error;
  }
};
