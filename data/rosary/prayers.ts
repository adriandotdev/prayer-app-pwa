import type { Prayer } from "@/lib/sequence/types";

export const ROSARY_PRAYERS: Record<string, Prayer> = {
  "sign-of-the-cross": {
    id: "sign-of-the-cross",
    name: "Sign of the Cross",
    text: ["In the name of the Father, and of the Son, and of the Holy Spirit. Amen."],
    learn:
      "Touch your forehead, chest, then left and right shoulder. It begins every prayer by placing it under the Holy Trinity.",
  },
  creed: {
    id: "creed",
    name: "The Apostles’ Creed",
    text: [
      "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead.",
      "I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
    ],
    learn: "Said on the crucifix. It is a summary of the faith, and the foundation on which the Rosary rests.",
  },
  "our-father": {
    id: "our-father",
    name: "Our Father",
    text: [
      "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven.",
      "Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
    ],
    learn: "The prayer Jesus taught his disciples (Matthew 6:9–13). It is said on each large bead.",
  },
  "hail-mary": {
    id: "hail-mary",
    name: "Hail Mary",
    text: [
      "Hail Mary, full of grace, the Lord is with thee; blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus.",
      "Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
    ],
    learn:
      "Built from the angel’s greeting and Elizabeth’s blessing (Luke 1), joined to a petition for Mary’s prayers. Let the words rest while you meditate on the mystery.",
  },
  "glory-be": {
    id: "glory-be",
    name: "Glory Be",
    text: [
      "Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.",
    ],
    learn: "A short doxology giving praise to the Trinity.",
  },
  fatima: {
    id: "fatima",
    name: "Fatima Prayer",
    text: [
      "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those who are most in need of thy mercy. Amen.",
    ],
    learn: "Given at Fatima in 1917 and commonly said after the Glory Be at the end of each decade.",
  },
  "hail-holy-queen": {
    id: "hail-holy-queen",
    name: "Hail, Holy Queen",
    text: [
      "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears.",
      "Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.",
    ],
    learn: "An ancient antiphon of trust in Mary’s motherly care, said on the medal after the fifth decade.",
  },
  "closing-prayer": {
    id: "closing-prayer",
    name: "Closing Prayer",
    text: [
      "V. Pray for us, O holy Mother of God.",
      "R. That we may be made worthy of the promises of Christ.",
      "Let us pray. O God, whose only-begotten Son, by his life, death and resurrection, has purchased for us the rewards of eternal life, grant, we beseech thee, that meditating on these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.",
    ],
    learn: "The traditional collect that gathers up the whole Rosary.",
  },
};
