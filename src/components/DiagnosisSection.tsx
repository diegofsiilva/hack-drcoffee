import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  Camera, 
  Scan, 
  AlertTriangle, 
  CheckCircle, 
  MapPin,
  Clock,
  Leaf,
  Bug,
  Droplets
} from "lucide-react";
import aiDiagnosisImage from "@/assets/ai-diagnosis.jpg";
import { toast } from "sonner";

const DiagnosisSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success("Imagem carregada com sucesso!");
    }
  };

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      toast.success("Diagnóstico concluído!");
    }, 3000);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Diagnóstico Instantâneo por IA
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Envie uma foto da sua plantação e receba um diagnóstico preciso em segundos. 
            Nossa IA identifica mais de 50 tipos de pragas e doenças.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="shadow-card-natural">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Fazer Diagnóstico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo-upload">
                    Foto da Planta ou Folha com Problema
                  </Label>
                  <div className="relative">
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary-hover"
                    />
                  </div>
                </div>

                {/* Camera Options */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    <Camera className="w-4 h-4" />
                    Usar Câmera
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Upload className="w-4 h-4" />
                    Galeria
                  </Button>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Localização (Opcional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="location"
                      placeholder="Ex: Fazenda São José, Minas Gerais"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Analyze Button */}
                <Button 
                  onClick={handleAnalysis}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full h-12"
                  variant={selectedFile ? "hero" : "default"}
                >
                  {isAnalyzing ? (
                    <>
                      <Scan className="w-4 h-4 animate-pulse" />
                      Analisando com IA...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4" />
                      Diagnosticar Agora
                    </>
                  )}
                </Button>

                {selectedFile && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">{selectedFile.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!showResults ? (
              <Card className="shadow-card-natural">
                <CardContent className="p-8 text-center">
                  <img 
                    src={aiDiagnosisImage}
                    alt="Interface de diagnóstico AI"
                    className="w-full max-w-md mx-auto rounded-lg mb-6"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Pronto para Diagnosticar
                  </h3>
                  <p className="text-muted-foreground">
                    Envie uma foto clara da planta ou folha com problema para começar
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card-natural border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Problema Identificado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Diagnosis */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">Ferrugem do Cafeeiro</h4>
                      <Badge variant="destructive">Crítico</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Hemileia vastatrix detectada com 94% de confiança. 
                      Doença fúngica que pode causar perda de até 30% da safra.
                    </p>
                  </div>

                  <Separator />

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Bug className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Doença Fúngica</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Estágio: Inicial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Umidade: Favorável</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Área: Focalizada</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h5 className="font-semibold">Tratamento Recomendado</h5>
                    <div className="space-y-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <div className="font-medium text-sm">1. Aplicação Imediata</div>
                        <div className="text-sm text-muted-foreground">
                          Fungicida cúprico (Oxicloreto de cobre) - 3g/L
                        </div>
                      </div>
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <div className="font-medium text-sm">2. Receita Caseira</div>
                        <div className="text-sm text-muted-foreground">
                          Calda bordalesa 1% - pulverizar nas horas frescas
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="success" className="w-full">
                    <CheckCircle className="w-4 h-4" />
                    Salvar Diagnóstico
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisSection;