// Italian texts of the site (proposal KW-2026-002, A.6): one map per registry
// file, keyed by the English block slug. A block without an entry is shared
// with English (images, links, numbers, company data, brand names). Draft of
// 24 Sep 2026: the technical terminology is to be proofread by Enfrio, then
// every text is edited in the Kiwi panel (groups "Italiano › …").
import { IT_COLLECTIONS } from "./collections";
import { IT_COMPANY } from "./company";
import { IT_CONTACT } from "./contact";
import { IT_GLOBAL } from "./global";
import { IT_HOME } from "./home";
import { IT_INDUSTRIES } from "./industries";
import { IT_LEGAL } from "./legal";
import { IT_PROJECTS } from "./projects";
import { IT_QHSE } from "./qhse";
import { IT_SOLUTIONS } from "./solutions";
import { IT_TECHNOLOGY } from "./technology";
import { IT_TOWER_M } from "./tower-m";

export const IT_TEXTS: Readonly<Record<string, string>> = Object.freeze({
  ...IT_GLOBAL,
  ...IT_HOME,
  ...IT_SOLUTIONS,
  ...IT_TECHNOLOGY,
  ...IT_INDUSTRIES,
  ...IT_PROJECTS,
  ...IT_COMPANY,
  ...IT_CONTACT,
  ...IT_QHSE,
  ...IT_LEGAL,
  ...IT_TOWER_M,
});

export { IT_COLLECTIONS };
