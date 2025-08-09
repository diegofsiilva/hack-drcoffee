import React, { useState, useEffect } from 'react';

import { db } from '../App';
import AIService from '../services/AIService';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

interface DiagnosisResult {
  id: string;
  imageUrl: string;
  analysis: {
    disease: string;
    confidence: number;
    severity: string;
    treatment: string;
    homeRecipe: string;
    cost: number;
    timeToTreat: string;
  };
  timestamp: any;
  location?: {
    lat: number;
    lng: number;
  };
}

const DiagnosisScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [nearbyOccurrences, setNearbyOccurrences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('diagnosis');

  useEffect(() => {
    const loadDiagnosis = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, 'diagnoses', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as DiagnosisResult;
          setDiagnosis(data);
          
          // Buscar ocorrências próximas se houver localização
          if (data.location) {
            const nearby = await AIService.getNearbyOccurrences(
              data.location,
              data.analysis.disease
            );
            setNearbyOccurrences(nearby);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar diagnóstico:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDiagnosis();
  }, [id]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const shareResults = async () => {
    if (navigator.share && diagnosis) {
      try {
        await navigator.share({
          title: 'Diagnóstico AgroSOS',
          text: `Diagnóstico: ${diagnosis.analysis.disease} (${diagnosis.analysis.confidence}% de confiança)`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Diagnóstico não encontrado
          </h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Voltar
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Diagnóstico</h1>
          <button 
            onClick={shareResults}
            className="text-green-600 hover:text-green-700"
          >
            Compartilhar
          </button>
        </div>
      </div>

      {/* Imagem da Planta */}
      <div className="bg-white">
        <img 
          src={diagnosis.imageUrl} 
          alt="Planta analisada"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'diagnosis' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500'
            }`}
          >
            Diagnóstico
          </button>
          <button
            onClick={() => setActiveTab('treatment')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'treatment' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500'
            }`}
          >
            Tratamento
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'community' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500'
            }`}
          >
            Comunidade
          </button>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="p-4 space-y-4">
        {activeTab === 'diagnosis' && (
          <>
            {/* Resultado Principal */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {diagnosis.analysis.disease}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(diagnosis.analysis.severity)}`}>
                  {diagnosis.analysis.severity}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600">Confiança:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {Math.round(diagnosis.analysis.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${diagnosis.analysis.confidence * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tempo para tratar:</span>
                  <p className="font-medium">{diagnosis.analysis.timeToTreat}</p>
                </div>
                <div>
                  <span className="text-gray-600">Custo estimado:</span>
                  <p className="font-medium">R$ {diagnosis.analysis.cost}</p>
                </div>
              </div>
            </div>

            {/* Alertas de Região */}
            {nearbyOccurrences.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-orange-600">⚠️</span>
                  <h3 className="ml-2 font-semibold text-orange-800">
                    Alerta Regional
                  </h3>
                </div>
                <p className="text-orange-700 text-sm">
                  {nearbyOccurrences.length} caso(s) similar(es) encontrado(s) 
                  em um raio de 10km da sua localização.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'treatment' && (
          <>
            {/* Tratamento Profissional */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                💊 Tratamento Recomendado
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {diagnosis.analysis.treatment}
              </p>
            </div>

            {/* Receita Caseira */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">
                🌿 Receita Caseira
              </h3>
              <p className="text-green-700 leading-relaxed">
                {diagnosis.analysis.homeRecipe}
              </p>
            </div>

            {/* Dicas Preventivas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">
                🛡️ Prevenção
              </h3>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Mantenha boa ventilação entre as plantas</li>
                <li>• Evite irrigação nas folhas durante a noite</li>
                <li>• Remova folhas infectadas imediatamente</li>
                <li>• Faça rotação de culturas quando possível</li>
              </ul>
            </div>
          </>
        )}

        {activeTab === 'community' && (
          <>
            {nearbyOccurrences.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">
                  Casos Próximos ({nearbyOccurrences.length})
                </h3>
                {nearbyOccurrences.map((occurrence, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {occurrence.distance?.toFixed(1)} km de distância
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(occurrence.timestamp?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Mesmo diagnóstico: {occurrence.analysis?.disease}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-gray-400 mb-2">🌱</div>
                <p className="text-gray-600">
                  Nenhum caso similar encontrado na sua região
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Isso é uma boa notícia!
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/camera')}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium"
          >
            Nova Análise
          </button>
          <button 
            onClick={() => navigate('/community')}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium"
          >
            Ver Comunidade
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisScreen;