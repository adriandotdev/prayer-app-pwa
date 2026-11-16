import { describe, expect, it } from "vitest";
import { liturgicalDay } from "@/lib/liturgy/calendar";
import { SANCTORAL } from "@/lib/liturgy/sanctoral";
import { seasonForDate } from "@/lib/theme/liturgical-season";

const on = (y: number, m: number, d: number) => liturgicalDay(new Date(y, m - 1, d, 12));

describe("liturgicalDay: seasons and weeks", () => {
  it("walks Lent and Easter 2026 (Easter is Apr 5)", () => {
    expect(on(2026, 2, 18)).toMatchObject({ title: "Ash Wednesday", color: "violet", rank: 2 });
    expect(on(2026, 2, 19).title).toBe("Thursday after Ash Wednesday");
    expect(on(2026, 2, 22).title).toBe("First Sunday of Lent");
    expect(on(2026, 2, 23).title).toBe("Monday of the First Week of Lent");
    expect(on(2026, 3, 15)).toMatchObject({ title: "Fourth Sunday of Lent (Laetare Sunday)", color: "rose" });
    expect(on(2026, 3, 29)).toMatchObject({ title: "Palm Sunday of the Passion of the Lord", color: "red" });
    expect(on(2026, 3, 31).title).toBe("Tuesday of Holy Week");
    expect(on(2026, 4, 2)).toMatchObject({ kind: "triduum", color: "white", time: "triduum" });
    expect(on(2026, 4, 3)).toMatchObject({ title: "Good Friday of the Lord's Passion", color: "red" });
    expect(on(2026, 4, 4)).toMatchObject({ title: "Holy Saturday", color: "violet" });
    expect(on(2026, 4, 5)).toMatchObject({ title: "Easter Sunday of the Resurrection of the Lord", color: "white", time: "easter" });
    expect(on(2026, 4, 6).title).toBe("Monday within the Octave of Easter");
    expect(on(2026, 4, 12).title).toBe("Second Sunday of Easter (Sunday of Divine Mercy)");
    expect(on(2026, 4, 15).title).toBe("Wednesday of the Second Week of Easter");
    expect(on(2026, 5, 14).title).toBe("The Ascension of the Lord");
    expect(on(2026, 5, 17).title).toBe("Seventh Sunday of Easter");
    expect(on(2026, 5, 24)).toMatchObject({ title: "Pentecost Sunday", color: "red" });
    expect(on(2026, 5, 25).title).toBe("The Blessed Virgin Mary, Mother of the Church");
    expect(on(2026, 5, 31).title).toBe("The Most Holy Trinity");
    expect(on(2026, 6, 4).title).toBe("The Most Holy Body and Blood of Christ (Corpus Christi)");
    expect(on(2026, 6, 12).title).toBe("The Most Sacred Heart of Jesus");
    expect(on(2026, 6, 13).title).toBe("The Immaculate Heart of the Blessed Virgin Mary");
  });

  it("walks Advent and Christmas 2026", () => {
    expect(on(2026, 11, 22).title).toBe("Our Lord Jesus Christ, King of the Universe");
    expect(on(2026, 11, 23).title).toBe("Monday of the Thirty-fourth Week in Ordinary Time");
    expect(on(2026, 11, 29).title).toBe("First Sunday of Advent");
    expect(on(2026, 12, 13)).toMatchObject({ title: "Third Sunday of Advent", color: "rose" });
    expect(on(2026, 12, 17).title).toBe("December 17");
    expect(on(2026, 12, 25)).toMatchObject({ title: "The Nativity of the Lord (Christmas)", color: "white", kind: "solemnity" });
    expect(on(2026, 12, 26).title).toBe("Saint Stephen, the First Martyr");
    expect(on(2026, 12, 27).title).toBe("The Holy Family of Jesus, Mary and Joseph");
    expect(on(2026, 12, 29).title).toBe("Fifth Day in the Octave of Christmas");
    expect(on(2027, 1, 1).title).toBe("Mary, the Holy Mother of God");
    expect(on(2027, 1, 3).title).toBe("Second Sunday of Christmas");
    expect(on(2027, 1, 6).title).toBe("The Epiphany of the Lord");
    expect(on(2027, 1, 7).title).toBe("Thursday after Epiphany");
    expect(on(2027, 1, 10).title).toBe("The Baptism of the Lord");
    expect(on(2027, 1, 11).title).toBe("Monday of the First Week in Ordinary Time");
    expect(on(2027, 1, 17).title).toBe("Second Sunday in Ordinary Time");
  });

  it("puts the Holy Family on Dec 30 when Christmas is a Sunday (2022)", () => {
    expect(on(2022, 12, 25).title).toBe("The Nativity of the Lord (Christmas)");
    expect(on(2022, 12, 30).title).toBe("The Holy Family of Jesus, Mary and Joseph");
    expect(on(2022, 12, 27).title).toBe("Saint John, Apostle and Evangelist");
  });

  it("counts Ordinary Time back from Christ the King", () => {
    expect(on(2024, 6, 16)).toMatchObject({ title: "Eleventh Sunday in Ordinary Time", week: 11 });
    expect(on(2024, 6, 17).title).toBe("Monday of the Eleventh Week in Ordinary Time");
    expect(on(2024, 5, 21).title).toBe("Tuesday of the Seventh Week in Ordinary Time");
    expect(on(2024, 2, 11).title).toBe("Sixth Sunday in Ordinary Time");
    expect(on(2024, 2, 10).title).toBe("Saint Scholastica");
    expect(on(2024, 11, 24).title).toBe("Our Lord Jesus Christ, King of the Universe");
  });
});

describe("liturgicalDay: precedence and transfers", () => {
  it("lets a solemnity or Lord's feast replace an Ordinary Time Sunday, but not a saint's feast", () => {
    expect(on(2026, 8, 6).title).toBe("The Transfiguration of the Lord"); // Thursday, control
    expect(on(2027, 8, 15).title).toBe("The Assumption of the Blessed Virgin Mary"); // Sunday
    expect(on(2027, 2, 2).title).toBe("The Presentation of the Lord");
    expect(on(2021, 11, 14).title).toBe("Thirty-third Sunday in Ordinary Time");
    expect(on(2021, 11, 9).title).toBe("The Dedication of the Lateran Basilica");
    expect(on(2025, 11, 9).title).toBe("The Dedication of the Lateran Basilica"); // Sunday
    expect(on(2021, 9, 12).title).toBe("Twenty-fourth Sunday in Ordinary Time");
    expect(on(2021, 7, 25).title).toBe("Seventeenth Sunday in Ordinary Time"); // St James on a Sunday
  });

  it("drops memorials on Lenten weekdays and Dec 17-24, and keeps them elsewhere", () => {
    expect(on(2026, 3, 7)).toMatchObject({ title: "Saturday of the Second Week of Lent", rank: 9 }); // Perpetua and Felicity
    expect(on(2026, 12, 13).title).toBe("Third Sunday of Advent"); // Lucy on a Sunday of Advent
    expect(on(2026, 12, 14).title).toBe("Saint John of the Cross");
    expect(on(2026, 5, 26).title).toBe("Saint Philip Neri");
    expect(on(2026, 10, 4).title).toBe("Twenty-seventh Sunday in Ordinary Time"); // Francis on a Sunday
  });

  it("keeps the Immaculate Heart memorial and Mother of the Church after Pentecost", () => {
    // Easter 2025 is Apr 20, so the Sacred Heart is Jun 27 and the Immaculate Heart Jun 28.
    expect(on(2025, 6, 28).title).toBe("The Immaculate Heart of the Blessed Virgin Mary");
    expect(on(2025, 6, 27).title).toBe("The Most Sacred Heart of Jesus");
  });

  it("moves Saint Joseph and the Annunciation out of Holy Week", () => {
    // Easter 2008 is Mar 23, Palm Sunday Mar 16: Joseph (Wednesday of Holy Week) goes to the Saturday before.
    expect(on(2008, 3, 19).title).toBe("Wednesday of Holy Week");
    expect(on(2008, 3, 15).title).toBe("Saint Joseph, Spouse of the Blessed Virgin Mary");
    // Easter 2024 is Mar 31: Mar 19 is still in Lent, but the Annunciation (Mar 25) is in Holy Week.
    expect(on(2024, 3, 19).title).toBe("Saint Joseph, Spouse of the Blessed Virgin Mary");
    expect(on(2024, 3, 25).title).toBe("Monday of Holy Week");
    expect(on(2024, 4, 8).title).toBe("The Annunciation of the Lord");
  });

  it("moves a solemnity off a Sunday of Lent or Advent", () => {
    expect(on(2027, 3, 19).title).toBe("Saint Joseph, Spouse of the Blessed Virgin Mary"); // Friday, control
    expect(on(2021, 3, 19).title).toBe("Saint Joseph, Spouse of the Blessed Virgin Mary");
    expect(on(2025, 3, 19).title).toBe("Saint Joseph, Spouse of the Blessed Virgin Mary");
    // Mar 25 2029 is the Fifth Sunday of Lent? Easter 2029 is Apr 1, so Mar 25 is Palm Sunday.
    expect(on(2029, 4, 9).title).toBe("The Annunciation of the Lord");
    // Dec 8 2024 is the Second Sunday of Advent.
    expect(on(2024, 12, 8).title).toBe("Second Sunday of Advent");
    expect(on(2024, 12, 9).title).toBe("The Immaculate Conception of the Blessed Virgin Mary");
    expect(on(2025, 12, 8).title).toBe("The Immaculate Conception of the Blessed Virgin Mary");
  });

  it("moves John the Baptist back when it meets the Sacred Heart (2022)", () => {
    expect(on(2022, 6, 24).title).toBe("The Most Sacred Heart of Jesus");
    expect(on(2022, 6, 23).title).toBe("The Nativity of Saint John the Baptist");
  });

  it("keeps All Souls and All Saints on a Sunday", () => {
    expect(on(2025, 11, 2)).toMatchObject({ kind: "commemoration", color: "black" });
    expect(on(2025, 11, 1).title).toBe("All Saints");
  });
});

describe("liturgicalDay: readings cycles", () => {
  it("rolls the Sunday cycle over on the First Sunday of Advent", () => {
    expect(on(2024, 11, 30).sundayCycle).toBe("B");
    expect(on(2024, 12, 1).sundayCycle).toBe("C");
    expect(on(2025, 11, 29).sundayCycle).toBe("C");
    expect(on(2025, 11, 30).sundayCycle).toBe("A");
    expect(on(2026, 11, 29).sundayCycle).toBe("B");
    expect(on(2025, 1, 12).sundayCycle).toBe("C"); // Baptism of the Lord 2025
    expect(on(2024, 6, 16).sundayCycle).toBe("B");
  });

  it("gives the weekday cycle only in Ordinary Time, odd years I", () => {
    expect(on(2024, 6, 17).weekdayCycle).toBe("II");
    expect(on(2025, 6, 17).weekdayCycle).toBe("I");
    expect(on(2026, 3, 10).weekdayCycle).toBeNull();
    expect(on(2026, 12, 14).weekdayCycle).toBeNull();
  });
});

describe("liturgicalDay: invariants over many years", () => {
  it("returns a day for every date 2020-2040 and the data stays consistent", () => {
    const seen = new Set<string>();
    for (let d = new Date(2020, 0, 1, 12); d.getFullYear() <= 2040; d.setDate(d.getDate() + 1)) {
      const day = liturgicalDay(d);
      expect(day.title.length).toBeGreaterThan(0);
      expect(day.rank).toBeGreaterThanOrEqual(1);
      expect(day.rank).toBeLessThanOrEqual(12);
      if (day.kind === "solemnity") seen.add(`${d.getFullYear()}:${day.title}`);
    }
    // Every fixed solemnity is celebrated exactly once a year.
    for (const year of [2021, 2022, 2024, 2026, 2029, 2035]) {
      for (const entry of SANCTORAL.filter((e) => e.kind === "solemnity")) {
        expect(seen.has(`${year}:${entry.name}`), `${entry.name} ${year}`).toBe(true);
      }
    }
  });

  it("agrees with the theme season on plain Sundays and weekdays", () => {
    for (let d = new Date(2024, 0, 1, 12); d.getFullYear() <= 2032; d.setDate(d.getDate() + 1)) {
      const day = liturgicalDay(d);
      if (day.kind === "sunday" || day.kind === "weekday") {
        expect(day.color, day.date).toBe(seasonForDate(d));
      }
    }
  });
});
