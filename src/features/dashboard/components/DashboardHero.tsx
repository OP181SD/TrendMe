import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import logoTrendme from "@/assets/logo-trendme.png";
import { BlurText, FadeContent } from "@/components/reactbits";
import { Button } from "@/components/ui/button";
import { OrbitHero } from "./OrbitHero";

export function DashboardHero() {
  return (
    <OrbitHero>
      <img src={logoTrendme} alt="TrendMe" width={1152} height={576} className="mx-auto h-16 w-auto md:h-20" />
      <BlurText text="Votre espace d'inspiration vidéo" className="mt-4 max-w-xl justify-center text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl" />
      <FadeContent delay={0.4}>
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button asChild size="lg" className="rounded-full"><Link to="/produits">Trouver des inspirations <ArrowRight /></Link></Button>
          <Button asChild size="lg" variant="ghost" className="rounded-full"><Link to="/top-videos">Mes vidéos</Link></Button>
        </div>
      </FadeContent>
    </OrbitHero>
  );
}
