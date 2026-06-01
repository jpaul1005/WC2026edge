export const FALLBACK_ODDS = {
  tournamentWinner: {
    france: 18, brazil: 16, argentina: 14, england: 12, spain: 10,
    germany: 8, portugal: 7, netherlands: 5, belgium: 3,
    croatia: 1.5, usa: 1.5, colombia: 1, morocco: 1, uruguay: 0.8,
    norway: 0.7, switzerland: 0.6, southkorea: 0.5, japan: 0.5,
    senegal: 0.4, austria: 0.4, turkey: 0.4, mexico: 0.3,
    ecuador: 0.3, sweden: 0.2, canada: 0.2, ivorycoast: 0.2,
    scotland: 0.15, algeria: 0.12, czechia: 0.1, southafrica: 0.1,
    egypt: 0.1, iran: 0.08, ghana: 0.08, tunisia: 0.07,
    australia: 0.06, paraguay: 0.05, saudiarabia: 0.05,
    iraq: 0.04, jordan: 0.03, newzealand: 0.03, bosnia: 0.03,
    drcongo: 0.02, uzbekistan: 0.02, capeverde: 0.02,
    qatar: 0.02, haiti: 0.01, curacao: 0.01,
  },
}

const WC_WINNER_URL  = 'https://polymarket.com/event/world-cup-winner'
const TOP_SCORER_URL = 'https://polymarket.com/event/world-cup-top-goalscorer'

// Polymarket group winner URLs — verified format
const GRP = {
  a: 'https://polymarket.com/event/world-cup-group-a-winner',
  b: 'https://polymarket.com/event/world-cup-group-b-winner',
  c: 'https://polymarket.com/event/world-cup-group-c-winner',
  d: 'https://polymarket.com/event/world-cup-group-d-winner',
  e: 'https://polymarket.com/event/world-cup-group-e-winner',
  f: 'https://polymarket.com/event/world-cup-group-f-winner',
  g: 'https://polymarket.com/event/world-cup-group-g-winner',
  h: 'https://polymarket.com/event/world-cup-group-h-winner',
  i: 'https://polymarket.com/event/world-cup-group-i-winner',
  j: 'https://polymarket.com/event/world-cup-group-j-winner',
  k: 'https://polymarket.com/event/world-cup-group-k-winner',
  l: 'https://polymarket.com/event/world-cup-group-l-winner',
}

// ── Tournament Winner ────────────────────────────────────────────────────────
export const FALLBACK_MARKETS = [
  { id: 'fb_france',      teamId: 'france',      price: 18,   marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_brazil',      teamId: 'brazil',      price: 16,   marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_argentina',   teamId: 'argentina',   price: 14,   marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_england',     teamId: 'england',     price: 12,   marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_spain',       teamId: 'spain',       price: 10,   marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_germany',     teamId: 'germany',     price: 8,    marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_portugal',    teamId: 'portugal',    price: 7,    marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_netherlands', teamId: 'netherlands', price: 5,    marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_belgium',     teamId: 'belgium',     price: 3,    marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_croatia',     teamId: 'croatia',     price: 1.5,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_usa',         teamId: 'usa',         price: 1.5,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_colombia',    teamId: 'colombia',    price: 1,    marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_morocco',     teamId: 'morocco',     price: 1,    marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_uruguay',     teamId: 'uruguay',     price: 0.8,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_norway',      teamId: 'norway',      price: 0.7,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_switzerland', teamId: 'switzerland', price: 0.6,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_japan',       teamId: 'japan',       price: 0.5,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_southkorea',  teamId: 'southkorea',  price: 0.5,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_senegal',     teamId: 'senegal',     price: 0.4,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_austria',     teamId: 'austria',     price: 0.4,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_turkey',      teamId: 'turkey',      price: 0.4,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_mexico',      teamId: 'mexico',      price: 0.3,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_ecuador',     teamId: 'ecuador',     price: 0.3,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_sweden',      teamId: 'sweden',      price: 0.2,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_canada',      teamId: 'canada',      price: 0.2,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_ivorycoast',  teamId: 'ivorycoast',  price: 0.2,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_scotland',    teamId: 'scotland',    price: 0.15, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_algeria',     teamId: 'algeria',     price: 0.12, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_czechia',     teamId: 'czechia',     price: 0.1,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_egypt',       teamId: 'egypt',       price: 0.1,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_iran',        teamId: 'iran',        price: 0.08, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_ghana',       teamId: 'ghana',       price: 0.08, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_tunisia',     teamId: 'tunisia',     price: 0.07, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_australia',   teamId: 'australia',   price: 0.06, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_saudiarabia', teamId: 'saudiarabia', price: 0.05, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_paraguay',    teamId: 'paraguay',    price: 0.05, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_iraq',        teamId: 'iraq',        price: 0.04, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_jordan',      teamId: 'jordan',      price: 0.03, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_newzealand',  teamId: 'newzealand',  price: 0.03, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_bosnia',      teamId: 'bosnia',      price: 0.03, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_drcongo',     teamId: 'drcongo',     price: 0.02, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_uzbekistan',  teamId: 'uzbekistan',  price: 0.02, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_capeverde',   teamId: 'capeverde',   price: 0.02, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_qatar',       teamId: 'qatar',       price: 0.02, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_southafrica', teamId: 'southafrica', price: 0.1,  marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_haiti',       teamId: 'haiti',       price: 0.01, marketType: 'Tournament Winner', url: WC_WINNER_URL },
  { id: 'fb_curacao',     teamId: 'curacao',     price: 0.01, marketType: 'Tournament Winner', url: WC_WINNER_URL },
]

// ── Group Winner markets — correct groups per official draw ──────────────────
export const GROUP_WINNER_MARKETS = [
  // Group A: Mexico, South Africa, South Korea, Czechia
  { id: 'gw_A_mexico',       teamId: 'mexico',      price: 55, marketType: 'Group Winner', url: GRP.a },
  { id: 'gw_A_southkorea',   teamId: 'southkorea',  price: 25, marketType: 'Group Winner', url: GRP.a },
  { id: 'gw_A_czechia',      teamId: 'czechia',     price: 13, marketType: 'Group Winner', url: GRP.a },
  { id: 'gw_A_southafrica',  teamId: 'southafrica', price: 7,  marketType: 'Group Winner', url: GRP.a },

  // Group B: Canada, Bosnia & Herzegovina, Qatar, Switzerland
  { id: 'gw_B_switzerland',  teamId: 'switzerland', price: 42, marketType: 'Group Winner', url: GRP.b },
  { id: 'gw_B_canada',       teamId: 'canada',      price: 38, marketType: 'Group Winner', url: GRP.b },
  { id: 'gw_B_bosnia',       teamId: 'bosnia',      price: 13, marketType: 'Group Winner', url: GRP.b },
  { id: 'gw_B_qatar',        teamId: 'qatar',       price: 7,  marketType: 'Group Winner', url: GRP.b },

  // Group C: Brazil, Morocco, Haiti, Scotland
  { id: 'gw_C_brazil',       teamId: 'brazil',      price: 68, marketType: 'Group Winner', url: GRP.c },
  { id: 'gw_C_morocco',      teamId: 'morocco',     price: 20, marketType: 'Group Winner', url: GRP.c },
  { id: 'gw_C_scotland',     teamId: 'scotland',    price: 9,  marketType: 'Group Winner', url: GRP.c },
  { id: 'gw_C_haiti',        teamId: 'haiti',       price: 3,  marketType: 'Group Winner', url: GRP.c },

  // Group D: United States, Paraguay, Australia, Turkey
  { id: 'gw_D_usa',          teamId: 'usa',         price: 48, marketType: 'Group Winner', url: GRP.d },
  { id: 'gw_D_turkey',       teamId: 'turkey',      price: 28, marketType: 'Group Winner', url: GRP.d },
  { id: 'gw_D_australia',    teamId: 'australia',   price: 14, marketType: 'Group Winner', url: GRP.d },
  { id: 'gw_D_paraguay',     teamId: 'paraguay',    price: 10, marketType: 'Group Winner', url: GRP.d },

  // Group E: Germany, Curaçao, Ivory Coast, Ecuador
  { id: 'gw_E_germany',      teamId: 'germany',     price: 70, marketType: 'Group Winner', url: GRP.e },
  { id: 'gw_E_ecuador',      teamId: 'ecuador',     price: 16, marketType: 'Group Winner', url: GRP.e },
  { id: 'gw_E_ivorycoast',   teamId: 'ivorycoast',  price: 11, marketType: 'Group Winner', url: GRP.e },
  { id: 'gw_E_curacao',      teamId: 'curacao',     price: 3,  marketType: 'Group Winner', url: GRP.e },

  // Group F: Netherlands, Japan, Sweden, Tunisia
  { id: 'gw_F_netherlands',  teamId: 'netherlands', price: 55, marketType: 'Group Winner', url: GRP.f },
  { id: 'gw_F_sweden',       teamId: 'sweden',      price: 22, marketType: 'Group Winner', url: GRP.f },
  { id: 'gw_F_japan',        teamId: 'japan',       price: 16, marketType: 'Group Winner', url: GRP.f },
  { id: 'gw_F_tunisia',      teamId: 'tunisia',     price: 7,  marketType: 'Group Winner', url: GRP.f },

  // Group G: Belgium, Egypt, Iran, New Zealand
  { id: 'gw_G_belgium',      teamId: 'belgium',     price: 65, marketType: 'Group Winner', url: GRP.g },
  { id: 'gw_G_iran',         teamId: 'iran',        price: 16, marketType: 'Group Winner', url: GRP.g },
  { id: 'gw_G_egypt',        teamId: 'egypt',       price: 13, marketType: 'Group Winner', url: GRP.g },
  { id: 'gw_G_newzealand',   teamId: 'newzealand',  price: 6,  marketType: 'Group Winner', url: GRP.g },

  // Group H: Spain, Cape Verde, Saudi Arabia, Uruguay
  { id: 'gw_H_spain',        teamId: 'spain',       price: 62, marketType: 'Group Winner', url: GRP.h },
  { id: 'gw_H_uruguay',      teamId: 'uruguay',     price: 24, marketType: 'Group Winner', url: GRP.h },
  { id: 'gw_H_saudiarabia',  teamId: 'saudiarabia', price: 9,  marketType: 'Group Winner', url: GRP.h },
  { id: 'gw_H_capeverde',    teamId: 'capeverde',   price: 5,  marketType: 'Group Winner', url: GRP.h },

  // Group I: France, Senegal, Iraq, Norway
  { id: 'gw_I_france',       teamId: 'france',      price: 60, marketType: 'Group Winner', url: GRP.i },
  { id: 'gw_I_norway',       teamId: 'norway',      price: 22, marketType: 'Group Winner', url: GRP.i },
  { id: 'gw_I_senegal',      teamId: 'senegal',     price: 13, marketType: 'Group Winner', url: GRP.i },
  { id: 'gw_I_iraq',         teamId: 'iraq',        price: 5,  marketType: 'Group Winner', url: GRP.i },

  // Group J: Argentina, Algeria, Austria, Jordan
  { id: 'gw_J_argentina',    teamId: 'argentina',   price: 72, marketType: 'Group Winner', url: GRP.j },
  { id: 'gw_J_austria',      teamId: 'austria',     price: 16, marketType: 'Group Winner', url: GRP.j },
  { id: 'gw_J_algeria',      teamId: 'algeria',     price: 8,  marketType: 'Group Winner', url: GRP.j },
  { id: 'gw_J_jordan',       teamId: 'jordan',      price: 4,  marketType: 'Group Winner', url: GRP.j },

  // Group K: Portugal, DR Congo, Uzbekistan, Colombia
  { id: 'gw_K_portugal',     teamId: 'portugal',    price: 58, marketType: 'Group Winner', url: GRP.k },
  { id: 'gw_K_colombia',     teamId: 'colombia',    price: 28, marketType: 'Group Winner', url: GRP.k },
  { id: 'gw_K_drcongo',      teamId: 'drcongo',     price: 9,  marketType: 'Group Winner', url: GRP.k },
  { id: 'gw_K_uzbekistan',   teamId: 'uzbekistan',  price: 5,  marketType: 'Group Winner', url: GRP.k },

  // Group L: England, Croatia, Ghana, Panama
  { id: 'gw_L_england',      teamId: 'england',     price: 62, marketType: 'Group Winner', url: GRP.l },
  { id: 'gw_L_croatia',      teamId: 'croatia',     price: 22, marketType: 'Group Winner', url: GRP.l },
  { id: 'gw_L_ghana',        teamId: 'ghana',       price: 10, marketType: 'Group Winner', url: GRP.l },
  { id: 'gw_L_panama',       teamId: 'panama',      price: 6,  marketType: 'Group Winner', url: GRP.l },
]

// ── Top Scorer markets ────────────────────────────────────────────────────────
export const TOP_SCORER_MARKETS = [
  { id: 'ts_mbappe',     playerName: 'Kylian Mbappé',     teamId: 'france',      price: 14, marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_haaland',    playerName: 'Erling Haaland',    teamId: 'norway',      price: 11, marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_vinicius',   playerName: 'Vinícius Jr.',      teamId: 'brazil',      price: 9,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_bellingham', playerName: 'Jude Bellingham',   teamId: 'england',     price: 8,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_kane',       playerName: 'Harry Kane',        teamId: 'england',     price: 6,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_yamal',      playerName: 'Lamine Yamal',      teamId: 'spain',       price: 6,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_messi',      playerName: 'Lionel Messi',      teamId: 'argentina',   price: 5,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_saka',       playerName: 'Bukayo Saka',       teamId: 'england',     price: 5,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_wirtz',      playerName: 'Florian Wirtz',     teamId: 'germany',     price: 5,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_ronaldo',    playerName: 'Cristiano Ronaldo', teamId: 'portugal',    price: 4,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_alvarez',    playerName: 'Julián Álvarez',    teamId: 'argentina',   price: 4,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_olise',      playerName: 'Michael Olise',     teamId: 'france',      price: 4,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_pulisic',    playerName: 'Christian Pulisic', teamId: 'usa',         price: 3,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_osimhen',    playerName: 'Victor Osimhen',    teamId: 'nigeria',     price: 3,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
  { id: 'ts_nkunku',     playerName: 'Christopher Nkunku',teamId: 'france',      price: 3,  marketType: 'Golden Boot — Player', url: TOP_SCORER_URL },
]
