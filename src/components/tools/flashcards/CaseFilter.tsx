import type { AlgSet } from '@/data/algsets';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { allCaseIds, caseLabel } from './useFlashcards';

interface CaseFilterProps {
  set: AlgSet;
  activeIds: string[];
  onChange: (caseIds: string[]) => void;
}

export default function CaseFilter({ set, activeIds, onChange }: CaseFilterProps) {
  const active = new Set(activeIds);

  function toggle(ids: string[], on: boolean): void {
    const next = new Set(active);
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    onChange([...next]);
  }

  return (
    <section aria-labelledby="case-filter-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="case-filter-heading" className="text-lg font-semibold">
          Cases
        </h2>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onChange(allCaseIds(set))}>
            Select all
          </Button>
          <Button size="sm" variant="outline" onClick={() => onChange([])}>
            None
          </Button>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {activeIds.length} of {allCaseIds(set).length} selected
      </p>
      <ul className="mt-3 space-y-3">
        {set.groups.map((group) => {
          const ids = group.cases.map((c) => c.id);
          const count = ids.filter((id) => active.has(id)).length;
          const checked = count === ids.length ? true : count === 0 ? false : 'indeterminate';
          const groupInputId = `group-${group.id}`;
          return (
            <li key={group.id}>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={groupInputId}
                  checked={checked}
                  onCheckedChange={() => toggle(ids, checked !== true)}
                />
                <Label htmlFor={groupInputId}>{group.name}</Label>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {count}/{ids.length}
                </span>
              </div>
              <details className="mt-1 ml-6">
                <summary className="cursor-pointer text-sm text-muted-foreground">Choose cases</summary>
                <ul className="mt-2 space-y-2">
                  {group.cases.map((item) => {
                    const inputId = `case-${item.id}`;
                    return (
                      <li key={item.id} className="flex items-start gap-2">
                        <Checkbox
                          id={inputId}
                          checked={active.has(item.id)}
                          onCheckedChange={(on) => toggle([item.id], on === true)}
                          className="mt-0.5"
                        />
                        <Label htmlFor={inputId} className="font-normal leading-snug">
                          {caseLabel(set, item)}
                        </Label>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
