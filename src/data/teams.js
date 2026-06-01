// Official 2026 FIFA World Cup groups (48 teams, 12 groups of 4)
export const GROUPS = {
  A: [
    { id: 'mexico',        name: 'Mexico',                 flag: '🇲🇽', confederation: 'CONCACAF' },
    { id: 'southafrica',   name: 'South Africa',           flag: '🇿🇦', confederation: 'CAF' },
    { id: 'southkorea',    name: 'South Korea',            flag: '🇰🇷', confederation: 'AFC' },
    { id: 'czechia',       name: 'Czechia',                flag: '🇨🇿', confederation: 'UEFA' },
  ],
  B: [
    { id: 'canada',        name: 'Canada',                 flag: '🇨🇦', confederation: 'CONCACAF' },
    { id: 'bosnia',        name: 'Bosnia & Herzegovina',   flag: '🇧🇦', confederation: 'UEFA' },
    { id: 'qatar',         name: 'Qatar',                  flag: '🇶🇦', confederation: 'AFC' },
    { id: 'switzerland',   name: 'Switzerland',            flag: '🇨🇭', confederation: 'UEFA' },
  ],
  C: [
    { id: 'brazil',        name: 'Brazil',                 flag: '🇧🇷', confederation: 'CONMEBOL' },
    { id: 'morocco',       name: 'Morocco',                flag: '🇲🇦', confederation: 'CAF' },
    { id: 'haiti',         name: 'Haiti',                  flag: '🇭🇹', confederation: 'CONCACAF' },
    { id: 'scotland',      name: 'Scotland',               flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA' },
  ],
  D: [
    { id: 'usa',           name: 'United States',          flag: '🇺🇸', confederation: 'CONCACAF' },
    { id: 'paraguay',      name: 'Paraguay',               flag: '🇵🇾', confederation: 'CONMEBOL' },
    { id: 'australia',     name: 'Australia',              flag: '🇦🇺', confederation: 'AFC' },
    { id: 'turkey',        name: 'Turkey',                 flag: '🇹🇷', confederation: 'UEFA' },
  ],
  E: [
    { id: 'germany',       name: 'Germany',                flag: '🇩🇪', confederation: 'UEFA' },
    { id: 'curacao',       name: 'Curaçao',                flag: '🇨🇼', confederation: 'CONCACAF' },
    { id: 'ivorycoast',    name: 'Ivory Coast',            flag: '🇨🇮', confederation: 'CAF' },
    { id: 'ecuador',       name: 'Ecuador',                flag: '🇪🇨', confederation: 'CONMEBOL' },
  ],
  F: [
    { id: 'netherlands',   name: 'Netherlands',            flag: '🇳🇱', confederation: 'UEFA' },
    { id: 'japan',         name: 'Japan',                  flag: '🇯🇵', confederation: 'AFC' },
    { id: 'sweden',        name: 'Sweden',                 flag: '🇸🇪', confederation: 'UEFA' },
    { id: 'tunisia',       name: 'Tunisia',                flag: '🇹🇳', confederation: 'CAF' },
  ],
  G: [
    { id: 'belgium',       name: 'Belgium',                flag: '🇧🇪', confederation: 'UEFA' },
    { id: 'egypt',         name: 'Egypt',                  flag: '🇪🇬', confederation: 'CAF' },
    { id: 'iran',          name: 'Iran',                   flag: '🇮🇷', confederation: 'AFC' },
    { id: 'newzealand',    name: 'New Zealand',            flag: '🇳🇿', confederation: 'OFC' },
  ],
  H: [
    { id: 'spain',         name: 'Spain',                  flag: '🇪🇸', confederation: 'UEFA' },
    { id: 'capeverde',     name: 'Cape Verde',             flag: '🇨🇻', confederation: 'CAF' },
    { id: 'saudiarabia',   name: 'Saudi Arabia',           flag: '🇸🇦', confederation: 'AFC' },
    { id: 'uruguay',       name: 'Uruguay',                flag: '🇺🇾', confederation: 'CONMEBOL' },
  ],
  I: [
    { id: 'france',        name: 'France',                 flag: '🇫🇷', confederation: 'UEFA' },
    { id: 'senegal',       name: 'Senegal',                flag: '🇸🇳', confederation: 'CAF' },
    { id: 'iraq',          name: 'Iraq',                   flag: '🇮🇶', confederation: 'AFC' },
    { id: 'norway',        name: 'Norway',                 flag: '🇳🇴', confederation: 'UEFA' },
  ],
  J: [
    { id: 'argentina',     name: 'Argentina',              flag: '🇦🇷', confederation: 'CONMEBOL' },
    { id: 'algeria',       name: 'Algeria',                flag: '🇩🇿', confederation: 'CAF' },
    { id: 'austria',       name: 'Austria',                flag: '🇦🇹', confederation: 'UEFA' },
    { id: 'jordan',        name: 'Jordan',                 flag: '🇯🇴', confederation: 'AFC' },
  ],
  K: [
    { id: 'portugal',      name: 'Portugal',               flag: '🇵🇹', confederation: 'UEFA' },
    { id: 'drcongo',       name: 'DR Congo',               flag: '🇨🇩', confederation: 'CAF' },
    { id: 'uzbekistan',    name: 'Uzbekistan',             flag: '🇺🇿', confederation: 'AFC' },
    { id: 'colombia',      name: 'Colombia',               flag: '🇨🇴', confederation: 'CONMEBOL' },
  ],
  L: [
    { id: 'england',       name: 'England',                flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
    { id: 'croatia',       name: 'Croatia',                flag: '🇭🇷', confederation: 'UEFA' },
    { id: 'ghana',         name: 'Ghana',                  flag: '🇬🇭', confederation: 'CAF' },
    { id: 'panama',        name: 'Panama',                 flag: '🇵🇦', confederation: 'CONCACAF' },
  ],
}

export const ALL_TEAMS = Object.entries(GROUPS).flatMap(([group, teams]) =>
  teams.map(t => ({ ...t, group }))
)

export const TEAM_BY_ID = Object.fromEntries(ALL_TEAMS.map(t => [t.id, t]))

export const STAGE_WIN_PROB = {
  champion:    100,
  runnerUp:    50,
  top4:        25,
  top8:        12.5,
  top16:       6.25,
  top32:       3.125,
  groupWinner: 2.0,
  groupSecond: 1.5,
  groupThird:  0.8,
  groupFourth: 0,
}

export const STAGE_PRICE_JUMP = {
  groupWinner: 1.4,
  r32:         1.3,
  r16:         1.5,
  qf:          1.6,
  sf:          1.8,
  final:       100,
}
