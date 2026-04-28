import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { rapportsApi } from "@/api/rapports.api";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SignatureModalProps {
  rapportId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SignatureModal({ rapportId, isOpen, onClose, onSuccess }: SignatureModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSigner = async () => {
    if (!password) {
      toast.error("Veuillez saisir votre mot de passe");
      return;
    }
    
    setLoading(true);
    try {
      await rapportsApi.signer(rapportId, password);
      toast.success("Rapport signé avec succès !");
      onSuccess();
    } catch (e: any) {
      const msg = e.response?.data?.detail || "Erreur lors de la signature";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-serif text-primary">Signature Numérique</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Apposez votre signature cryptographique sur ce rapport.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-accent/10 border border-accent/30 border-l-4 border-l-accent p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-accent-dark">Attention — Action irrévocable</p>
                <p className="text-sm text-accent-dark/80 mt-1">Vous allez apposer votre signature électronique officielle (RSA-2048) sur ce document.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Mot de passe de confirmation</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Votre mot de passe IBAM..."
              className="border-slate-300 focus:border-primary focus:ring-primary/20 transition-all"
            />
            <p className="text-xs text-muted-foreground">En cas d'échec répété, votre compte sera temporairement bloqué.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className="hover:bg-slate-50 hover:border-primary hover:text-primary transition-all"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSigner} 
              disabled={loading} 
              className="bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-primary/30 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération...
                </span>
              ) : "Signer définitivement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
