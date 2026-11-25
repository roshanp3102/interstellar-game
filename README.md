# Interstellar

A daily trivia word game. Seven mystery categories a day, 25 seconds each. Rarer answers fire bigger engines and push a
taped-together cardboard plane from the clouds to interstellar space. Each category hides one trap answer that costs you
the round's climb.

Built with React 19, TypeScript, Vite, Tailwind and the [DeepSpace](https://docs.deep.space) SDK on Cloudflare Workers.

## Run it

Needs Node 22.15+ (or 24/26) and npm 11.6+.

```sh
npm ci
npm run play
```

Open <http://localhost:5173/play>. This runs the full game with no account. Sign-in and the leaderboard are off, so
connection errors in the console are expected.

## Run it with sign-in and the leaderboard

Needs a free DeepSpace account. The first run registers your own copy of the app and writes its id to `wrangler.toml`.

```sh
npm run login
npm run dev
```

To deploy, change `name` in `wrangler.toml` to one of your own, then run `npm run deploy`.

## How it works

- `src/game/engine.ts`: rules, answer matching and the date-seeded daily rounds
- `src/game/useGame.ts`: game state; one flight per day per browser
- `src/game/score.ts`: the server's own scoring, so a posted total is never trusted
- `src/actions/index.ts`: the only way players write data (log a flight, delete my data)
- `src/schemas/`: data model and permissions
