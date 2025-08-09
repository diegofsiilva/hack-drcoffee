import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Menu, Camera, Users, BarChart3 } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    {
      name: "Diagnóstico",
      href: "#diagnosis",
      icon: Camera
    },
    {
      name: "Comunidade",
      href: "#community", 
      icon: Users
    },
    {
      name: "Resultados",
      href: "#results",
      icon: BarChart3
    }
  ];

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50 shadow-natural">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">AgroSOS</div>
              <div className="text-xs text-muted-foreground -mt-1">Dr. Google do Café</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
            <Button variant="hero" size="sm">
              <Camera className="w-4 h-4" />
              Diagnosticar
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-gradient-hero rounded-lg">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg">AgroSOS</div>
                  <div className="text-xs text-muted-foreground">Dr. Google do Café</div>
                </div>
              </div>

              <nav className="space-y-4 mb-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}
              </nav>

              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Entrar
                </Button>
                <Button variant="hero" className="w-full">
                  <Camera className="w-4 h-4" />
                  Diagnosticar Agora
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;