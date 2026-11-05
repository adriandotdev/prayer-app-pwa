import type { Prayer } from "@/lib/sequence/types";
import { ROSARY_PRAYERS } from "@/data/rosary/prayers";

export const DIVINE_MERCY_PRAYERS: Record<string, Prayer> = {
  "sign-of-the-cross": ROSARY_PRAYERS["sign-of-the-cross"],
  "our-father": ROSARY_PRAYERS["our-father"],
  "hail-mary": ROSARY_PRAYERS["hail-mary"],
  creed: ROSARY_PRAYERS.creed,
  "opening-prayer": {
    id: "opening-prayer",
    name: "Opening Prayer",
    text: [
      "Jesus, you died, yet from your death flowed a spring of life for souls, and a sea of mercy opened for the whole world. Fountain of life, mercy beyond understanding, cover the whole world and pour yourself out on us.",
    ],
    learn: "An optional prayer from St. Faustina’s Diary that opens the chaplet at the foot of the Cross.",
  },
  "blood-and-water": {
    id: "blood-and-water",
    name: "O Blood and Water",
    text: [
      "Blood and water that poured from the Heart of Jesus as a spring of mercy for us, I trust in you.",
    ],
    learn: "Said three times. It looks to the blood and water that flowed from Christ’s pierced side (John 19:34).",
  },
  "eternal-father": {
    id: "eternal-father",
    name: "Eternal Father",
    text: [
      "Eternal Father, I offer you the Body and Blood, the Soul and Divinity, of your beloved Son, our Lord Jesus Christ, to make amends for our sins and the sins of the whole world.",
    ],
    learn: "Said once on each large bead. It offers Christ’s sacrifice to the Father for the whole world.",
  },
  "sorrowful-passion": {
    id: "sorrowful-passion",
    name: "For the Sake of His Sorrowful Passion",
    text: ["Because of his suffering and death, be merciful to us and to the whole world."],
    learn: "Said ten times on the small beads of each decade, in place of the Hail Marys of the Rosary.",
  },
  "holy-god": {
    id: "holy-god",
    name: "Holy God",
    text: ["Holy God, holy and strong, holy and deathless, be merciful to us and to the whole world."],
    learn: "Said three times after the five decades. It echoes the ancient Trisagion.",
  },
  "closing-prayer": {
    id: "closing-prayer",
    name: "Closing Prayer",
    text: [
      "Eternal God, whose mercy has no end and whose compassion never runs dry, look kindly on us and grow your mercy within us. In hard times, keep us from despair and discouragement, and help us trust you and place ourselves in your holy will, which is love and mercy itself. Amen.",
    ],
    learn: "An optional prayer of trust that closes the chaplet.",
  },
};
