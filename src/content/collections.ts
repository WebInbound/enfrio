// Repeatable lists managed as Kiwi collections ("Elenchi" in the panel).
// Each item: title (caption / project name), image_url, optional body, and
// metadata.alt for the image's alternative text. The `items` below are the
// site's original content: they seed the collection and are rendered as
// fallback when Kiwi is unavailable or the list is empty.
//
// No runtime imports here (read by scripts/kiwi-seed-sql.mjs).

export type CollectionItemDef = {
  title: string;
  image: string;
  alt: string;
  body?: string;
};

export type CollectionDef = {
  slug: string;
  label: string;
  singular: string;
  sitePath: string;
  items: CollectionItemDef[];
};

export const MACHINERY_GALLERY = {
  slug: "technology_machinery_gallery",
  label: "Technology — galleria macchinari",
  singular: "Foto",
  sitePath: "/technology",
  items: [
    { image: "/assets/images/site/mach-bending-a.jpg", alt: "Bending machine overview", title: "Bending platform setup for thermal line integration." },
    { image: "/assets/images/site/mach-bending-d.jpg", alt: "Bending machine operation", title: "Operator-controlled routing precision." },
    { image: "/assets/images/site/mach-laser-a.jpg", alt: "Laser process cell", title: "Laser processing for consistent component geometry." },
    { image: "/assets/images/site/quality-hexagon-b.jpg", alt: "Quality metrology", title: "CMM verification on critical dimensions." },
    { image: "/assets/images/site/prod-weld-station.jpg", alt: "Welding workstation", title: "Fabrication station with controlled workmanship." },
  ],
} satisfies CollectionDef;

export const MADRID_GALLERY = {
  slug: "industries_madrid_gallery",
  label: "Industries — galleria camion Madrid",
  singular: "Foto",
  sitePath: "/industries",
  items: [
    { image: "/assets/images/site/waste-madrid-01.jpg", alt: "Madrid waste truck project visual 1", title: "Custom core-box opening on radiator package." },
    { image: "/assets/images/site/waste-madrid-02.jpg", alt: "Madrid waste truck project visual 2", title: "Truck integration detail from Madrid platform." },
    { image: "/assets/images/site/waste-madrid-03.jpg", alt: "Madrid waste truck project visual 3", title: "Vehicle-level integration in operation context." },
    { image: "/assets/images/site/waste-madrid-04.jpg", alt: "Madrid waste truck project visual 4", title: "Cooling system mounted on waste collection vehicle." },
    { image: "/assets/images/site/waste-madrid-05.jpg", alt: "Madrid waste truck project visual 5", title: "Field-ready Enfrio architecture for the Madrid platform." },
  ],
} satisfies CollectionDef;

export const PROJECTS = {
  slug: "projects_references",
  label: "Projects — referenze",
  singular: "Progetto",
  sitePath: "/projects",
  items: [
    {
      title: "40HC Container Package",
      body: "Cooling package engineered for compact container fit with high-efficiency cores, low fan power and low-noise behavior.",
      image: "/assets/images/site/rad-40ng.jpg",
      alt: "40HC container package",
    },
    {
      title: "Remote MTU Customization",
      body: "Customized radiator for remote installations, with container-ready dimensions and robust field-oriented architecture.",
      image: "/assets/images/site/rad-remote-mtu.jpg",
      alt: "MTU remote installation radiator",
    },
    {
      title: "Madrid Waste Truck Product (Enfrio Development)",
      body: "Proprietary Enfrio solution for Madrid waste collection vehicles, engineered around severe packaging constraints with custom radiator/CAC architecture.",
      image: "/assets/images/site/waste-madrid-03.jpg",
      alt: "Enfrio Madrid waste truck cooling product",
    },
  ],
} satisfies CollectionDef;

export const PROJECT_SNAPSHOTS = {
  slug: "projects_snapshots",
  label: "Projects — galleria istantanee",
  singular: "Foto",
  sitePath: "/projects",
  items: [
    { image: "/assets/images/site/rad-40ng.jpg", alt: "40HC container-fit cooling package", title: "Container-fit packages engineered for fast deployment." },
    { image: "/assets/images/site/installed-v20-integrated.jpg", alt: "V20 engine with integrated Enfrio cooling package", title: "Engine + cooling integrated as a single hand-off platform." },
    { image: "/assets/images/site/rad-warehouse-stock.jpg", alt: "Finished cooling units staged in the warehouse", title: "Production continuity and staged delivery readiness." },
    { image: "/assets/images/site/rad-double.jpg", alt: "Dual-circuit Enfrio radiator", title: "Variant architecture for differentiated project needs." },
    { image: "/assets/images/site/rad-truck-load.jpg", alt: "Cooling unit loaded onto a delivery truck", title: "Execution closes with logistics discipline." },
  ],
} satisfies CollectionDef;

export const COLLECTIONS: CollectionDef[] = [MACHINERY_GALLERY, MADRID_GALLERY, PROJECTS, PROJECT_SNAPSHOTS];
