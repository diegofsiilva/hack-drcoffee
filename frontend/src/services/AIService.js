
// frontend/src/services/AIService.js
import axios from 'axios';

class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.apiKey = process.env.REACT_APP_AI_API_KEY;
  }

  // Análise de imagem usando TensorFlow.js local
  async analyzeImageLocal(imageFile) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        canvas.width = 224;
        canvas.height = 224;
        ctx.drawImage(img, 0, 0, 224, 224);
        
        // Simular análise de IA (substitua por modelo real)
        const mockResults = [
          {
            disease: 'Ferrugem do Cafeeiro',
            confidence: 0.94,
            severity: 'Alta',
            treatment: 'Aplicar fungicida à base de cobre',
            homeRecipe: 'Calda bordalesa: 100g sulfato + 100g cal em 10L água',
            cost: 45,
            timeToTreat: '2-3 dias'
          },
          {
            disease: 'Broca do Café',
            confidence: 0.89,
            severity: 'Média', 
            treatment: 'Inseticida sistêmico + catação manual',
            homeRecipe: 'Extrato de nim: 50g folhas em 1L água',
            cost: 35,
            timeToTreat: '1-2 dias'
          }
        ];
        
        // Simular delay de processamento
        setTimeout(() => {
          const result = mockResults[Math.floor(Math.random() * mockResults.length)];
          resolve(result);
        }, 3000);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // Análise usando API externa (para produção)
  async analyzeImageAPI(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await axios.post(`${this.baseURL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro na análise:', error);
      throw error;
    }
  }

  // Buscar casos similares na região
  async getNearbyOccurrences(location, disease) {
    try {
      const response = await axios.get(`${this.baseURL}/api/nearby`, {
        params: {
          lat: location.lat,
          lng: location.lng,
          disease: disease,
          radius: 10 // km
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
      return [];
    }
  }
}

export default new AIService();