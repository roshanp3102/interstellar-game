/**
 * Flights — the global "highest altitude" logbook.
 *
 * Anyone (even signed out) can read the board; flights are written only
 * by the `logFlight` server action, which recomputes the score. Clients cannot
 * write here directly. `pilotId` is stamped from the verified sign-in.
 */

import type { CollectionSchema } from 'deepspace/schema'

export const flightsSchema: CollectionSchema = {
  name: 'flights',
  columns: [
    { name: 'pilotId', storage: 'text', interpretation: 'plain', userBound: true, immutable: true },
    { name: 'pilot', storage: 'text', interpretation: 'plain', required: true, maxLength: 24 },
    { name: 'day', storage: 'text', interpretation: 'plain', immutable: true },
    { name: 'altitude', storage: 'number', interpretation: 'plain', required: true },
    { name: 'stage', storage: 'text', interpretation: 'plain' },
    { name: 'answers', storage: 'number', interpretation: 'plain' },
  ],
  ownerField: 'pilotId',
  // One logged flight per pilot per game day, enforced by the server.
  uniqueOn: ['pilotId', 'day'],
  permissions: {
    '*': { read: true, create: false, update: false, delete: false },
    viewer: { read: true, create: false, update: false, delete: false },
    member: { read: true, create: false, update: false, delete: false },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
