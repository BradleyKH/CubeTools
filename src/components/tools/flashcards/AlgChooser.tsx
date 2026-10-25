import type { AlgCase } from '@/data/algsets';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AlgChooserProps {
  item: AlgCase;
  value: number;
  onChange: (index: number) => void;
}

export default function AlgChooser({ item, value, onChange }: AlgChooserProps) {
  if (item.algs.length < 2) return null;
  const name = `alg-${item.id}`;
  return (
    <fieldset className="mt-4 text-left">
      <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Preferred algorithm
      </legend>
      <RadioGroup value={String(value)} onValueChange={(v) => onChange(Number(v))} name={name}>
        {item.algs.map((alg, i) => (
          <Label key={alg} htmlFor={`${name}-${i}`} className="font-normal leading-snug">
            <RadioGroupItem id={`${name}-${i}`} value={String(i)} />
            <code className="font-mono text-sm">{alg}</code>
          </Label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
