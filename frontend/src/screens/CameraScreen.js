
// frontend/src/screens/CameraScreen.js
import React, { useState, useRef } from 'react';
import { Camera } from 'react-camera-pro';
import { useNavigate } from 'react-router-dom';
import { storage, db } from '../App';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import AIService from '../services/AIService';

const CameraScreen = () => {
  const camera = useRef(null);
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const capturePhoto = async () => {
    if (!camera.current) return;

    try {
      const imageSrc = camera.current.takePhoto();
      
      // Converter para blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      
      setIsAnalyzing(true);
      
      // Upload para Firebase Storage
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
      
      // Análise com IA
      const analysis = await AIService.analyzeImageLocal(blob);
      
      // Salvar resultado no Firestore
      const docRef = await addDoc(collection(db, 'diagnoses'), {
        imageUrl,
        analysis,
        timestamp: new Date(),
        location: null // Adicionar geolocalização aqui
      });
      
      // Redirecionar para tela de resultados
      navigate(`/diagnosis/${docRef.id}`);
      
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Analisando sua planta...</h2>
          <p className="text-gray-600 mt-2">Nossa IA está trabalhando para você</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <Camera 
        ref={camera}
        aspectRatio={16/9}
        facingMode="environment"
        errorMessages={{
          noCameraAccessible: 'Nenhuma câmera acessível',
          permissionDenied: 'Permissão de câmera negada',
          switchCamera: 'Não é possível trocar de câmera',
          canvas: 'Canvas não suportado'
        }}
      />
      
      {/* Overlay com instruções */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
        <h2 className="text-lg font-semibold">Posicione a folha doente no centro</h2>
        <p className="text-sm">Mantenha boa iluminação e foque na área afetada</p>
      </div>
      
      {/* Botões de controle */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          
          <button 
            onClick={capturePhoto}
            className="bg-green-600 text-white p-4 rounded-full"
          >
            📷
          </button>
          
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg">
            Galeria
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraScreen;