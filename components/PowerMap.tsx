import { PowerMapStage, type GridState } from "@/components/PowerMapStage";
import { NIGERIA_VIEWBOX, nigeriaStates } from "@/lib/nigeria-map";
import { buildPowerGrid } from "@/lib/nigeria-grid";
import { presenceCities, presenceStates, projects } from "@/lib/site";

/**
 * Nigeria as a live grid: all 36 states and the FCT, drawn border by border.
 * The states our crews install in (lib/site.ts → presenceStates) are lit, and
 * current runs along the edge of that network. Everything else stays visible
 * but quiet. Nothing here is a statistic we don't have — there are no
 * per-state installation counts, so none are shown.
 *
 * Server component: the geometry is worked out once and shipped as markup.
 * Only the interaction (PowerMapStage) runs in the browser.
 */

/** Nigeria's six geopolitical zones — geography, not business data. */
const ZONES: Record<string, string[]> = {
  "North-Central": ["NG-BE", "NG-FC", "NG-KO", "NG-KW", "NG-NA", "NG-NI", "NG-PL"],
  "North-East": ["NG-AD", "NG-BA", "NG-BO", "NG-GO", "NG-TA", "NG-YO"],
  "North-West": ["NG-JI", "NG-KD", "NG-KE", "NG-KN", "NG-KT", "NG-SO", "NG-ZA"],
  "South-East": ["NG-AB", "NG-AN", "NG-EB", "NG-EN", "NG-IM"],
  "South-South": ["NG-AK", "NG-BY", "NG-CR", "NG-DE", "NG-ED", "NG-RI"],
  "South-West": ["NG-EK", "NG-LA", "NG-OG", "NG-ON", "NG-OS", "NG-OY"],
};
const zoneOf = (id: string) =>
  Object.keys(ZONES).find((z) => ZONES[z].includes(id)) ?? "";

/** Published case studies whose location names the state. Every one is real
 *  and on /projects — so the readout may say so, and link there. */
function caseStudies(name: string) {
  const place = name === "Abuja (FCT)" ? "Abuja" : name;
  return projects.filter((p) =>
    new RegExp(`\\b${place}\\b`, "i").test(p.location),
  ).length;
}

const PRESENT = new Set(presenceStates);
const grid = buildPowerGrid(presenceStates);

const states: GridState[] = nigeriaStates.map((s) => {
  const cities = presenceCities[s.id];
  return {
    id: s.id,
    name: cities ? `${s.name} (${cities.join(", ")})` : s.name,
    served: PRESENT.has(s.id),
    zone: zoneOf(s.id),
    cases: caseStudies(s.name),
  };
});

const served = states.filter((s) => s.served);
/** The FCT is a territory, not a state — count it separately in the legend. */
const statesServed = served.filter((s) => s.id !== "NG-FC").length;

const distribution = Object.keys(ZONES)
  .map((zone) => ({ zone, count: served.filter((s) => s.zone === zone).length }))
  .filter((z) => z.count > 0)
  .sort((a, b) => b.count - a.count || a.zone.localeCompare(b.zone));

const ariaLabel =
  `Map of Nigeria showing all 36 states and the Federal Capital Territory. ` +
  `Kayglo's crews install in ${served.map((s) => s.name).join(", ")}, ` +
  `and Kayglo installs nationwide.`;

export function PowerMap({ className = "" }: { className?: string }) {
  const frontier = grid.frontier.map((l) => l.d).join("");
  const internal = grid.internal.map((l) => l.d).join("");

  const land = (
    <>
      <g className="map-land-muted">
        {nigeriaStates
          .filter((s) => !PRESENT.has(s.id))
          .map((s) => (
            <path key={s.id} id={`ngmap-${s.id}`} data-state={s.id} d={s.d} pathLength={1000} />
          ))}
      </g>
      <g className="map-land-lit">
        {nigeriaStates
          .filter((s) => PRESENT.has(s.id))
          .map((s) => (
            <path key={s.id} id={`ngmap-${s.id}`} data-state={s.id} d={s.d} pathLength={1000} />
          ))}
      </g>
    </>
  );

  // Borders go across as plain path strings, not elements: each is long
  // enough that the server streams it in its own chunk, and React's dev key
  // check misfires on elements that arrive that way.
  const paths = {
    mesh: nigeriaStates.map((s) => s.d).join(""),
    outline: grid.outline,
    meshLit: nigeriaStates.filter((s) => PRESENT.has(s.id)).map((s) => s.d).join(""),
    frontier,
    internal,
  };

  return (
    <PowerMapStage
      className={className}
      viewBox={NIGERIA_VIEWBOX}
      ariaLabel={ariaLabel}
      states={states}
      summary={`Servicing ${statesServed} states & the FCT — installing nationwide`}
      distribution={distribution}
      land={land}
      paths={paths}
    />
  );
}
