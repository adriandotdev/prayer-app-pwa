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
      "You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.",
    ],
    learn: "An optional prayer from St. Faustina’s Diary that opens the chaplet at the foot of the Cross.",
  },
  "blood-and-water": {
    id: "blood-and-water",
    name: "O Blood and Water",
    text: [
      "O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You!",
    ],
    learn: "Said three times. It looks to the blood and water that flowed from Christ’s pierced side (John 19:34).",
  },
  "eternal-father": {
    id: "eternal-father",
    name: "Eternal Father",
    text: [
      "Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord, Jesus Christ, in atonement for our sins and those of the whole world.",
    ],
    learn: "Said once on each large bead. It offers Christ’s sacrifice to the Father for the whole world.",
  },
  "sorrowful-passion": {
    id: "sorrowful-passion",
    name: "For the Sake of His Sorrowful Passion",
    text: ["For the sake of His sorrowful Passion, have mercy on us and on the whole world."],
    learn: "Said ten times on the small beads of each decade, in place of the Hail Marys of the Rosary.",
  },
  "holy-god": {
    id: "holy-god",
    name: "Holy God",
    text: ["Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world."],
    learn: "Said three times after the five decades. It echoes the ancient Trisagion.",
  },
  "closing-prayer": {
    id: "closing-prayer",
    name: "Closing Prayer",
    text: [
      "Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible, look kindly upon us and increase Your mercy in us, that in difficult moments we might not despair nor become despondent, but with great confidence submit ourselves to Your holy will, which is Love and Mercy itself. Amen.",
    ],
    learn: "An optional prayer of trust that closes the chaplet.",
  },
};
