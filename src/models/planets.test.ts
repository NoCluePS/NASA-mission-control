// deno-lint-ignore-file
/*
    Deno includes: 
    
    1. Test runner in the CLI
    2. Assertions in the std
    3. Built-in test fixtures with Deno.test()
*/
import { filterHabitablePlanets, Planet } from './planets.ts';
import { assertEquals } from '../test_deps.ts';

const HABITABLE_PLANET: Planet = {
  koi_disposition: 'CONFIRMED',
  koi_prad: 1,
  koi_srad: 1,
  koi_smass: 1,
};

const TOO_LARGE_PRAD: Planet = {
  koi_disposition: 'CONFIRMED',
  koi_prad: 1.5,
  koi_srad: 1,
  koi_smass: 1,
};

const TOO_LARGE_SRAD: Planet = {
  koi_disposition: 'CONFIRMED',
  koi_prad: 1,
  koi_srad: 1.5,
  koi_smass: 1,
};
const TOO_LARGE_SMASS: Planet = {
  koi_disposition: 'CONFIRMED',
  koi_prad: 1,
  koi_srad: 1,
  koi_smass: 1.05,
};
Deno.test('Returns habitable planets only', () => {
  assertEquals(
    filterHabitablePlanets([
      HABITABLE_PLANET,
      TOO_LARGE_PRAD,
      TOO_LARGE_SMASS,
      TOO_LARGE_SRAD,
    ]),
    [HABITABLE_PLANET]
  );
});
