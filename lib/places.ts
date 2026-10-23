import { nigeriaStates } from "@/lib/nigeria-map";
import { presenceCities, presenceStates } from "@/lib/site";

/**
 * The places Kayglo installs in, named for people: each state from the map
 * data, with a city in brackets where one is worth naming — "Akwa Ibom (Uyo)".
 * Kept out of lib/site.ts so the map's outline data never reaches pages that
 * only need the business facts.
 */
export function servedPlaces({ fct = "Abuja (FCT)" } = {}) {
  return presenceStates
    .map((id) => {
      const state = nigeriaStates.find((s) => s.id === id);
      if (!state) return null;
      const name = id === "NG-FC" ? fct : state.name;
      const cities = presenceCities[id];
      return { id, name: cities ? `${name} (${cities.join(", ")})` : name, state: state.name, cities: cities ?? [] };
    })
    .filter((p) => p !== null);
}
