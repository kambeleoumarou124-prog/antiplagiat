import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { rapportsApi } from "@/api/rapports.api";
import { themesApi } from "@/api/themes.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const rapportSchema = z.object({
  theme_id: z.string().min(1, "Veuillez sélectionner un thème validé"),
  titre: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  fichier: z.any()
    .refine((file) => file?.length === 1, "Le rapport (PDF/DOCX) est obligatoire.")
    .refine((file) => file[0]?.size <= 10 * 1024 * 1024, "La taille max est de 10MB."),
});

type FormValues = z.infer<typeof rapportSchema>;

export default function DeposerRapportPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch only accepted themes for this student (mocked for now)
  const { data: themes } = useQuery({
    queryKey: ["my_accepted_themes"],
    queryFn: async () => {
      const res = await themesApi.lister();
      return res.data.filter(t => t.statut === "ACCEPTE");
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: zodResolver(rapportSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return rapportsApi.deposer({
        session: 1,
        theme: parseInt(data.theme_id),
        titre: data.titre,
        fichier: data.fichier[0]
      });
    },
    onSuccess: () => {
      toast.success("Rapport déposé avec succès ! L'analyse anti-plagiat a démarré.");
      navigate("/etudiant/rapports");
    },
    onError: () => {
      toast.error("Erreur lors du dépôt du rapport.");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-primary tracking-tight">Déposer mon Rapport</h1>
        <p className="text-muted-foreground">Soumettez votre rapport de stage pour analyse anti-plagiat.</p>
      </div>

      <Card className="shadow-md border-border/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-primary">Nouveau Dépôt</CardTitle>
          <CardDescription>Formats acceptés : PDF, DOCX (Max 10 Mo).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Thème de stage validé</Label>
              <Select onValueChange={(val) => setValue("theme_id", val)}>
                <SelectTrigger className="border-slate-300 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Sélectionnez un thème" />
                </SelectTrigger>
                <SelectContent>
                  {themes?.map(t => (
                    <SelectItem key={t.id} value={t.id.toString()}>{t.intitule}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.theme_id && <p className="text-sm text-red-600 flex items-center gap-1">{errors.theme_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Titre du Rapport</Label>
              <Input {...register("titre")} placeholder="Ex: Rapport de Fin de Cycle L3" className="border-slate-300 focus:border-primary focus:ring-primary/20" />
              {errors.titre && <p className="text-sm text-red-600 flex items-center gap-1">{errors.titre.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Fichier (PDF ou DOCX)</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <input
                  type="file"
                  id="fichier"
                  className="hidden"
                  accept=".pdf,.docx"
                  {...register("fichier", {
                    onChange: (e) => setSelectedFile(e.target.files[0]),
                  })}
                />
                <label htmlFor="fichier" className="cursor-pointer flex flex-col items-center">
                  {selectedFile ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">{selectedFile.name}</span>
                      <span className="text-sm text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} Mo</span>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <UploadCloud className="w-8 h-8 text-slate-400" />
                      </div>
                      <span className="font-semibold text-foreground">Cliquez pour parcourir</span>
                      <span className="text-sm text-muted-foreground mt-1">ou glissez-déposez votre fichier ici</span>
                    </>
                  )}
                </label>
              </div>
              {errors.fichier && <p className="text-sm text-red-600 flex items-center gap-1">{errors.fichier?.message as string}</p>}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-primary/30 transition-all duration-200 py-6 rounded-xl font-medium" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Dépôt en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Soumettre pour Analyse
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
