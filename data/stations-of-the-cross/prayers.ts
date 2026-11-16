import type { Prayer } from "@/lib/sequence/types";
import { ROSARY_PRAYERS } from "@/data/rosary/prayers";

export type Station = {
  name: string;
  /** Scripture reference, or "Tradition" for stations the Gospels do not narrate. */
  reference: string;
  /** What happens at this station, for Learn mode. */
  scene: string;
  /** The prayer said at this station. */
  prayer: string;
  fruit: string;
};

/** The fourteen traditional stations. Scenes and prayers are original wording written for the app. */
export const STATIONS: Station[] = [
  {
    name: "Jesus Is Condemned to Death",
    reference: "Mark 15:12–15",
    scene: "Pilate hands Jesus over to be crucified, though he finds no crime in him.",
    prayer: "Lord Jesus, you were judged and condemned though you were innocent. Keep me from joining the crowd against the weak, and give me courage to speak for what is true.",
    fruit: "Courage to do what is right",
  },
  {
    name: "Jesus Takes Up His Cross",
    reference: "John 19:16–17",
    scene: "Jesus receives the cross and begins the road to Calvary.",
    prayer: "Lord Jesus, you took up your cross freely and for love of us. Help me to carry what is given me today without bitterness, and to walk it with you.",
    fruit: "Patience in carrying our crosses",
  },
  {
    name: "Jesus Falls the First Time",
    reference: "Tradition",
    scene: "Weakened by the scourging, Jesus falls beneath the weight of the cross.",
    prayer: "Lord Jesus, you fell under the weight of our sins. When I stumble, lift me up, and let me never be ashamed to begin again.",
    fruit: "Humility, and the courage to rise again",
  },
  {
    name: "Jesus Meets His Mother",
    reference: "Luke 2:35; John 19:25",
    scene: "Jesus and Mary meet on the road. Her heart is pierced as Simeon foretold.",
    prayer: "Lord Jesus, your mother met you on the road and did not leave you. Give me the faithfulness to stay beside those who suffer, even when I cannot take their pain away.",
    fruit: "Compassion for those who suffer",
  },
  {
    name: "Simon of Cyrene Helps Jesus",
    reference: "Luke 23:26",
    scene: "The soldiers press Simon, a passer-by, into carrying the cross behind Jesus.",
    prayer: "Lord Jesus, Simon was made to carry your cross, and found himself near you. Make me ready to share the burdens of others, and willing when the help is not convenient.",
    fruit: "Generosity in helping others",
  },
  {
    name: "Veronica Wipes the Face of Jesus",
    reference: "Tradition",
    scene: "According to tradition, a woman steps from the crowd and wipes the face of Jesus.",
    prayer: "Lord Jesus, Veronica offered a small kindness and received your face in return. Let me see you in everyone who is tired and wounded, and let me do the small good that is in front of me.",
    fruit: "Kindness shown without fear",
  },
  {
    name: "Jesus Falls the Second Time",
    reference: "Tradition",
    scene: "Jesus falls again, and rises again.",
    prayer: "Lord Jesus, you fell again and still went on. When I fail in the same place a second time, do not let me give up, but hold me to the road.",
    fruit: "Perseverance after repeated failure",
  },
  {
    name: "Jesus Speaks to the Women of Jerusalem",
    reference: "Luke 23:27–31",
    scene: "Women weep as he passes. Jesus tells them to weep also for themselves and their children.",
    prayer: "Lord Jesus, even in your suffering you thought of others. Turn my tears into repentance and my sympathy into action for those in need.",
    fruit: "Sorrow for sin and care for others",
  },
  {
    name: "Jesus Falls the Third Time",
    reference: "Tradition",
    scene: "Near the top of Calvary, Jesus falls once more, utterly exhausted.",
    prayer: "Lord Jesus, you fell a third time, with the end almost in sight. When I am tired and ready to stop, give me strength for the last steps.",
    fruit: "Strength when we are worn out",
  },
  {
    name: "Jesus Is Stripped of His Garments",
    reference: "John 19:23–24",
    scene: "The soldiers take his clothes and cast lots for them.",
    prayer: "Lord Jesus, you were stripped of everything, even your dignity. Free me from clinging to possessions and from fear of what others think, and teach me to trust you with all I have.",
    fruit: "Detachment, and respect for the dignity of every person",
  },
  {
    name: "Jesus Is Nailed to the Cross",
    reference: "Luke 23:33–34",
    scene: "Jesus is crucified, and prays for those who crucify him.",
    prayer: "Lord Jesus, you were nailed to the cross and still forgave. Where I hold a grudge, loosen it. Where I have wronged others, make me ask forgiveness.",
    fruit: "Forgiveness of those who hurt us",
  },
  {
    name: "Jesus Dies on the Cross",
    reference: "Luke 23:44–46",
    scene: "Darkness falls over the land. Jesus gives himself into the hands of his Father and dies.",
    prayer: "Lord Jesus, you gave your life for us. Into your hands I place my life and my death. Let me live in a way that is worthy of such love.",
    fruit: "Gratitude, and trust at the hour of death",
  },
  {
    name: "Jesus Is Taken Down from the Cross",
    reference: "Mark 15:42–46",
    scene: "Joseph of Arimathea asks for the body of Jesus and takes it down from the cross.",
    prayer: "Lord Jesus, your body was laid in the arms of your mother. Comfort all who grieve today, and teach me to sit with them in their loss.",
    fruit: "Comfort for those who mourn",
  },
  {
    name: "Jesus Is Laid in the Tomb",
    reference: "John 19:40–42",
    scene: "The body of Jesus is wrapped in linen and laid in a new tomb as the Sabbath begins.",
    prayer: "Lord Jesus, you were laid in the silence of the tomb. When all seems finished and dark, keep me waiting in hope for the morning of your resurrection.",
    fruit: "Hope in the resurrection",
  },
];

export const STATIONS_PRAYERS: Record<string, Prayer> = {
  "sign-of-the-cross": ROSARY_PRAYERS["sign-of-the-cross"],
  "our-father": ROSARY_PRAYERS["our-father"],
  "hail-mary": ROSARY_PRAYERS["hail-mary"],
  "glory-be": ROSARY_PRAYERS["glory-be"],
  "stations-opening": {
    id: "stations-opening",
    name: "Opening Prayer",
    text: [
      "Lord Jesus, I walk with you the road you walked for me. Let me not only watch your passion but enter into it, so that what I see on the way of the cross may change how I live. Amen.",
    ],
    learn: "The Stations of the Cross follow Jesus from his condemnation to his burial in fourteen stops. You may pray them in any season, though they are especially kept in Lent and on Fridays.",
  },
  "stations-versicle": {
    id: "stations-versicle",
    name: "We Adore You",
    text: [
      "V. We adore you, O Christ, and we praise you.",
      "R. Because by your holy Cross you have redeemed the world.",
    ],
    learn: "Said at the start of every station, usually while kneeling or bowing.",
  },
  "stations-closing": {
    id: "stations-closing",
    name: "Closing Prayer",
    text: [
      "Lord Jesus, you have walked this road for love of us. Keep before my eyes what I have seen today, and help me to follow you with a faithful heart, through the cross to the resurrection. Amen.",
    ],
    learn: "A prayer to end the Stations and carry them into the rest of the day.",
  },
  ...Object.fromEntries(
    STATIONS.map((station, i): [string, Prayer] => [
      `station-${i + 1}`,
      {
        id: `station-${i + 1}`,
        name: station.name,
        text: [station.prayer],
        learn: station.scene,
      },
    ]),
  ),
};
