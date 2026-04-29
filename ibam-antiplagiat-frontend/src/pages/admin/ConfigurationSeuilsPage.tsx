import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function ConfigurationSeuilsPage() {
  const [seuilVert, setSeuilVert] = useState(15);
  const [seuilOrange, setSeuilOrange] = useState(30);
  const [seuilRouge, setSeuilRouge] = useState(50);

  const handleSeuilVertChange = (value: number) => {
    if (value < seuilOrange) {
      setSeuilVert(value);
    }
  };

  const handleSeuilOrangeChange = (value: number) => {
    if (value > seuilVert && value < seuilRouge) {
      setSeuilOrange(value);
    }
  };

  const handleSeuilRougeChange = (value: number) => {
    if (value > seuilOrange) {
      setSeuilRouge(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg text-[#1E293B]">Configuration des seuils de plagiat</h3>
        </div>

        {/* Seuil Vert */}
        <div className="py-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Seuil acceptable (vert)</span>
            <span className="font-semibold text-[#1A3A5C]">0-{seuilVert}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={seuilVert}
            onChange={(e) => handleSeuilVertChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1A3A5C]"
          />
          <p className="text-xs text-slate-500 mt-2">
            Les documents avec un taux de plagiat inférieur à ce seuil sont considérés comme acceptables.
          </p>
        </div>

        {/* Seuil Orange */}
        <div className="py-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Seuil d'avertissement (orange)</span>
            <span className="font-semibold text-[#1A3A5C]">{seuilVert}-{seuilOrange}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={seuilOrange}
            onChange={(e) => handleSeuilOrangeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1A3A5C]"
          />
          <p className="text-xs text-slate-500 mt-2">
            Les documents dans cette plage déclenchent un avertissement et nécessitent une révision.
          </p>
        </div>

        {/* Seuil Rouge */}
        <div className="py-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Seuil critique (rouge)</span>
            <span className="font-semibold text-[#1A3A5C]">{seuilOrange}-{seuilRouge}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={seuilRouge}
            onChange={(e) => handleSeuilRougeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1A3A5C]"
          />
          <p className="text-xs text-slate-500 mt-2">
            Les documents dépassant ce seuil sont automatiquement rejetés.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <Button className="bg-[#1A3A5C] text-white hover:bg-[#2A4A6C]">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder la configuration
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Paramètres additionnels */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg text-[#1E293B] mb-5">Paramètres additionnels</h3>
          
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium">Nombre minimum de sources pour un rapport</Label>
              <Input type="number" defaultValue="5" min="1" className="mt-2 border-slate-200" />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Longueur minimale du rapport (mots)</Label>
              <Input type="number" defaultValue="3000" min="500" className="mt-2 border-slate-200" />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Taille maximale du fichier (MB)</Label>
              <Input type="number" defaultValue="10" min="1" className="mt-2 border-slate-200" />
            </div>
          </div>
        </div>

        {/* Prévisualisation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg text-[#1E293B] mb-5">Prévisualisation</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">✓</div>
              <div>
                <div className="font-medium text-sm">Acceptable</div>
                <div className="text-xs text-slate-500">0-{seuilVert}%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center">!</div>
              <div>
                <div className="font-medium text-sm">Avertissement</div>
                <div className="text-xs text-slate-500">{seuilVert}-{seuilOrange}%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">✗</div>
              <div>
                <div className="font-medium text-sm">Non acceptable</div>
                <div className="text-xs text-slate-500">{seuilOrange}-{seuilRouge}%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7F1D1D] text-white flex items-center justify-center">⚠</div>
              <div>
                <div className="font-medium text-sm">Rejet automatique</div>
                <div className="text-xs text-slate-500">&gt; {seuilRouge}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
