import { join, parse, BufReader, pick } from '../deps.ts';

export type Planet = Record<string, string | number>;
let planets: Planet[] = [];

export const filterHabitablePlanets = (planets: Planet[]) => {
  return planets.filter((planet) => {
    const planetaryRadius = Number(planet['koi_prad']);
    const stellarRadius = Number(planet['koi_srad']);
    const stellarMass = Number(planet['koi_smass']);

    return (
      planet['koi_disposition'] === 'CONFIRMED' &&
      planetaryRadius > 0.5 &&
      planetaryRadius < 1.5 &&
      stellarRadius > 0.99 &&
      stellarRadius < 1.01 &&
      stellarMass > 0.78 &&
      stellarMass < 1.04
    );
  });
};

const loadPlanetData = async () => {
  const path = join('data', 'kepler_exoplanets_nasa.csv');

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);

  const result = await parse(bufReader, {
    skipFirstRow: true,
    comment: '#',
  });

  // Close file resource id (rid) to avoid leaking resources.
  Deno.close(file.rid);

  const planets = filterHabitablePlanets(result as Planet[]);

  return planets.map((planet) => {
    return pick(planet, [
      'kepler_name',
      'koi_prad',
      'koi_smass',
      'koi_srad',
      'koi_count',
      'koi_steff',
    ]);
  });
};

planets = await loadPlanetData();

export const getAllPlanets = () => {
  return planets;
};
