export type MysterySetId = "joyful" | "sorrowful" | "glorious" | "luminous";

export type Mystery = {
  name: string;
  scripture: string;
  meditation: string;
  fruit: string;
};

export type MysterySet = {
  id: MysterySetId;
  name: string;
  mysteries: [Mystery, Mystery, Mystery, Mystery, Mystery];
};

export const MYSTERY_SETS: Record<MysterySetId, MysterySet> = {
  joyful: {
    id: "joyful",
    name: "Joyful Mysteries",
    mysteries: [
      {
        name: "The Annunciation",
        scripture: "Luke 1:26–38",
        meditation:
          "The angel Gabriel greets Mary, and she answers, “Behold, I am the handmaid of the Lord; be it done to me according to your word.”",
        fruit: "Humility",
      },
      {
        name: "The Visitation",
        scripture: "Luke 1:39–56",
        meditation:
          "Mary goes in haste to help her cousin Elizabeth. The child leaps in Elizabeth’s womb, and Mary sings the Magnificat.",
        fruit: "Love of neighbor",
      },
      {
        name: "The Nativity",
        scripture: "Luke 2:1–20",
        meditation:
          "Jesus is born in Bethlehem and laid in a manger. Shepherds, the poorest of men, are the first to kneel before him.",
        fruit: "Poverty of spirit",
      },
      {
        name: "The Presentation",
        scripture: "Luke 2:22–40",
        meditation:
          "Mary and Joseph offer Jesus in the Temple. Simeon takes him in his arms and calls him a light for all nations.",
        fruit: "Obedience and purity",
      },
      {
        name: "The Finding in the Temple",
        scripture: "Luke 2:41–52",
        meditation:
          "After three days of searching, Mary and Joseph find the boy Jesus among the teachers, about his Father’s business.",
        fruit: "Joy in finding Jesus",
      },
    ],
  },
  luminous: {
    id: "luminous",
    name: "Luminous Mysteries",
    mysteries: [
      {
        name: "The Baptism of Jesus",
        scripture: "Matthew 3:13–17",
        meditation:
          "In the Jordan the heavens open, the Spirit descends, and the Father declares, “This is my beloved Son.”",
        fruit: "Openness to the Holy Spirit",
      },
      {
        name: "The Wedding at Cana",
        scripture: "John 2:1–12",
        meditation:
          "Mary notices the need and tells the servants, “Do whatever he tells you.” Jesus changes water into wine.",
        fruit: "To Jesus through Mary",
      },
      {
        name: "The Proclamation of the Kingdom",
        scripture: "Mark 1:14–15",
        meditation:
          "Jesus proclaims, “The kingdom of God is at hand; repent and believe in the gospel,” and forgives sins.",
        fruit: "Repentance and trust in God",
      },
      {
        name: "The Transfiguration",
        scripture: "Luke 9:28–36",
        meditation:
          "On the mountain Jesus’ face shines like the sun, and the Father says, “This is my Son, my Chosen; listen to him.”",
        fruit: "Desire for holiness",
      },
      {
        name: "The Institution of the Eucharist",
        scripture: "Luke 22:14–20",
        meditation:
          "At the Last Supper Jesus gives his Body and Blood under bread and wine, and asks us to do this in memory of him.",
        fruit: "Adoration",
      },
    ],
  },
  sorrowful: {
    id: "sorrowful",
    name: "Sorrowful Mysteries",
    mysteries: [
      {
        name: "The Agony in the Garden",
        scripture: "Matthew 26:36–46",
        meditation:
          "In Gethsemane Jesus prays in anguish, “Not as I will, but as you will,” and entrusts himself to the Father.",
        fruit: "Sorrow for sin",
      },
      {
        name: "The Scourging at the Pillar",
        scripture: "John 19:1",
        meditation:
          "Jesus is bound and scourged. He bears our sins in his body, with silence and love.",
        fruit: "Purity",
      },
      {
        name: "The Crowning with Thorns",
        scripture: "Matthew 27:27–31",
        meditation:
          "Soldiers mock him, press a crown of thorns on his head, and hail him as king. He endures it without reply.",
        fruit: "Moral courage",
      },
      {
        name: "The Carrying of the Cross",
        scripture: "John 19:17",
        meditation:
          "Jesus takes up the cross and walks to Calvary. Simon of Cyrene is made to help him carry it.",
        fruit: "Patience in suffering",
      },
      {
        name: "The Crucifixion",
        scripture: "Luke 23:33–46",
        meditation:
          "Jesus forgives his executors, promises paradise to the thief, and says, “Father, into your hands I commit my spirit.”",
        fruit: "Perseverance and the salvation of souls",
      },
    ],
  },
  glorious: {
    id: "glorious",
    name: "Glorious Mysteries",
    mysteries: [
      {
        name: "The Resurrection",
        scripture: "Matthew 28:1–10",
        meditation:
          "The tomb is empty. Christ is risen, and tells the women, “Do not be afraid.”",
        fruit: "Faith",
      },
      {
        name: "The Ascension",
        scripture: "Acts 1:6–11",
        meditation:
          "Jesus is taken up to heaven, and promises to be with his disciples always, to the end of the age.",
        fruit: "Hope",
      },
      {
        name: "The Descent of the Holy Spirit",
        scripture: "Acts 2:1–13",
        meditation:
          "At Pentecost the Spirit descends on Mary and the apostles as tongues of fire, and the Church is born.",
        fruit: "Love of God",
      },
      {
        name: "The Assumption of Mary",
        scripture: "Revelation 12:1",
        meditation:
          "At the end of her earthly life Mary is taken, body and soul, into the glory of heaven, the first to share fully in her Son’s victory.",
        fruit: "Grace of a happy death",
      },
      {
        name: "The Coronation of Mary",
        scripture: "Revelation 12:1",
        meditation:
          "Mary is crowned Queen of Heaven and Earth, and keeps interceding for the Church as a mother.",
        fruit: "Trust in Mary’s intercession",
      },
    ],
  },
};

export const MYSTERY_SET_ORDER: MysterySetId[] = ["joyful", "sorrowful", "glorious", "luminous"];
