import { afterEach, describe, expect, it, vi } from 'vitest';
import { joinBase, withBase } from './url';

describe('joinBase', () => {
  it.each([
    ['/CubeTools/', '', '/CubeTools/'],
    ['/CubeTools/', '/', '/CubeTools/'],
    ['/CubeTools', '/', '/CubeTools/'],
    ['/CubeTools/', 'notation/', '/CubeTools/notation/'],
    ['/CubeTools/', '/notation/', '/CubeTools/notation/'],
    ['/CubeTools', 'notation/', '/CubeTools/notation/'],
    ['/CubeTools/', 'notation', '/CubeTools/notation'],
    ['/CubeTools/', '/tutorials/cfop/#f2l', '/CubeTools/tutorials/cfop/#f2l'],
    ['/CubeTools/', 'flashcards/?set=oll', '/CubeTools/flashcards/?set=oll'],
    ['/CubeTools/', 'favicon/favicon.ico', '/CubeTools/favicon/favicon.ico'],
    ['/', '/notation/', '/notation/'],
  ])('joinBase(%j, %j) -> %j', (base, path, expected) => {
    expect(joinBase(base, path)).toBe(expected);
  });

  it.each(['https://example.com/', 'mailto:a@b.c', '//cdn.example.com/x.js', '#main'])(
    'passes %j through unchanged',
    (path) => {
      expect(joinBase('/CubeTools/', path)).toBe(path);
    },
  );
});

describe('withBase', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefixes with import.meta.env.BASE_URL', () => {
    vi.stubEnv('BASE_URL', '/CubeTools/');
    expect(withBase('/notation/')).toBe('/CubeTools/notation/');
    expect(withBase('')).toBe('/CubeTools/');
  });
});
