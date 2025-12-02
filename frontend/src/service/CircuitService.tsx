import axios from "axios"

const API_BASE_URL = "http://localhost:8080"

export const getCircuitData = async (id: number) => {
  if (id > 0) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Błąd podczas pobierania danych układu scalonego: ", error);
      return null;
    }
  }
};