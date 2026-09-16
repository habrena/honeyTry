import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    setupFiles: ['tests/integration/setup.ts'],

    // Testovi dijele jednu bazu i ciste je izmedju sebe, pa ne smiju teci
    // paralelno — inace bi ciscenje jednog obrisalo podatke drugog.
    fileParallelism: false,

    // Neon je udaljen i ima hladan start, a analiticki lanac je asinhron.
    // Podrazumijevanih 5 s je premalo.
    testTimeout: 30_000,
    hookTimeout: 30_000,

    clearMocks: true,
  },
});