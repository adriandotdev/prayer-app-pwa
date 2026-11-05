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
| Apostles' Creed | Traditional "Holy Ghost" form ("sitteth at the right hand", "from thence he shall come"), identical to the starter library | Public domain. Replaced the ICEL wording on 2026-11-05 |
| Mystery names, scripture references, fruits | References only | Fine (references are not text) |
| Mystery meditations | Original paraphrases of Gospel passages written for the app, with no quoted translation text (the RSV-CE, NRSV and NABRE quotations were removed on 2026-11-05) | Original wording |

## Starter library (`supabase/seed.sql`)

All eleven carry a `source` such as "Traditional", and the Rosary player now uses the same Apostles' Creed wording as the library.

## Angelus (`data/angelus/prayers.ts`)

Versicle and response lines and the closing collect ("Pour forth, we beseech You, O Lord, Your grace into our hearts") are a traditional English translation in wide circulation. Likely public domain. **Verify** the exact translation against a pre-1928 source.

## Divine Mercy Chaplet (`data/divine-mercy/prayers.ts`)

The six prayers come from St. Faustina's Diary, whose English translation is published by Marian Press. On 2026-11-05 the app's wording was replaced with an independent plain-language rendering that shares no sentence structure with that translation, and the `learn` notes only cite the Diary as a reference. The Trisagion is an ancient hymn. The same lines appear in `components/seo/practice-guide.tsx`.

| Prayer | Status |
| --- | --- |
| Opening Prayer, Eternal Father, For the Sake of His Sorrowful Passion, Holy God, Closing Prayer, O Blood and Water | Independent wording. **Have a person review it for doctrinal fidelity before launch.** Prayer titles stay traditional |

## Remaining checks (need a person)

1. Confirm the Fatima Prayer, the Rosary closing collect and the Angelus translations against a pre-1928 printed source, and record it here.
2. Have a person review the reworded Divine Mercy prayers.
3. Keep the Terms of service sentence that traditional prayers remain in the public domain accurate.
