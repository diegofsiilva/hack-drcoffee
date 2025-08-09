import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Wifi, 
  Users, 
  MapPin, 
  History, 
  Shield,
  Smartphone,
  Clock,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Especializada",
    description: "Algoritmo treinado com mais de 50.000 imagens de problemas agrícolas reais",
    badge: "95% Precisão",
    color: "bg-primary"
  },
  {
    icon: Wifi,
    title: "Funciona Offline",
    description: "Edge computing permite diagnósticos mesmo sem conexão com internet",
    badge: "Inovação",
    color: "bg-secondary"
  },
  {
    icon: MapPin,
    title: "Clima Personalizado", 
    description: "Combina diagnóstico com dados climáticos locais para tratamento preciso",
    badge: "Geo-IA",
    color: "bg-accent"
  },
  {
    icon: Users,
    title: "Comunidade Local",
    description: "Conecta com produtores da região que já enfrentaram problemas similares",
    badge: "Rede",
    color: "bg-primary"
  },
  {
    icon: History,
    title: "Histórico Inteligente",
    description: "Aprende padrões sazonais: 'Essa praga sempre aparece em fevereiro aqui'",
    badge: "Preditivo",
    color: "bg-secondary"
  },
  {
    icon: Shield,
    title: "Reduz Defensivos",
    description: "Evita aplicações desnecessárias, promovendo agricultura sustentável",
    badge: "Sustentável",
    color: "bg-accent"
  }
];

const stats = [
  {
    icon: Smartphone,
    value: "5 segundos",
    label: "Tempo de diagnóstico"
  },
  {
    icon: TrendingUp,
    value: "R$ 15.000",
    label: "Economia média por safra"
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Disponibilidade"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-earth">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Tecnologia que Salva Safras
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformamos seu smartphone no agrônomo mais avançado do Brasil. 
            Cada funcionalidade foi pensada para resolver problemas reais do campo.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-card-natural hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gradient-hero rounded-full">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card-natural hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 ${feature.color} rounded-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary">{feature.badge}</Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-4xl mx-auto shadow-glow bg-gradient-hero">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Pronto para Revolucionar sua Agricultura?
              </h3>
              <p className="text-white/90 mb-6 text-lg">
                Junte-se a mais de 3.000 produtores que já salvaram suas safras com AgroSOS
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                  Começar Gratuitamente
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Agendar Demo
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;