import axios from 'axios';

const LLaVA_API_URL = 'http://localhost:11434/api/generate';

const generateLLaVAResponse = async (prompt, imageBase64) => {
  try {
    console.log(imageBase64)
    console.log(prompt)
    const response = await axios.post(LLaVA_API_URL, {
      model: 'llava',
    //   model: 'moondream',
      prompt:prompt,
      images: [imageBase64],
      stream:false
    });
    return response.data;
  } catch (error) {
    console.error('Error generating LLaVA response:', error);
    throw error;
  }
};

export default generateLLaVAResponse;
