import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { NiveauAlerte } from "@/types/analyse.types";

interface JaugePlagiatProps {
  taux: number;
  niveau: NiveauAlerte;
}

const colorMap = {
  VERT: "var(--color-plagiat-vert)",
  ORANGE: "var(--color-plagiat-orange)",
  ROUGE: "var(--color-plagiat-rouge)",
  CRITIQUE: "var(--color-plagiat-critique)",
};

const textMap = {
  VERT: "Original",
  ORANGE: "Similarité Modérée",
  ROUGE: "Similarité Forte",
  CRITIQUE: "Alerte Critique",
};

export function JaugePlagiat({ taux, niveau }: JaugePlagiatProps) {
  const data = [{ name: "Plagiat", value: taux, fill: colorMap[niveau] || colorMap.VERT }];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="h-48 w-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={15}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: "var(--color-border)" }}
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
          <span className="text-3xl font-bold text-primary-dark">{taux}%</span>
        </div>
      </div>
      <div className="mt-[-2rem] text-center">
        <span className="font-semibold" style={{ color: colorMap[niveau] }}>
          {textMap[niveau]}
        </span>
      </div>
    </div>
  );
}
