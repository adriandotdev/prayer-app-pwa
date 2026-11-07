import type { Prayer } from "@/lib/sequence/types";
import { ROSARY_PRAYERS } from "@/data/rosary/prayers";

export type Sorrow = {
  name: string;
  reference: string;
  meditation: string;
  fruit: string;
};

/** The seven sorrows of Mary (Servite devotion). Meditations are original paraphrases, not quoted translations. */
export const SORROWS: Sorrow[] = [
  {
    name: "The Prophecy of Simeon",
    reference: "Luke 2:34–35",
    meditation:
      "Mary brings her child to the Temple, and the old man Simeon tells her that a sword will pierce her own soul. In the middle of her joy she is told that love will cost her.",
    fruit: "Trust in God when joy and sorrow come together",
  },
  {
    name: "The Flight into Egypt",
    reference: "Matthew 2:13–15",
    meditation:
      "Warned in a dream, Joseph rises in the night and takes Mary and the child away from Herod’s anger. They leave their home and become refugees in a foreign land.",
    fruit: "Faith to follow God into the unknown",
  },
  {
    name: "The Loss of Jesus in the Temple",
    reference: "Luke 2:43–45",
    meditation:
      "On the way home from Jerusalem, Mary and Joseph find that Jesus is not with the travelers. For three days they search for him in anxiety and fear.",
    fruit: "Seeking Jesus again after we have lost sight of him",
  },
  {
    name: "Mary Meets Jesus on the Way of the Cross",
    reference: "Luke 23:27",
    meditation:
      "Along the road to Calvary, Mary sees her son bearing his cross. She cannot lift it from him, but she does not turn away.",
    fruit: "Faithfulness to those who suffer",
  },
  {
    name: "The Crucifixion",
    reference: "John 19:25–27",
    meditation:
      "Mary stands at the foot of the cross while Jesus dies. From the cross he entrusts her to his disciple, and the disciple to her.",
    fruit: "Steadfast love, and a place in Mary’s care",
  },
  {
    name: "Jesus Is Taken Down from the Cross",
    reference: "Mark 15:42–46",
    meditation:
      "The lifeless body of Jesus is lowered from the cross and laid in the arms of his mother, as it was once laid there as a child.",
    fruit: "Compassion for the grieving",
  },
  {
    name: "The Burial of Jesus",
    reference: "John 19:40–42",
    meditation:
      "Jesus is wrapped in linen and laid in a new tomb, and the stone is rolled across. Mary goes home with her grief, and waits.",
    fruit: "Hope that waits in the silence",
  },
];

export const SEVEN_SORROWS_PRAYERS: Record<string, Prayer> = {
  "sign-of-the-cross": ROSARY_PRAYERS["sign-of-the-cross"],
  "hail-mary": {
    ...ROSARY_PRAYERS["hail-mary"],
    learn:
      "Seven Hail Marys are said for each sorrow. Keep the sorrow in mind as you pray, and let Mary’s company in it steady you.",
  },
  "sorrows-opening": {
    id: "sorrows-opening",
    name: "Opening Prayer",
    text: [
      "O Mary, Mother of Sorrows, I come to stand with you beneath the cross. Teach me to keep watch with you over the suffering of your Son, and to trust his mercy in every grief of my own. Amen.",
    ],
    learn: "A short prayer to begin. The chaplet remembers seven sorrows in the life of Mary, from Simeon’s prophecy to the burial of Jesus.",
  },
  "sorrows-tears": {
    ...ROSARY_PRAYERS["hail-mary"],
    id: "sorrows-tears",
    name: "Hail Mary",
    learn:
      "Three more Hail Marys are traditionally added at the end, in honor of the tears Mary shed, and for the grace of true repentance.",
  },
  "sorrows-intercession": {
    id: "sorrows-intercession",
    name: "Pray for Us",
    text: ["V. Mother of Sorrows, pray for us.", "R. That we may be made worthy of the promises of Christ."],
    learn: "A request for Mary’s prayers, said after the final Hail Marys.",
  },
  "sorrows-closing": {
    id: "sorrows-closing",
    name: "Closing Prayer",
    text: [
      "Lord Jesus Christ, your mother stood faithfully beside you in your passion. Grant that we, who remember her sorrows, may stay close to those who suffer, and so come with her to the joy of your resurrection. You live and reign for ever and ever. Amen.",
    ],
    learn: "A closing prayer joining Mary’s sorrows to the joy of the resurrection.",
  },
};
