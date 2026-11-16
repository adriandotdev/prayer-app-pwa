import type { Season } from "@/lib/theme/liturgical-season";

/**
 * Fixed-date celebrations of the General Roman Calendar (universal, not a national or diocesan one):
 * solemnities, feasts, obligatory memorials, and All Souls. Optional memorials are not included.
 */
export type SanctoralKind = "solemnity" | "feast" | "memorial" | "commemoration";

export interface SanctoralEntry {
  month: number;
  day: number;
  name: string;
  kind: SanctoralKind;
  color: Season;
  /** A feast of the Lord: it outranks an Ordinary Time Sunday, a feast of a saint does not. */
  lord?: boolean;
  id?: string;
}

const solemnity = (month: number, day: number, name: string, color: Season = "white", id?: string): SanctoralEntry => ({ month, day, name, kind: "solemnity", color, id });
const feast = (month: number, day: number, name: string, color: Season = "white"): SanctoralEntry => ({ month, day, name, kind: "feast", color });
const lordFeast = (month: number, day: number, name: string): SanctoralEntry => ({ month, day, name, kind: "feast", color: "white", lord: true });
const memorial = (month: number, day: number, name: string, color: Season = "white"): SanctoralEntry => ({ month, day, name, kind: "memorial", color });

export const SANCTORAL: readonly SanctoralEntry[] = [
  // January
  solemnity(1, 1, "Mary, the Holy Mother of God"),
  memorial(1, 2, "Saints Basil the Great and Gregory Nazianzen"),
  solemnity(1, 6, "The Epiphany of the Lord"),
  memorial(1, 17, "Saint Anthony, Abbot"),
  memorial(1, 21, "Saint Agnes", "red"),
  memorial(1, 24, "Saint Francis de Sales"),
  feast(1, 25, "The Conversion of Saint Paul the Apostle"),
  memorial(1, 26, "Saints Timothy and Titus"),
  memorial(1, 28, "Saint Thomas Aquinas"),
  memorial(1, 31, "Saint John Bosco"),
  // February
  lordFeast(2, 2, "The Presentation of the Lord"),
  memorial(2, 5, "Saint Agatha", "red"),
  memorial(2, 6, "Saint Paul Miki and Companions", "red"),
  memorial(2, 10, "Saint Scholastica"),
  memorial(2, 14, "Saints Cyril and Methodius"),
  feast(2, 22, "The Chair of Saint Peter the Apostle"),
  memorial(2, 23, "Saint Polycarp", "red"),
  // March
  memorial(3, 7, "Saints Perpetua and Felicity", "red"),
  solemnity(3, 19, "Saint Joseph, Spouse of the Blessed Virgin Mary", "white", "joseph"),
  solemnity(3, 25, "The Annunciation of the Lord", "white", "annunciation"),
  // April
  memorial(4, 7, "Saint John Baptist de La Salle"),
  memorial(4, 11, "Saint Stanislaus", "red"),
  feast(4, 25, "Saint Mark the Evangelist", "red"),
  memorial(4, 29, "Saint Catherine of Siena"),
  // May
  memorial(5, 2, "Saint Athanasius"),
  feast(5, 3, "Saints Philip and James, Apostles", "red"),
  feast(5, 14, "Saint Matthias the Apostle", "red"),
  memorial(5, 26, "Saint Philip Neri"),
  feast(5, 31, "The Visitation of the Blessed Virgin Mary"),
  // June
  memorial(6, 1, "Saint Justin", "red"),
  memorial(6, 3, "Saints Charles Lwanga and Companions", "red"),
  memorial(6, 5, "Saint Boniface", "red"),
  memorial(6, 11, "Saint Barnabas the Apostle", "red"),
  memorial(6, 13, "Saint Anthony of Padua"),
  memorial(6, 21, "Saint Aloysius Gonzaga"),
  solemnity(6, 24, "The Nativity of Saint John the Baptist", "white", "john-baptist"),
  memorial(6, 28, "Saint Irenaeus", "red"),
  solemnity(6, 29, "Saints Peter and Paul, Apostles", "red", "peter-paul"),
  // July
  feast(7, 3, "Saint Thomas the Apostle", "red"),
  memorial(7, 11, "Saint Benedict"),
  memorial(7, 15, "Saint Bonaventure"),
  feast(7, 22, "Saint Mary Magdalene"),
  feast(7, 25, "Saint James the Apostle", "red"),
  memorial(7, 26, "Saints Joachim and Anne"),
  memorial(7, 29, "Saints Martha, Mary and Lazarus"),
  memorial(7, 31, "Saint Ignatius of Loyola"),
  // August
  memorial(8, 1, "Saint Alphonsus Liguori"),
  memorial(8, 4, "Saint John Vianney"),
  lordFeast(8, 6, "The Transfiguration of the Lord"),
  memorial(8, 8, "Saint Dominic"),
  feast(8, 10, "Saint Lawrence", "red"),
  memorial(8, 11, "Saint Clare"),
  memorial(8, 14, "Saint Maximilian Mary Kolbe", "red"),
  solemnity(8, 15, "The Assumption of the Blessed Virgin Mary"),
  memorial(8, 20, "Saint Bernard"),
  memorial(8, 21, "Saint Pius X"),
  memorial(8, 22, "The Queenship of the Blessed Virgin Mary"),
  feast(8, 24, "Saint Bartholomew the Apostle", "red"),
  memorial(8, 27, "Saint Monica"),
  memorial(8, 28, "Saint Augustine"),
  memorial(8, 29, "The Passion of Saint John the Baptist", "red"),
  // September
  memorial(9, 3, "Saint Gregory the Great"),
  feast(9, 8, "The Nativity of the Blessed Virgin Mary"),
  memorial(9, 13, "Saint John Chrysostom"),
  lordFeast(9, 14, "The Exaltation of the Holy Cross"),
  memorial(9, 15, "Our Lady of Sorrows"),
  memorial(9, 16, "Saints Cornelius and Cyprian", "red"),
  memorial(9, 20, "Saints Andrew Kim Tae-gon, Paul Chong Ha-sang and Companions", "red"),
  feast(9, 21, "Saint Matthew, Apostle and Evangelist", "red"),
  memorial(9, 23, "Saint Pius of Pietrelcina"),
  memorial(9, 27, "Saint Vincent de Paul"),
  feast(9, 29, "Saints Michael, Gabriel and Raphael, Archangels"),
  memorial(9, 30, "Saint Jerome"),
  // October
  memorial(10, 1, "Saint Thérèse of the Child Jesus"),
  memorial(10, 2, "The Holy Guardian Angels"),
  memorial(10, 4, "Saint Francis of Assisi"),
  memorial(10, 7, "Our Lady of the Rosary"),
  memorial(10, 15, "Saint Teresa of Jesus"),
  memorial(10, 17, "Saint Ignatius of Antioch", "red"),
  feast(10, 18, "Saint Luke the Evangelist", "red"),
  feast(10, 28, "Saints Simon and Jude, Apostles", "red"),
  // November
  solemnity(11, 1, "All Saints"),
  { month: 11, day: 2, name: "The Commemoration of All the Faithful Departed (All Souls)", kind: "commemoration", color: "black" },
  memorial(11, 4, "Saint Charles Borromeo"),
  lordFeast(11, 9, "The Dedication of the Lateran Basilica"),
  memorial(11, 10, "Saint Leo the Great"),
  memorial(11, 11, "Saint Martin of Tours"),
  memorial(11, 12, "Saint Josaphat", "red"),
  memorial(11, 17, "Saint Elizabeth of Hungary"),
  memorial(11, 21, "The Presentation of the Blessed Virgin Mary"),
  memorial(11, 22, "Saint Cecilia", "red"),
  memorial(11, 24, "Saint Andrew Dung-Lac and Companions", "red"),
  feast(11, 30, "Saint Andrew the Apostle", "red"),
  // December
  memorial(12, 3, "Saint Francis Xavier"),
  memorial(12, 7, "Saint Ambrose"),
  solemnity(12, 8, "The Immaculate Conception of the Blessed Virgin Mary", "white", "immaculate-conception"),
  memorial(12, 13, "Saint Lucy", "red"),
  memorial(12, 14, "Saint John of the Cross"),
  feast(12, 26, "Saint Stephen, the First Martyr", "red"),
  feast(12, 27, "Saint John, Apostle and Evangelist"),
  feast(12, 28, "The Holy Innocents, Martyrs", "red"),
];

export function sanctoralRank(entry: SanctoralEntry): number {
  switch (entry.kind) {
    case "solemnity":
    case "commemoration":
      return 3;
    case "feast":
      return entry.lord ? 5 : 7;
    case "memorial":
      return 10;
  }
}
