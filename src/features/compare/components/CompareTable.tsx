import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { FadeContent } from "@/components/reactbits";
import { PlatformIcon } from "@/components/PlatformIcon";
import type { Analysis, Video } from "@/lib/types";

type Analyses = Record<string, Analysis | undefined>;

const ROWS: { label: string; cell: (v: Video, a: Analysis | undefined) => ReactNode }[] = [
  {
    label: "Hook",
    cell: (_, a) =>
      a && (
        <>
          <span className="text-xs uppercase tracking-wider text-primary">{a.hook.type}</span>
          <p className="mt-1">« {a.hook.description} »</p>
        </>
      ),
  },
  { label: "Format", cell: (_, a) => a?.format },
  { label: "CTA", cell: (_, a) => a?.cta },
  { label: "Score", cell: (v) => <Score value={v.score} /> },
  {
    label: "Correspondance marque",
    cell: (_, a) =>
      a && (
        <>
          <Score value={a.brandMatch.score} />
          <p className="mt-1 text-sm text-muted-foreground">{a.brandMatch.reason}</p>
        </>
      ),
  },
];

export function CompareTable({ videos, analyses }: { videos: Video[]; analyses: Analyses }) {
  return (
    <FadeContent className="mt-8 overflow-x-auto rounded-[2rem] border border-dashed bg-card">
      <table className="w-full min-w-[720px] text-left align-top">
        <thead>
          <tr className="border-b border-dashed">
            <th className="w-44 p-5" />
            {videos.map((v) => (
              <th key={v.id} className="p-5 font-normal">
                <Link
                  to="/analyse/$videoId"
                  params={{ videoId: v.id }}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  {v.thumbnailUrl ? (
                    <img
                      src={v.thumbnailUrl}
                      alt=""
                      className="aspect-[9/16] w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="aspect-[9/16] w-12 rounded-xl bg-muted" />
                  )}
                  <span>
                    <span className="block font-bold">@{v.creator.handle}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <PlatformIcon platform={v.platform} className="h-3 w-3" /> {v.platform}
                    </span>
                  </span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label} className="border-b border-dashed last:border-0">
              <th
                scope="row"
                className="p-5 align-top text-xs font-normal uppercase tracking-wider text-muted-foreground"
              >
                {r.label}
              </th>
              {videos.map((v) => (
                <td key={v.id} className="p-5 align-top">
                  {r.cell(v, analyses[v.id]) || <span className="text-muted-foreground">…</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </FadeContent>
  );
}

function Score({ value }: { value: number }) {
  return (
    <span className="font-mono text-2xl">
      {value}
      <span className="text-sm text-muted-foreground">/100</span>
    </span>
  );
}
