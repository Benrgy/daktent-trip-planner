import { useState } from "react";
import { packingCategories } from "@/data/packingItems";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

const PackingChecklist = () => {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(Object.keys(packingCategories)));

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSection = (cat: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const totalItems = Object.values(packingCategories).flat().length;
  const progress = Math.round((checked.size / totalItems) * 100);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="mb-2 text-center text-3xl font-bold">Paklijst</h2>
        <p className="mb-4 text-center text-muted-foreground">Automatisch samengesteld voor jouw trip</p>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-semibold text-secondary">{checked.size}/{totalItems}</span>
        </div>

        <div className="space-y-3">
          {Object.entries(packingCategories).map(([cat, items]) => {
            const catChecked = items.filter(i => checked.has(i.id)).length;
            const isOpen = openSections.has(cat);
            return (
              <div key={cat} className="rounded-xl bg-card shadow-card overflow-hidden">
                <button
                  onClick={() => toggleSection(cat)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {catChecked === items.length ? (
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {catChecked}
                      </span>
                    )}
                    <span className="font-semibold">{cat}</span>
                    <span className="text-xs text-muted-foreground">({catChecked}/{items.length})</span>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {isOpen && (
                  <div className="border-t border-border px-4 pb-4">
                    {items.map(item => (
                      <label key={item.id} className="flex cursor-pointer items-center gap-3 py-2 text-sm hover:bg-muted/50 rounded px-2 -mx-2">
                        <Checkbox checked={checked.has(item.id)} onCheckedChange={() => toggle(item.id)} />
                        <span className={checked.has(item.id) ? "line-through text-muted-foreground" : ""}>{item.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackingChecklist;
