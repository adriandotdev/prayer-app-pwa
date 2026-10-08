-- Starter library: traditional, public-domain prayers (user_id NULL = read-only for everyone).
-- Fixed ids make this file safe to run more than once.
insert into public.prayers (id, user_id, title, body, source) values
('00000000-0000-4000-8000-000000000001', null, 'Sign of the Cross',
 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.', 'Traditional'),

('00000000-0000-4000-8000-000000000002', null, 'Our Father',
 E'Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done on earth as it is in heaven.\n\nGive us this day our daily bread;\nand forgive us our trespasses\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil. Amen.', 'Traditional (Matthew 6:9-13)'),

('00000000-0000-4000-8000-000000000003', null, 'Hail Mary',
 E'Hail Mary, full of grace, the Lord is with thee;\nblessed art thou among women,\nand blessed is the fruit of thy womb, Jesus.\n\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour of our death. Amen.', 'Traditional (Luke 1:28, 1:42)'),

('00000000-0000-4000-8000-000000000004', null, 'Glory Be',
 E'Glory be to the Father, and to the Son, and to the Holy Spirit,\nas it was in the beginning, is now, and ever shall be,\nworld without end. Amen.', 'Traditional'),

('00000000-0000-4000-8000-000000000005', null, 'Apostles'' Creed',
 E'I believe in God, the Father almighty, Creator of heaven and earth;\nand in Jesus Christ, his only Son, our Lord;\nwho was conceived by the Holy Ghost, born of the Virgin Mary,\nsuffered under Pontius Pilate, was crucified, died, and was buried.\nHe descended into hell; the third day he rose again from the dead;\nhe ascended into heaven, and sitteth at the right hand of God the Father almighty;\nfrom thence he shall come to judge the living and the dead.\n\nI believe in the Holy Ghost, the holy Catholic Church,\nthe communion of saints, the forgiveness of sins,\nthe resurrection of the body, and life everlasting. Amen.', 'Traditional'),

('00000000-0000-4000-8000-000000000006', null, 'Fatima Prayer',
 E'O my Jesus, forgive us our sins,\nsave us from the fires of hell,\nlead all souls to heaven,\nespecially those most in need of thy mercy. Amen.', 'Given at Fatima, 1917'),

('00000000-0000-4000-8000-000000000007', null, 'Hail, Holy Queen',
 E'Hail, holy Queen, Mother of mercy,\nour life, our sweetness and our hope.\nTo thee do we cry, poor banished children of Eve;\nto thee do we send up our sighs,\nmourning and weeping in this valley of tears.\nTurn then, most gracious advocate,\nthine eyes of mercy toward us;\nand after this our exile,\nshow unto us the blessed fruit of thy womb, Jesus.\nO clement, O loving, O sweet Virgin Mary.\n\n**V.** Pray for us, O holy Mother of God.\n**R.** That we may be made worthy of the promises of Christ. Amen.', 'Salve Regina, traditional'),

('00000000-0000-4000-8000-000000000008', null, 'Memorare',
 E'Remember, O most gracious Virgin Mary,\nthat never was it known that anyone who fled to thy protection,\nimplored thy help, or sought thy intercession, was left unaided.\nInspired by this confidence, I fly unto thee,\nO Virgin of virgins, my Mother;\nto thee do I come, before thee I stand, sinful and sorrowful.\nO Mother of the Word Incarnate,\ndespise not my petitions,\nbut in thy mercy hear and answer me. Amen.', 'Traditional'),

('00000000-0000-4000-8000-000000000009', null, 'The Angelus',
 E'**V.** The Angel of the Lord declared unto Mary.\n**R.** And she conceived of the Holy Spirit.\n\n*Hail Mary…*\n\n**V.** Behold the handmaid of the Lord.\n**R.** Be it done unto me according to thy word.\n\n*Hail Mary…*\n\n**V.** And the Word was made flesh.\n**R.** And dwelt among us.\n\n*Hail Mary…*\n\n**V.** Pray for us, O holy Mother of God.\n**R.** That we may be made worthy of the promises of Christ.\n\nLet us pray.\nPour forth, we beseech thee, O Lord, thy grace into our hearts;\nthat we, to whom the incarnation of Christ thy Son\nwas made known by the message of an angel,\nmay by his passion and cross\nbe brought to the glory of his resurrection.\nThrough the same Christ our Lord. Amen.', 'Traditional'),

('00000000-0000-4000-8000-000000000010', null, 'Prayer to Saint Michael',
 E'Saint Michael the Archangel, defend us in battle.\nBe our protection against the wickedness and snares of the devil.\nMay God rebuke him, we humbly pray;\nand do thou, O Prince of the heavenly host,\nby the power of God, thrust into hell Satan\nand all the evil spirits who prowl about the world\nseeking the ruin of souls. Amen.', 'Pope Leo XIII, 1886'),

('00000000-0000-4000-8000-000000000011', null, 'Act of Contrition',
 E'O my God, I am heartily sorry for having offended thee,\nand I detest all my sins because of thy just punishments,\nbut most of all because they offend thee, my God,\nwho art all good and deserving of all my love.\nI firmly resolve, with the help of thy grace,\nto sin no more and to avoid the near occasion of sin. Amen.', 'Traditional')
on conflict (id) do nothing;
