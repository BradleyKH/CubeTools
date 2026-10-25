import { useEffect, useMemo, useRef } from 'react';
import { invertAlg, normalizeAlg, stickeringMaskOrbitsFor, visualizationFor } from '@/lib/cube';

type Player = HTMLElement & { experimentalStickeringMaskOrbits: unknown };

export interface TwistyViewProps {
  /** cubing.js puzzle id, e.g. `3x3x3`, `pyraminx`, `square1`. */
  puzzle?: string;
  alg?: string;
  setup?: string;
  setupFromAlgInverse?: boolean;
  stickering?: string;
  view?: '2D' | '3D';
  controls?: boolean;
  /** Accessible name for the diagram. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  /** Show yellow on top and green in front, the CFOP/Roux convention. Defaults on when a stickering is set. */
  yellowTop?: boolean;
  className?: string;
}

const SIZES = { sm: '7.5rem', md: '11rem', lg: '16rem' } as const;

const maskCache = new Map<string, Promise<string | undefined>>();

function cachedMask(puzzle: string, stickering: string, yellowTop: boolean): Promise<string | undefined> {
  const key = `${puzzle}|${stickering}|${yellowTop}`;
  let pending = maskCache.get(key);
  if (!pending) {
    pending = stickeringMaskOrbitsFor(puzzle, stickering, yellowTop).catch(() => undefined);
    maskCache.set(key, pending);
  }
  return pending;
}

function colorScheme(): 'light' | 'dark' {
  const classes = document.documentElement.classList;
  if (classes.contains('dark')) return 'dark';
  if (classes.contains('light')) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setAttr(player: HTMLElement, name: string, value: string | undefined): void {
  if (value === undefined || value === '') player.removeAttribute(name);
  else if (player.getAttribute(name) !== value) player.setAttribute(name, value);
}

export default function TwistyView({
  puzzle = '3x3x3',
  alg,
  setup,
  setupFromAlgInverse = false,
  stickering,
  view = '3D',
  controls = false,
  label,
  size = 'md',
  yellowTop = Boolean(stickering && stickering !== 'full'),
  className,
}: TwistyViewProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const applyToken = useRef(0);

  const spec = useMemo(() => {
    const normalizedAlg = alg ? normalizeAlg(alg) : '';
    // z2 keeps green in front while turning yellow to the top; later setup moves read in that frame.
    const setupParts = [
      yellowTop ? 'z2' : '',
      setup ? normalizeAlg(setup) : '',
      setupFromAlgInverse && alg ? invertAlg(alg) : '',
    ];
    return {
      puzzle,
      alg: normalizedAlg,
      setupAlg: setupParts.filter(Boolean).join(' '),
      stickering,
      yellowTop,
      visualization: visualizationFor(view, stickering),
      controls,
    };
  }, [puzzle, alg, setup, setupFromAlgInverse, stickering, yellowTop, view, controls]);

  // The async mount path reads the spec through a ref so props that changed while
  // cubing/twisty was still loading are not lost.
  const specRef = useRef(spec);
  specRef.current = spec;

  function apply(player: Player): void {
    const s = specRef.current;
    const token = ++applyToken.current;
    setAttr(player, 'puzzle', s.puzzle);
    setAttr(player, 'alg', s.alg);
    setAttr(player, 'experimental-setup-alg', s.setupAlg);
    setAttr(player, 'visualization', s.visualization);
    setAttr(player, 'control-panel', s.controls ? 'bottom-row' : 'none');
    setAttr(player, 'color-scheme', s.controls ? colorScheme() : 'light');
    // Without controls the player is pure imagery; the stage's role="img" carries the accessible name.
    if (s.controls) player.removeAttribute('aria-hidden');
    else player.setAttribute('aria-hidden', 'true');

    const stock = s.stickering;
    void (async () => {
      const mask = stock && s.yellowTop ? await cachedMask(s.puzzle, stock, s.yellowTop) : undefined;
      if (token !== applyToken.current) return;
      if (mask) {
        // JSON masks carry piece stickerings the compact attribute format cannot express.
        player.experimentalStickeringMaskOrbits = mask.startsWith('{') ? JSON.parse(mask) : mask;
      } else {
        player.experimentalStickeringMaskOrbits = null;
        setAttr(player, 'experimental-stickering', stock);
      }
    })();
  }

  useEffect(() => {
    let cancelled = false;
    void import('cubing/twisty').then(() => {
      const stage = stageRef.current;
      if (cancelled || !stage) return;
      const player = document.createElement('twisty-player') as Player;
      player.setAttribute('background', 'none');
      player.setAttribute('hint-facelets', 'none');
      player.setAttribute('viewer-link', 'none');
      player.style.width = '100%';
      player.style.height = '100%';
      playerRef.current = player;
      apply(player);
      stage.append(player);
    });
    return () => {
      cancelled = true;
      applyToken.current++;
      playerRef.current?.remove();
      playerRef.current = null;
    };
    // apply reads only refs, so a one-time mount effect is correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (playerRef.current) apply(playerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec]);

  // Interactive players follow the page theme; static diagrams stay on the transparent light scheme.
  useEffect(() => {
    if (!controls) return;
    const sync = () => playerRef.current?.setAttribute('color-scheme', colorScheme());
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    query.addEventListener('change', sync);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      query.removeEventListener('change', sync);
      observer.disconnect();
    };
  }, [controls]);

  return (
    <div
      ref={stageRef}
      role={controls ? 'group' : 'img'}
      aria-label={label}
      className={className}
      style={{
        width: SIZES[size],
        maxWidth: '100%',
        aspectRatio: controls ? '4 / 5' : '1',
      }}
    />
  );
}
