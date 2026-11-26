import { Loader2, Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  loading,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-card p-2 pl-5 focus-within:border-primary">
      <Search className="h-5 w-5 text-muted-foreground" />
      <input
        autoFocus
        className="flex-1 bg-transparent py-2 text-lg outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex. crème anti-âge"
      />
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{" "}
        Chercher
      </button>
    </div>
  );
}
