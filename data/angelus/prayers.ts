import type { Prayer } from "@/lib/sequence/types";
import { ROSARY_PRAYERS } from "@/data/rosary/prayers";

export const ANGELUS_PRAYERS: Record<string, Prayer> = {
  "hail-mary": ROSARY_PRAYERS["hail-mary"],
  "angelus-annunciation": {
    id: "angelus-annunciation",
    name: "The Annunciation",
    text: ["V. The Angel of the Lord declared unto Mary.", "R. And she conceived of the Holy Spirit."],
    learn: "The angel Gabriel’s message to Mary (Luke 1:26–38). The leader says the first line, the response follows.",
  },
  "angelus-fiat": {
    id: "angelus-fiat",
    name: "Mary’s Yes",
    text: ["V. Behold the handmaid of the Lord.", "R. Be it done unto me according to your word."],
    learn: "Mary’s consent to God’s plan (Luke 1:38).",
  },
  "angelus-incarnation": {
    id: "angelus-incarnation",
    name: "The Incarnation",
    text: ["V. And the Word was made flesh.", "R. And dwelt among us."],
    learn: "The mystery of Christmas, from the prologue of John’s Gospel (John 1:14).",
  },
  "angelus-intercession": {
    id: "angelus-intercession",
    name: "Pray for Us",
    text: ["V. Pray for us, O holy Mother of God.", "R. That we may be made worthy of the promises of Christ."],
    learn: "A request for Mary’s prayers, said after the three Hail Marys.",
  },
  "angelus-closing": {
    id: "angelus-closing",
    name: "Let Us Pray",
    text: [
      "Let us pray. Pour forth, we beseech You, O Lord, Your grace into our hearts; that we, to whom the Incarnation of Christ, Your Son, was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection. Through the same Christ our Lord. Amen.",
    ],
    learn: "The closing collect. It joins Christ’s Incarnation to His Passion and Resurrection.",
  },
};
