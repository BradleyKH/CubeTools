import { algSets, type AlgSetId } from '@/data/algsets';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const METHODS = ['CFOP', 'Roux'] as const;

interface SetPickerProps {
  value: AlgSetId;
  onChange: (id: AlgSetId) => void;
}

export default function SetPicker({ value, onChange }: SetPickerProps) {
  return (
    <Select value={value} onValueChange={(id) => onChange(id as AlgSetId)}>
      <SelectTrigger aria-label="Algorithm set" className="min-w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        {METHODS.map((method) => (
          <SelectGroup key={method}>
            <SelectLabel>{method} method</SelectLabel>
            {algSets
              .filter((set) => set.method === method)
              .map((set) => (
                <SelectItem key={set.id} value={set.id}>
                  {set.name}
                </SelectItem>
              ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
