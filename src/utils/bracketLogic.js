// Official 2026 FIFA World Cup R32 bracket seeding
// Source: FIFA knockout stage match schedule
//
// Match pairings (group winners never face same-group opponents until QF+):
// M73:  A2  vs B2
// M74:  E1  vs 3rd(A/B/C/D/F)
// M75:  F1  vs C2
// M76:  C1  vs F2
// M77:  I1  vs 3rd(C/D/F/G/H)
// M78:  E2  vs I2
// M79:  A1  vs 3rd(C/E/F/H/I)
// M80:  L1  vs 3rd(E/H/I/J/K)
// M81:  D1  vs 3rd(B/E/F/I/J)
// M82:  G1  vs 3rd(A/E/H/I/J)
// M83:  K2  vs L2
// M84:  H1  vs J2
// M85:  B1  vs 3rd(E/F/G/I/J)
// M86:  J1  vs H2
// M87:  K1  vs 3rd(D/E/I/J/L)
// M88:  D2  vs G2
//
// R16 pairs: (M73 winner vs M74 winner), (M75 vs M76), (M77 vs M78), (M79 vs M80),
//            (M81 vs M82), (M83 vs M84), (M85 vs M86), (M87 vs M88)

export function buildR32Matchups(groupPicks, bestThirds) {
  const w  = (g) => groupPicks[g]?.[0] || null  // group winner
  const ru = (g) => groupPicks[g]?.[1] || null  // runner-up
  const t  = (i) => (bestThirds || [])[i] || null // best 3rd place teams ranked 1-8

  return [
    { id: 'r32_73', slot1: ru('A'),  slot2: ru('B')  },  // A2 vs B2
    { id: 'r32_74', slot1: w('E'),   slot2: t(0)     },  // E1 vs best 3rd
    { id: 'r32_75', slot1: w('F'),   slot2: ru('C')  },  // F1 vs C2
    { id: 'r32_76', slot1: w('C'),   slot2: ru('F')  },  // C1 vs F2
    { id: 'r32_77', slot1: w('I'),   slot2: t(1)     },  // I1 vs 2nd best 3rd
    { id: 'r32_78', slot1: ru('E'),  slot2: ru('I')  },  // E2 vs I2
    { id: 'r32_79', slot1: w('A'),   slot2: t(2)     },  // A1 vs 3rd best 3rd
    { id: 'r32_80', slot1: w('L'),   slot2: t(3)     },  // L1 vs 4th best 3rd
    { id: 'r32_81', slot1: w('D'),   slot2: t(4)     },  // D1 vs 5th best 3rd
    { id: 'r32_82', slot1: w('G'),   slot2: t(5)     },  // G1 vs 6th best 3rd
    { id: 'r32_83', slot1: ru('K'),  slot2: ru('L')  },  // K2 vs L2
    { id: 'r32_84', slot1: w('H'),   slot2: ru('J')  },  // H1 vs J2
    { id: 'r32_85', slot1: w('B'),   slot2: t(6)     },  // B1 vs 7th best 3rd
    { id: 'r32_86', slot1: w('J'),   slot2: ru('H')  },  // J1 vs H2
    { id: 'r32_87', slot1: w('K'),   slot2: t(7)     },  // K1 vs 8th best 3rd
    { id: 'r32_88', slot1: ru('D'),  slot2: ru('G')  },  // D2 vs G2
  ]
}

export const ROUND_LABELS = {
  groups: 'Group Stage',
  r32:    'Round of 32',
  r16:    'Round of 16',
  qf:     'Quarter-Finals',
  sf:     'Semi-Finals',
  final:  'Final',
}
