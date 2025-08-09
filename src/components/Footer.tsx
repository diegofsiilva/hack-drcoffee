import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Leaf, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  Linkedin,
  Heart
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-hero rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl">AgroSOS</div>
                <div className="text-sm text-background/70">Dr. Google do Café</div>
              </div>
            </div>
            <p className="text-background/80 leading-relaxed">
              Transformando smartphones em ferramentas de diagnóstico agrícola. 
              Salvando safras com tecnologia de ponta.
            </p>
            <div className="flex gap-3">
              <Button size="sm" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                <Youtube className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Produto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Produto</h3>
            <div className="space-y-2">
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Como Funciona
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Diagnóstico IA
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Comunidade
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Aplicativo Mobile
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                API para Desenvolvedores
              </a>
            </div>
          </div>

          {/* Suporte */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Suporte</h3>
            <div className="space-y-2">
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Central de Ajuda
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Guias de Uso
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                FAQ
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Contato Técnico
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Parceiros
              </a>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-background/60" />
                <span className="text-background/80">contato@agrosos.com.br</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-background/60" />
                <span className="text-background/80">(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-background/60" />
                <span className="text-background/80">São Paulo, Brasil</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-background/80">
                Receba dicas exclusivas de agricultura
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Seu email"
                  className="flex-1 px-3 py-2 bg-background/10 border border-background/30 rounded text-background placeholder:text-background/50"
                />
                <Button variant="outline" className="border-background/30 text-background hover:bg-background/10">
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-background/60">
            <span>© 2024 AgroSOS. Todos os direitos reservados.</span>
            <a href="#" className="hover:text-background transition-colors">Privacidade</a>
            <a href="#" className="hover:text-background transition-colors">Termos</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-background/80">
            <span>Feito com</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>para o agricultor brasileiro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;