import { Button } from "@/components/ui/button";

interface Props {
  filter: string;
  onFilterChange: (f: string) => void;
}

const filters = [
  { id: "all", label: "Alles" },
  { id: "free", label: "Gratis" },
  { id: "paid", label: "Betaald" },
  { id: "NL", label: "Nederland" },
  { id: "BE", label: "België" },
  { id: "DE", label: "Duitsland" },
  { id: "FR", label: "Frankrijk" },
  { id: "SC", label: "Scandinavië" },
];

const SpotFilters = ({ filter, onFilterChange }: Props) => (
  <div className="flex flex-wrap gap-1.5">
    {filters.map(f => (
      <Button
        key={f.id}
        size="sm"
        variant={filter === f.id ? "default" : "outline"}
        onClick={() => onFilterChange(f.id)}
        className="h-7 rounded-md px-2.5 text-xs"
      >
        {f.label}
      </Button>
    ))}
  </div>
);

export default SpotFilters;
