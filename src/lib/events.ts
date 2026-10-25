/** WCA events the tools support. `puzzle` is the cubing.js puzzle id. */
export const EVENTS = [
  { id: '333', name: '3x3x3', puzzle: '3x3x3' },
  { id: '222', name: '2x2x2', puzzle: '2x2x2' },
  { id: '444', name: '4x4x4', puzzle: '4x4x4' },
  { id: '555', name: '5x5x5', puzzle: '5x5x5' },
  { id: '666', name: '6x6x6', puzzle: '6x6x6' },
  { id: '777', name: '7x7x7', puzzle: '7x7x7' },
  { id: '333oh', name: '3x3x3 One-Handed', puzzle: '3x3x3' },
  { id: '333bf', name: '3x3x3 Blindfolded', puzzle: '3x3x3' },
  { id: 'pyram', name: 'Pyraminx', puzzle: 'pyraminx' },
  { id: 'skewb', name: 'Skewb', puzzle: 'skewb' },
  { id: 'minx', name: 'Megaminx', puzzle: 'megaminx' },
  { id: 'clock', name: 'Clock', puzzle: 'clock' },
  { id: 'sq1', name: 'Square-1', puzzle: 'square1' },
] as const;

export type EventId = (typeof EVENTS)[number]['id'];
export type SpeedEvent = (typeof EVENTS)[number];

const EVENT_BY_ID: ReadonlyMap<string, SpeedEvent> = new Map(EVENTS.map((e) => [e.id, e]));

export function isEventId(value: string): value is EventId {
  return EVENT_BY_ID.has(value);
}

export function getEvent(id: EventId): SpeedEvent {
  return EVENT_BY_ID.get(id)!;
}
