import { useOpenProduct } from "@/hooks/use-open-product";
import { deleteProduct, useStore } from "@/lib/store";
import { DashboardHero } from "./components/DashboardHero";
import { ProductList } from "./components/ProductList";
import { RecentSearches } from "./components/RecentSearches";

export function DashboardPage() {
  const s = useStore();
  const openProduct = useOpenProduct();
  return (
    <div className="relative">
      <DashboardHero />
      <div className="relative mx-auto max-w-6xl px-6 pb-12 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ProductList products={s.products} onOpen={openProduct} onDelete={deleteProduct} />
          <RecentSearches searches={s.searches} />
        </div>
      </div>
    </div>
  );
}
