import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/integration/**'],
    // Middleware testovi mockiraju iste module (db, runDetectors), pa moraju
    // biti izolovani jedan od drugog. Vitest to radi po fajlu po defaultu,
    // ali restoreMocks osigurava cisto stanje i izmedju pojedinacnih testova.
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/middleware/**', 'src/detection/**', 'src/classification/**'],
      reporter: ['text', 'html'],
    },
  },
});