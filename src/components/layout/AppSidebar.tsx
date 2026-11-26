import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, LayoutDashboard, Search, Plus, Sparkles } from "lucide-react";
import { useOpenProduct } from "@/hooks/use-open-product";
import { deleteProduct, useStore } from "@/lib/store";
import { DemoModeSwitch } from "./DemoModeSwitch";
import { SidebarProducts } from "./SidebarProducts";
import logoTrendme from "@/assets/logo-trendme.png";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/produits", label: "Rechercher", icon: Search },
  { to: "/generations", label: "Générations", icon: Sparkles },
] as const;

export function AppSidebar() {
  const s = useStore();
  const openProduct = useOpenProduct();
  const [open, setOpen] = useState(true);
  const item = "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground";
  if (!open) {
    return (
      <aside className="sticky top-0 hidden h-screen w-16 shrink-0 flex-col items-center gap-1 border-r border-dashed bg-sidebar py-4 md:flex">
        <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" className="mb-6 rounded-full p-2.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"><PanelLeftOpen className="h-4 w-4" /></button>
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} title={label} aria-label={label} className="rounded-full p-2.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "!bg-sidebar-accent !text-foreground" }}>
            <Icon className="h-4 w-4" />
          </Link>
        ))}
      </aside>
    );
  }
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-dashed bg-sidebar p-4 md:flex">
      <div className="mb-8 flex items-center justify-between px-2 pt-2">
        <Link to="/" className="flex items-center gap-2" aria-label="TrendMe — accueil">
          <img src={logoTrendme} alt="TrendMe" width={1152} height={576} className="h-16 w-auto md:h-20" />
        </Link>
        <button onClick={() => setOpen(false)} aria-label="Ranger le menu" className="rounded-full p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"><PanelLeftClose className="h-4 w-4" /></button>
      </div>
      <nav className="space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={item} activeOptions={{ exact: true }} activeProps={{ className: "!bg-sidebar-accent !text-foreground" }}>
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
      <div className="my-5 border-t border-dashed" />
      <div className="mb-2 flex items-center justify-between px-4">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Mes recherches</span>
        <Link to="/produits" aria-label="Trouver des inspirations" className="text-muted-foreground hover:text-primary"><Plus className="h-4 w-4" /></Link>
      </div>
      <SidebarProducts products={s.products} activeId={s.activeProductId} videos={s.videos} itemClassName={item} onOpen={openProduct} onDelete={deleteProduct} />
      <DemoModeSwitch on={s.demoMode} />
    </aside>
  );
}
