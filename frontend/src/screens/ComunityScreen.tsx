import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../App';

interface CommunityPost {
  id: string;
  imageUrl: string;
  analysis: {
    disease: string;
    confidence: number;
    severity: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  timestamp: any;
  distance?: number;
}

interface CommunityScreenProps {
  location?: {
    lat: number;
    lng: number;
  } | null;
}

const CommunityScreen: React.FC<CommunityScreenProps> = ({ location }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    totalCases: 0,
    healthyCases: 0,
    diseasedCases: 0,
    mostCommonDisease: ''
  });

  useEffect(() => {
    loadCommunityData();
  }, []);

  useEffect(() => {
    applyFilter(activeFilter);
  }, [posts, activeFilter]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const loadCommunityData = async () => {
    try {
      const q = query(
        collection(db, 'diagnoses'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const loadedPosts: CommunityPost[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let distance = 0;

        // Calcular distância se ambas as localizações existirem
        if (location && data.location) {
          distance = calculateDistance(
            location.lat, location.lng,
            data.location.lat, data.location.lng
          );
        }

        loadedPosts.push({
          id: doc.id,
          ...data,
          distance
        } as CommunityPost);
      });

      setPosts(loadedPosts);
      calculateStats(loadedPosts);
    } catch (error) {
      console.error('Erro ao carregar dados da comunidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (postsData: CommunityPost[]) => {
    const total = postsData.length;
    const healthy = postsData.filter(p => p.analysis.disease.toLowerCase().includes('saudável')).length;
    const diseased = total - healthy;

    // Encontrar doença mais comum
    const diseaseCount: { [key: string]: number } = {};
    postsData.forEach(post => {
      if (!post.analysis.disease.toLowerCase().includes('saudável')) {
        diseaseCount[post.analysis.disease] = (diseaseCount[post.analysis.disease] || 0) + 1;
      }
    });

    const mostCommon = Object.keys(diseaseCount).reduce((a, b) => 
      diseaseCount[a] > diseaseCount[b] ? a : b, ''
    );

    setStats({
      totalCases: total,
      healthyCases: healthy,
      diseasedCases: diseased,
      mostCommonDisease: mostCommon || 'Nenhuma'
    });
  };

  const applyFilter = (filter: string) => {
    let filtered = [...posts];

    switch (filter) {
      case 'nearby':
        filtered = posts.filter(post => post.distance && post.distance <= 20).sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'diseases':
        filtered = posts.filter(post => !post.analysis.disease.toLowerCase().includes('saudável'));
        break;
      case 'healthy':
        filtered = posts.filter(post => post.analysis.disease.toLowerCase().includes('saudável'));
        break;
      default:
        // 'all' - não filtrar
        break;
    }

    setFilteredPosts(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'alta': return 'bg-red-500';
      case 'média': return 'bg-yellow-500';
      case 'baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Data desconhecida';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando comunidade...</p>
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
          <h1 className="text-lg font-semibold text-gray-800">Comunidade AgroSOS</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="bg-white border-b p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalCases}</div>
            <div className="text-xs text-gray-600">Total de Casos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.healthyCases}</div>
            <div className="text-xs text-gray-600">Plantas Saudáveis</div>
          </div>
        </div>

        {stats.mostCommonDisease && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center">
              <span className="text-orange-500 mr-2">⚠️</span>
              <div>
                <div className="text-sm font-medium text-orange-800">
                  Doença Mais Comum da Região
                </div>
                <div className="text-xs text-orange-600">{stats.mostCommonDisease}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto p-4 space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeFilter === 'all' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos ({posts.length})
          </button>
          
          {location && (
            <button
              onClick={() => setActiveFilter('nearby')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeFilter === 'nearby' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📍 Próximos
            </button>
          )}
          
          <button
            onClick={() => setActiveFilter('diseases')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeFilter === 'diseases' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🦠 Doenças ({stats.diseasedCases})
          </button>
          
          <button
            onClick={() => setActiveFilter('healthy')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeFilter === 'healthy' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🌱 Saudáveis ({stats.healthyCases})
          </button>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="p-4 space-y-4 pb-20">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/diagnosis/${post.id}`)}
            >
              <div className="flex">
                {/* Imagem */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img 
                    src={post.imageUrl} 
                    alt="Planta"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Conteúdo */}
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">
                        {post.analysis.disease}
                      </h3>
                      <div className="flex items-center mt-1 space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(post.analysis.severity)}`}></div>
                        <span className="text-xs text-gray-600">
                          {Math.round(post.analysis.confidence * 100)}% confiança
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {formatDate(post.timestamp)}
                      </div>
                      {post.distance !== undefined && post.distance > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          {post.distance.toFixed(1)} km
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🌾</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Nenhum caso encontrado
            </h3>
            <p className="text-gray-500 text-sm">
              Tente ajustar os filtros ou seja o primeiro da sua região!
            </p>
          </div>
        )}
      </div>

      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => navigate('/camera')}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        >
          📷
        </button>
      </div>
    </div>
  );
};

export default CommunityScreen;