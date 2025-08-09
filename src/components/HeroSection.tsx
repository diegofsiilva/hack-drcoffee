import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Leaf, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-earth overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJtLTUgMzUgMTAtMTBtLTUgNSA0MC00MG0wIDQwIDEwLTEwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary-glow/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Leaf className="w-4 h-4" />
                Diagnóstico Instantâneo por IA
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  AgroSOS
                </span>
                <br />
                <span className="text-foreground">
                  Dr. Google do Café
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Transforme seu smartphone no melhor agrônomo do Brasil. 
                Em 5 segundos, saiba se vai perder a safra ou salvar <strong className="text-accent font-semibold">R$ 15.000</strong>.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="hero" className="text-lg px-8 py-6">
                <Camera className="w-5 h-5" />
                Diagnosticar Agora
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Ver Demonstração
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3.000+</div>
                <div className="text-sm text-muted-foreground">Produtores Salvos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Precisão IA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">R$ 2.3M</div>
                <div className="text-sm text-muted-foreground">Safras Salvas</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-card-natural">
              <img 
                src={heroImage} 
                alt="Agricultor usando AgroSOS para diagnosticar plantas de café"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <Card className="absolute -left-4 top-1/4 p-4 shadow-glow bg-card/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-success rounded-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Diagnóstico Completo</div>
                  <div className="text-xs text-muted-foreground">Ferrugem identificada</div>
                </div>
              </div>
            </Card>

            <Card className="absolute -right-4 bottom-1/4 p-4 shadow-glow bg-card/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  <Users className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Comunidade Ativa</div>
                  <div className="text-xs text-muted-foreground">127 casos similares</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;