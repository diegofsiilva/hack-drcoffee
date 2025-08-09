import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../App';

interface QuickStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface RecentDiagnosis {
  id: string;
  analysis: {
    disease: string;
    confidence: number;
  };
  timestamp: any;
  imageUrl: string;
}

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [recentDiagnoses, setRecentDiagnoses] = useState<RecentDiagnosis[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([
    { label: 'Análises Hoje', value: '0', icon: '📊', color: 'bg-blue-500' },
    { label: 'Plantas Saudáveis', value: '0%', icon: '🌱', color: 'bg-green-500' },
    { label: 'Casos na Região', value: '0', icon: '📍', color: 'bg-orange-500' },
    { label: 'Precisão IA', value: '94%', icon: '🎯', color: 'bg-purple-500' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar diagnósticos recentes
      const q = query(
        collection(db, 'diagnoses'),
        orderBy('timestamp', 'desc'),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      const recent: RecentDiagnosis[] = [];

      querySnapshot.forEach((doc) => {
        recent.push({
          id: doc.id,
          ...doc.data()
        } as RecentDiagnosis);
      });

      setRecentDiagnoses(recent);

      // Atualizar estatísticas baseadas nos dados reais
      updateStats(recent);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (diagnoses: RecentDiagnosis[]) => {
    // Análises de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = diagnoses.filter(d => {
      const diagnosisDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
      return diagnosisDate >= today;
    }).length;

    // Plantas saudáveis
    const healthyCount = diagnoses.filter(d => 
      d.analysis.disease.toLowerCase().includes('saudável')
    ).length;
    const healthyPercentage = diagnoses.length > 0 ? Math.round((healthyCount / diagnoses.length) * 100) : 0;

    setQuickStats([
      { label: 'Análises Hoje', value: todayCount.toString(), icon: '📊', color: 'bg-blue-500' },
      { label: 'Plantas Saudáveis', value: `${healthyPercentage}%`, icon: '🌱', color: 'bg-green-500' },
      { label: 'Casos na Região', value: diagnoses.length.toString(), icon: '📍', color: 'bg-orange-500' },
      { label: 'Precisão IA', value: '94%', icon: '🎯', color: 'bg-purple-500' }
    ]);
  };

  const handleStartAnalysis = () => {
    // Verificar se o navegador suporta câmera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Seu navegador não suporta acesso à câmera. Tente usar um navegador mais recente.');
      return;
    }

    navigate('/camera');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AgroSOS</h1>
              <p className="text-green-100 text-sm mt-1">
                Diagnóstico inteligente para suas plantas
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100">São Paulo, BR</div>
              <div className="text-xs text-green-200">
                {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center">
                <div className={`${stat.color} text-white p-2 rounded-lg mr-3`}>
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Principal */}
        <div className="mb-6">
          <button
            onClick={handleStartAnalysis}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            📷 Analisar Planta
          </button>
          <p className="text-center text-gray-500 text-sm mt-2">
            Tire uma foto e receba o diagnóstico em segundos
          </p>
        </div>

        {/* Menu de Navegação */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate('/community')}
            className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">👥</span>
              <div>
                <div className="font-medium text-gray-800">Comunidade</div>
                <div className="text-sm text-gray-600">Ver casos da região</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/camera')}
            className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">📚</span>
              <div>
                <div className="font-medium text-gray-800">Biblioteca</div>
                <div className="text-sm text-gray-600">Guias e dicas</div>
              </div>
            </div>
          </button>
        </div>

        {/* Diagnósticos Recentes */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">Diagnósticos Recentes</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : recentDiagnoses.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentDiagnoses.map((diagnosis) => (
                <div 
                  key={diagnosis.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/diagnosis/${diagnosis.id}`)}
                >
                  <div className="flex items-center">
                    <img 
                      src={diagnosis.imageUrl} 
                      alt="Diagnóstico"
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">
                        {diagnosis.analysis.disease}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {Math.round(diagnosis.analysis.confidence * 100)}% confiança • {' '}
                        {formatDate(diagnosis.timestamp)}
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-gray-400 text-3xl mb-2">🌱</div>
              <p className="text-gray-600 text-sm">
                Nenhum diagnóstico ainda
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Comece analisando sua primeira planta!
              </p>
            </div>
          )}
        </div>

        {/* Dicas do Dia */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💡</span>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Dica do Dia</h3>
              <p className="text-sm text-gray-700">
                {getTipOfTheDay()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function formatDate(timestamp: any): string {
    if (!timestamp) return 'Data desconhecida';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  function getTipOfTheDay(): string {
    const tips = [
      "Tire fotos com boa iluminação natural para melhor precisão na análise.",
      "Remova folhas infectadas imediatamente para evitar propagação de doenças.",
      "A irrigação pela manhã ajuda a prevenir doenças fúngicas.",
      "Mantenha distância adequada entre plantas para melhor ventilação.",
      "Monitore suas plantas regularmente - prevenção é sempre melhor que tratamento.",
      "Use o modo macro da câmera para capturar detalhes das folhas doentes.",
      "Compartilhe casos na comunidade para ajudar outros produtores da região."
    ];
    
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return tips[dayOfYear % tips.length];
  }
};

export default Index;