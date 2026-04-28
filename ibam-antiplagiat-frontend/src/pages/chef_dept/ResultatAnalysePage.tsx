import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { analysesApi } from "@/api/analyses.api";
import { JaugePlagiat } from "@/components/analyses/JaugePlagiat";
import { PassagesSimilaires } from "@/components/analyses/PassagesSimilaires";
import { SourcesTable } from "@/components/analyses/SourcesTable";
import { HistogrammeAnalyse } from "@/components/analyses/HistogrammeAnalyse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ResultatAnalysePage() {
  const { analyseId } = useParams();
  
  const { data: analyse, isLoading } = useQuery({
    queryKey: ["analyse", analyseId],
    queryFn: () => analysesApi.detail(Number(analyseId)).then(res => res.data),
    enabled: !!analyseId,
  });

  const handleDownload = async () => {
    if (!analyseId) return;
    try {
      const response = await analysesApi.downloadPdf(Number(analyseId));
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_analyse_${analyseId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error("Erreur téléchargement", e);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;
  if (!analyse) return <div className="p-8 text-center text-red-500">Analyse introuvable</div>;

  // Mock histogram data for demonstration
  const histoData = [
    { tranche: "0-10%", count: 120 },
    { tranche: "10-20%", count: 45 },
    { tranche: "20-50%", count: 10 },
    { tranche: ">50%", count: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif">Résultats de l'Analyse #{analyse.id}</h1>
          <p className="text-slate-500">Détails des similarités détectées par le moteur NLP.</p>
        </div>
        <Button onClick={handleDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Télécharger PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-6">
          <CardHeader className="text-center pb-2">
            <CardTitle>Taux de Plagiat Global</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center w-full">
            <JaugePlagiat taux={analyse.taux_global || 0} niveau={analyse.niveau_alerte || "VERT"} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Répartition des Similarités</CardTitle>
          </CardHeader>
          <CardContent>
            <HistogrammeAnalyse data={histoData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sources Identifiées</CardTitle>
        </CardHeader>
        <CardContent>
          <SourcesTable sources={analyse.sources || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passages Détaillés</CardTitle>
        </CardHeader>
        <CardContent>
          <PassagesSimilaires passages={analyse.passages || []} />
        </CardContent>
      </Card>
    </div>
  );
}
