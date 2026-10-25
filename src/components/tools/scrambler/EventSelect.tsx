import { EVENTS, isEventId, type EventId } from '@/lib/events';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EventSelectProps {
  id?: string;
  value: EventId;
  onChange: (id: EventId) => void;
}

export default function EventSelect({ id, value, onChange }: EventSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => isEventId(next) && onChange(next)}>
      <SelectTrigger id={id} className="w-full sm:w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {EVENTS.map((event) => (
          <SelectItem key={event.id} value={event.id}>
            {event.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
