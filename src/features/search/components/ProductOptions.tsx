import { ImagePlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ProductForm } from "../hooks/use-product-form";
import { DURATIONS, FORMATS, TONES } from "../product-presets";
import { Chip, Field } from "./FormParts";

interface Props {
  form: ProductForm;
  /** Case « vidéos visuellement proches » affichée seulement si la recherche par image est possible. */
  canUseImage: boolean;
  useImage: boolean;
  onUseImage: (v: boolean) => void;
}

/** Bloc « Plus d'options » : image, détails, marque, ton, format, durée. */
export function ProductOptions({ form, canUseImage, useImage, onUseImage }: Props) {
  const { product: p, set, setBrand, setStyle, setImageFile } = form;
  return (
    <details className="rounded-3xl border border-dashed p-5">
      <summary className="cursor-pointer text-sm text-muted-foreground">
        Plus d'options (facultatif)
      </summary>
      <div className="mt-5 space-y-4">
        <Field label="Image">
          <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed p-3 hover:border-primary">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt="Aperçu" className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <ImagePlus className="h-5 w-5 text-muted-foreground" />
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              {p.imageUrl ? "Changer" : "Ajouter une image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => setImageFile(e.target.files?.[0])}
            />
          </label>
          {canUseImage && (
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox checked={useImage} onCheckedChange={(v) => onUseImage(v === true)} />
              Vidéos visuellement proches
            </label>
          )}
        </Field>
        <Field label="Détails">
          <Textarea
            className="rounded-2xl"
            rows={2}
            value={p.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Bénéfice clé, pour qui"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Marque">
            <Input
              className="rounded-2xl"
              value={p.brand.name}
              onChange={(e) => setBrand({ name: e.target.value })}
            />
          </Field>
          <Field label="Cible">
            <Input
              className="rounded-2xl"
              value={p.brand.target}
              onChange={(e) => setBrand({ target: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Ton">
          <Select value={p.brand.tone} onValueChange={(tone) => setBrand({ tone })}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="Choisir un ton" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Format">
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <Chip key={f} active={p.style.format === f} onClick={() => setStyle({ format: f })}>
                {f}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Durée">
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <Chip
                key={d}
                active={p.style.durationSeconds === d}
                onClick={() => setStyle({ durationSeconds: d })}
              >
                <span className="font-mono">{d} s</span>
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </details>
  );
}
