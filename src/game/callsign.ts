/** Public callsign rules, shared by the form and the server. */

export const CALLSIGN_MAX = 24
export const DEFAULT_CALLSIGN = 'Anonymous Pilot'

/** Blocked anywhere in the name, even spaced out or in leetspeak. */
const BLOCKED_ANYWHERE = [
  'nigger', 'nigga', 'faggot', 'fuck', 'shit', 'bitch', 'whore', 'kike', 'tranny', 'wetback',
  'hitler', 'rapist', 'pedophile', 'paedophile', 'jizz', 'porn',
]
/** Blocked only as a whole word, because they sit inside ordinary words. */
const BLOCKED_WORDS = [
  'fag', 'fags', 'cunt', 'cunts', 'rape', 'cock', 'cocks', 'dick', 'dicks', 'pussy', 'slut', 'sluts', 'cum', 'tits', 'nazi', 'nazis',
  'spic', 'chink', 'coon', 'gook', 'paki', 'retard', 'pedo', 'twat', 'wank', 'wanker', 'penis', 'vagina', 'asshole',
]

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b' }

/** The cleaned callsign, or null if it isn't allowed. Blank becomes the default. */
export function cleanCallsign(raw: unknown): string | null {
  if (raw === undefined || raw === null) return DEFAULT_CALLSIGN
  if (typeof raw !== 'string' || raw.length > 200) return null
  const name = raw.normalize('NFKC').replace(/\s+/g, ' ').trim()
  if (!name) return DEFAULT_CALLSIGN
  // Plain Latin letters (accents fine), digits, and light punctuation: no
  // invisible, direction-flipping or look-alike characters.
  if (name.length > CALLSIGN_MAX || !/^[\p{Script=Latin}0-9 ._'-]+$/u.test(name)) return null
  const folded = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[0-9]/g, (d) => LEET[d] ?? d)
  const squashed = folded.replace(/[^a-z]/g, '')
  if (BLOCKED_ANYWHERE.some((w) => squashed.includes(w))) return null
  const words = folded.split(/[^a-z]+/)
  // `squashed` also catches a single word spelled out with separators.
  if (BLOCKED_WORDS.some((w) => words.includes(w) || squashed === w)) return null
  return name
}
