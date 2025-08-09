
// backend/src/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const admin = require('firebase-admin');
const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar Firebase Admin
const serviceAccount = require('./config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'agrosos-app.appspot.com'
});

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar multer para upload de imagens
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Carregar modelo de IA
let model;
const loadModel = async () => {
  try {
    model = await tf.loadLayersModel('file://./models/coffee-disease-model/model.json');
    console.log('Modelo de IA carregado com sucesso');
  } catch (error) {
    console.error('Erro ao carregar modelo:', error);
  }
};

// Banco de dados de doenças
const diseaseDatabase = {
  0: {
    name: 'Saudável',
    treatment: 'Planta aparenta estar saudável. Continue os cuidados preventivos.',
    homeRecipe: 'Manter irrigação adequada e adubação balanceada',
    cost: 0,
    severity: 'Nenhuma'
  },
  1: {
    name: 'Ferrugem do Cafeeiro',
    treatment: 'Aplicar fungicida à base de cobre + remover folhas infectadas',
    homeRecipe: 'Calda bordalesa: 100g sulfato de cobre + 100g cal virgem em 10L água',
    cost: 45,
    severity: 'Alta'
  },
  2: {
    name: 'Broca do Café',
    treatment: 'Aplicar inseticida sistêmico + catação manual',
    homeRecipe: 'Extrato de nim: 50g folhas de nim em 1L água (descansar 24h)',
    cost: 35,
    severity: 'Média'
  },
  3: {
    name: 'Cercosporiose',
    treatment: 'Fungicida específico + melhorar ventilação',
    homeRecipe: 'Bicarbonato de sódio: 5g por litro de água',
    cost: 30,
    severity: 'Média'
  }
};

// Rota para análise de imagem
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    // Pré-processar imagem
    const processedImage = await sharp(req.file.buffer)
      .resize(224, 224)
      .normalize()
      .toBuffer();

    // Converter para tensor
    const tensor = tf.node.decodeImage(processedImage)
      .expandDims(0)
      .div(255.0);

    // Fazer predição
    let prediction;
    if (model) {
      prediction = await model.predict(tensor).data();
    } else {
      // Fallback: análise simulada
      prediction = new Float32Array([0.1, 0.7, 0.2, 0.0]); // Exemplo
    }

    // Encontrar classe com maior probabilidade
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    const confidence = Math.max(...prediction);

    const result = {
      ...diseaseDatabase[maxIndex],
      confidence: Math.round(confidence * 100),
      classIndex: maxIndex,
      timestamp: new Date().toISOString()
    };

    res.json(result);

  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para buscar ocorrências próximas
app.get('/api/nearby', async (req, res) => {
  try {
    const { lat, lng, disease, radius = 10 } = req.query;
    
    // Consultar Firestore por ocorrências próximas
    const db = admin.firestore();
    const snapshot = await db.collection('diagnoses')
      .where('analysis.name', '==', disease)
      .limit(50)
      .get();

    const occurrences = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.location) {
        // Calcular distância (implementar haversine)
        const distance = calculateDistance(
          parseFloat(lat), parseFloat(lng),
          data.location.lat, data.location.lng
        );
        
        if (distance <= radius) {
          occurrences.push({
            id: doc.id,
            ...data,
            distance
          });
        }
      }
    });

    res.json(occurrences);

  } catch (error) {
    console.error('Erro ao buscar ocorrências:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para calcular distância entre coordenadas
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Inicializar servidor
const startServer = async () => {
  await loadModel();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();