import type { MysterySetId } from "@/data/rosary/mysteries";

export type Art = { src: string; width: number; height: number; alt: string };

const art = (name: string, width: number, height: number, alt: string): Art => ({
  src: `/landing/${name}.webp`,
  width,
  height,
  alt,
});

export const EMPYREAN = art(
  "empyrean",
  1800,
  2247,
  "Gustave Doré’s engraving of the Empyrean: countless angels wheel in a vast rose around a point of light, printed here in gold on deep blue.",
);
export const EMPYREAN_ROSE = art("empyrean-rose", 1100, 1100, "");

export const CORONATION_FRESCO = art(
  "coronation",
  1800,
  2130,
  "Fra Angelico’s fresco of Christ crowning Mary in a pale sky, with Saints Dominic, Francis and others kneeling below.",
);
export const DOMINIC = art(
  "dominic",
  1100,
  1569,
  "Saint Dominic, in Fra Angelico’s fresco, lifting his eyes toward the Cross.",
);
export const ANNUNCIATION_ALTARPIECE = art(
  "annunciation-prado",
  2600,
  1633,
  "Fra Angelico’s Annunciation: the angel Gabriel bows before Mary beneath a blue vault scattered with gold stars.",
);
export const VIRGIN = art(
  "annunciation",
  452,
  828,
  "Giotto’s Mary kneeling with her arms crossed, receiving the angel’s message.",
);
export const FRANCIS = art(
  "francis",
  1100,
  1337,
  "Giotto’s Saint Francis on Mount La Verna, kneeling before a seraph against a gold ground.",
);
export const CORONATION_PANEL = art(
  "coronation-a",
  1800,
  1282,
  "Fra Angelico’s panel of Christ crowning Mary, her blue mantle spread on a gold ground.",
);
export const BLESSING = art(
  "blessing",
  1100,
  1103,
  "Giotto’s Christ giving a blessing, from a roundel on the starred blue vault of the Scrovegni Chapel.",
);

/** One painting per mystery, in the order of `MYSTERY_SETS[id].mysteries`. */
export const MYSTERY_ART: Record<MysterySetId, [Art, Art, Art, Art, Art]> = {
  joyful: [
    art("annunciation", 452, 828, "Giotto: Mary receiving the angel’s message."),
    art("visitation", 681, 803, "Giotto: Mary and Elizabeth embracing."),
    art("nativity", 743, 751, "Giotto: Mary laying the newborn Jesus in the manger, with angels above."),
    art("presentation", 492, 500, "Giotto: Mary and Joseph presenting the child Jesus to Simeon in the Temple."),
    art("finding", 711, 699, "Giotto: the boy Jesus seated among the teachers in the Temple."),
  ],
  luminous: [
    art("baptism", 639, 553, "Giotto: John baptizing Jesus in the Jordan as the Father appears above."),
    art("cana", 612, 576, "Giotto: the wedding feast at Cana, with servants at the great water jars."),
    art("proclamation", 1100, 1043, "Fra Angelico: Jesus teaching the apostles on the mountain."),
    art("transfiguration", 858, 1128, "Fra Angelico: Jesus transfigured in white, arms outstretched, the apostles falling below."),
    art("supper", 685, 647, "Giotto: Jesus at table with the apostles at the Last Supper."),
  ],
  sorrowful: [
    art("agony", 1100, 1380, "Fra Angelico: Jesus praying in the garden of Gethsemane while the apostles sleep."),
    art("scourging", 902, 761, "Giotto: Jesus seated and struck by soldiers in the scene of his mocking and scourging."),
    art("thorns", 806, 1056, "Fra Angelico: Jesus enthroned and blindfolded, crowned with thorns, with Mary and Saint Dominic below."),
    art("carrying", 754, 716, "Giotto: Jesus carrying the Cross toward Calvary among the crowd."),
    art("crucifixion", 874, 798, "Giotto: Jesus on the Cross with grieving angels above and Mary below."),
  ],
  glorious: [
    art("resurrection", 804, 690, "Giotto: the risen Jesus with Mary Magdalene beside the empty tomb."),
    art("ascension", 632, 576, "Giotto: Jesus rising into a blue heaven above the apostles and Mary."),
    art("pentecost", 673, 592, "Giotto: the apostles gathered under Gothic arches as the Spirit descends."),
    art("assumption", 1100, 1800, "Fra Angelico: Mary carried into heaven among choirs of angels."),
    art("coronation", 1800, 2130, "Fra Angelico: Christ crowning Mary, with saints kneeling below."),
  ],
};

/** Shown small in the footer. Every picture is a public-domain work via Wikimedia Commons. */
export const ART_CREDIT = "Art: Gustave Doré; Giotto, Scrovegni Chapel; Fra Angelico. Public domain, via Wikimedia Commons.";
