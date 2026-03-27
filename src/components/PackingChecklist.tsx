import { useState } from "react";
import { packingCategories } from "@/data/packingItems";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

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
    <section className="border-b border-border py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 5</div>
        <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Paklijst</h2>
        <p className="mb-6 text-sm text-muted-foreground">Automatisch samengesteld — vink af wat je hebt ingepakt.</p>

        {/* Progress */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{checked.size}/{totalItems}</span>
        </div>

        <div className="space-y-2">
          {Object.entries(packingCategories).map(([cat, items]) => {
            const catChecked = items.filter(i => checked.has(i.id)).length;
            const isOpen = openSections.has(cat);
            const allDone = catChecked === items.length;
            return (
              <div key={cat} className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
                <button
                  onClick={() => toggleSection(cat)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    {allDone ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px] font-semibold text-muted-foreground">
                        {catChecked}
                      </span>
                    )}
                    <span className="font-medium text-foreground">{cat}</span>
                    <span className="text-xs text-muted-foreground">{catChecked}/{items.length}</span>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {isOpen && (
                  <div className="border-t border-border px-4 pb-3">
                    {items.map(item => (
                      <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50 -mx-2">
                        <Checkbox checked={checked.has(item.id)} onCheckedChange={() => toggle(item.id)} />
                        <span className={checked.has(item.id) ? "line-through text-muted-foreground" : "text-foreground"}>{item.name}</span>
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
