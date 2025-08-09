import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Coffee, Sprout } from "lucide-react";
import farmerSuccessImage from "@/assets/farmer-success.jpg";

const testimonials = [
  {
    name: "João Carlos Silva",
    location: "Fazenda São José, Minas Gerais",
    crop: "Café Arábica",
    testimonial: "Identifiquei ferrugem antes mesmo de perceber os sintomas. Salvei R$ 18.000 em uma única safra!",
    rating: 5,
    savings: "R$ 18.000",
    area: "15 hectares"
  },
  {
    name: "Maria Santos",
    location: "Sítio Esperança, São Paulo", 
    crop: "Café Robusta",
    testimonial: "O app me ensinou a diferença entre ferrugem e cercosporiose. Agora trato cada problema na hora certa.",
    rating: 5,
    savings: "R$ 12.500",
    area: "8 hectares"
  },
  {
    name: "Carlos Eduardo",
    location: "Fazenda Progresso, Bahia",
    crop: "Café e Milho",
    testimonial: "A receita caseira da calda bordalesa funcionou perfeitamente. Economizei em defensivos caros.",
    rating: 5,
    savings: "R$ 8.000",
    area: "22 hectares"
  }
];

const impactStats = [
  {
    icon: Coffee,
    value: "3.200+",
    label: "Produtores Atendidos",
    description: "Em todo o Brasil"
  },
  {
    icon: Sprout,
    value: "45.000",
    label: "Hectares Protegidos",
    description: "Área total monitorada"
  },
  {
    icon: Star,
    value: "R$ 2.3M",
    label: "Em Safras Salvas",
    description: "Valor econômico preservado"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Histórias Reais de Sucesso
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Produtores de todo o Brasil já salvaram milhões em safras com o AgroSOS. 
            Veja como a tecnologia está transformando a vida no campo.
          </p>
        </div>

        {/* Impact Numbers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <Card key={index} className="text-center shadow-card-natural hover:shadow-glow transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-success rounded-full">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hero Testimonial */}
        <Card className="mb-12 shadow-glow overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 bg-gradient-hero">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-white text-white" />
                ))}
              </div>
              <blockquote className="text-xl text-white mb-6 leading-relaxed">
                "O AgroSOS salvou minha safra inteira. Detectou a ferrugem três semanas antes de eu notar qualquer sintoma. 
                É como ter um agrônomo no bolso 24 horas por dia."
              </blockquote>
              <div className="space-y-2 text-white/90">
                <div className="font-semibold text-lg">João Carlos Silva</div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  Fazenda São José, Minas Gerais
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Café Arábica - 15 hectares
                  </Badge>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    Economia: R$ 18.000
                  </Badge>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={farmerSuccessImage}
                alt="João Carlos Silva na sua fazenda"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/20"></div>
            </div>
          </div>
        </Card>

        {/* Other Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.slice(1).map((testimonial, index) => (
            <Card key={index} className="shadow-card-natural hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.testimonial}"
                </blockquote>
                <div className="space-y-2">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {testimonial.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {testimonial.crop} - {testimonial.area}
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                      Economizou: {testimonial.savings}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto shadow-card-natural">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Sua História de Sucesso Começa Agora
              </h3>
              <p className="text-muted-foreground mb-6">
                Junte-se aos milhares de produtores que já transformaram sua agricultura com o AgroSOS
              </p>
              <button className="bg-gradient-hero text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform shadow-glow">
                Começar Diagnóstico Gratuito
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
