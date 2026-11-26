import { EvilBarChart } from "@/components/evilcharts/charts/recharts-bar-chart";
import { FadeContent } from "@/components/reactbits";
import type { Share } from "@/lib/insights";

const config = { percent: { label: "Part des meilleures vidéos (%)", colors: { light: ["var(--primary)"], dark: ["var(--primary)"] } } };

export function ShareChart({ title, data }: { title: string; data: Share[] }) {
  return (
    <FadeContent className="rounded-[1.75rem] border border-dashed bg-card p-6">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      {data.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">Pas encore de données.</p> : (
        <EvilBarChart config={config} data={data.map((d) => ({ ...d }))} className="mt-4 h-56 w-full" layout="horizontal">
          <EvilBarChart.XAxis dataKey="percent" type="number" domain={[0, 100]} />
          <EvilBarChart.YAxis dataKey="label" type="category" width={110} />
          <EvilBarChart.Tooltip />
          <EvilBarChart.Bar dataKey="percent" />
        </EvilBarChart>
      )}
    </FadeContent>
  );
}
