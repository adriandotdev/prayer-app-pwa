# Prayer text sources and licensing

Audit of every prayer text shipped in the app, written for the production checklist ("Confirm prayer texts shipped are public domain or licensed"). This is a developer audit, not legal advice. Items marked **verify** need a person to confirm the source before launch.

Rule of thumb: pre-1900 English forms (thee/thou) of prayers that are centuries old are public domain. Modern liturgical translations (ICEL, USCCB lectionary) and 20th-century devotional texts are usually copyrighted.

## Rosary (`data/rosary/prayers.ts`)

| Prayer | Wording in the app | Status |
| --- | --- | --- |
| Sign of the Cross | Standard | Public domain |
| Our Father | Traditional ("who art in heaven... trespasses") | Public domain |
| Hail Mary | Traditional ("thee", "amongst women") | Public domain |
| Glory Be | Traditional ("world without end") | Public domain |
| Fatima Prayer | Traditional English, given 1917 | Public domain (verify translation origin) |
| Hail, Holy Queen | Traditional ("thine eyes of mercy") | Public domain |
| Closing Prayer (collect) | Traditional older translation ("only-begotten", "we beseech thee") | Public domain, likely |
| **Apostles' Creed** | **Matches the current ICEL Roman Missal wording** ("on the third day he rose again from the dead", "seated at the right hand of God the Father almighty") | **Verify. ICEL holds copyright on this translation.** |
| Mystery names, scripture references, fruits | References only | Fine (references are not text) |
| Mystery meditations | Short paraphrases of Gospel passages written for the app | **Verify** they are original paraphrases and not copied from a translation (the Annunciation line is close to RSV-CE: "Behold, I am the handmaid of the Lord") |

## Starter library (`supabase/seed.sql`)

All eleven carry a `source` such as "Traditional". The seed's Apostles' Creed uses the older "Holy Ghost" form, which is public domain, so the library and the Rosary player show two different Creeds. Picking one traditional wording for both would be both safer and consistent.

## Angelus (`data/angelus/prayers.ts`)

Versicle and response lines and the closing collect ("Pour forth, we beseech You, O Lord, Your grace into our hearts") are a traditional English translation in wide circulation. Likely public domain. **Verify** the exact translation against a pre-1928 source.

## Divine Mercy Chaplet (`data/divine-mercy/prayers.ts`)

| Prayer | Source | Status |
| --- | --- | --- |
| Opening Prayer ("You expired, Jesus...") | St. Faustina's Diary, 1319 | **Verify.** The English Diary translation is published by Marian Press. |
| Eternal Father | Diary, 476 | **Verify**, same translation |
| For the Sake of His Sorrowful Passion | Diary, 476 | **Verify**, same translation |
| Holy God (Trisagion) | Ancient hymn; this wording from the Diary | **Verify** |
| Closing Prayer ("Eternal God, in whom mercy is endless...") | Diary, 950 | **Verify** |
| O Blood and Water | Diary, 84 | **Verify** |

The prayers are used universally and the Marians publish them for free use in worship, but that is not a licence for an app. Options: (a) ask the Marians of the Immaculate Conception for written permission, (b) replace with an independently worded translation from the Polish original, or (c) ship the chaplet's structure with a link rather than the text.

## Recommended next steps

1. Replace the Rosary's Apostles' Creed with a traditional public-domain form (the seed's "Holy Ghost" form, or the Roman Catechism wording) so the Rosary and library agree.
2. Decide the Divine Mercy approach (a, b or c above) before launch. Until then the chaplet is the largest licensing risk.
3. Confirm the origin of the Angelus and closing-collect translations, and that the mystery meditations are original wording.
4. Record the resolved source for each prayer in this table, then tick the checklist item.
5. The Terms of service say traditional prayers remain in the public domain; keep that sentence accurate once the above is settled.
