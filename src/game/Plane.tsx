/**
 * The taped-together cardboard plane and its stick-figure pilot.
 * Hand-drawn feel comes from a turbulence displacement filter on the strokes.
 * The flame group is driven imperatively by FlightScene (scale + colours).
 */

import { forwardRef } from 'react'

export const Plane = forwardRef<SVGSVGElement, { flameRef?: React.Ref<SVGGElement> }>(function Plane(
  { flameRef },
  ref,
) {
  return (
    <svg ref={ref} viewBox="0 0 300 160" className="plane-svg" aria-label="Cardboard airplane" role="img">
      <defs>
        <filter id="sketch" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
        </filter>
        <linearGradient id="box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a466" />
          <stop offset="1" stopColor="#b47a3e" />
        </linearGradient>
        <linearGradient id="wing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3b57a" />
          <stop offset="1" stopColor="#c48c4f" />
        </linearGradient>
        <radialGradient id="flameCore" cx="1" cy="0.5" r="1">
          <stop offset="0" stopColor="var(--flame-glow, #fff3c4)" />
          <stop offset="0.45" stopColor="var(--flame, #ff9b3d)" />
          <stop offset="1" stopColor="var(--flame, #ff9b3d)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Exhaust flame — origin at the nozzle mouth */}
      <g ref={flameRef} className="plane-flame" style={{ transformOrigin: '46px 92px' }}>
        <path d="M46 78 C 20 80, -10 88, -40 92 C -10 96, 20 104, 46 106 Z" fill="url(#flameCore)" opacity="0.95" />
        <path d="M46 84 C 30 86, 14 90, 0 92 C 14 94, 30 98, 46 100 Z" fill="var(--flame-glow, #fff3c4)" opacity="0.9" />
      </g>

      <g filter="url(#sketch)" stroke="#3b2412" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        {/* far wing */}
        <path d="M150 70 L 178 70 L 200 34 L 186 32 Z" fill="#b98146" />

        {/* tail fin */}
        <path d="M62 74 L 72 30 L 92 30 L 104 74 Z" fill="url(#wing)" />
        <path d="M74 40 L 90 40" stroke="#7a4a20" strokeWidth="1.4" />
        {/* tail plane */}
        <path d="M56 80 L 40 70 L 54 68 L 92 78 Z" fill="#c48c4f" />

        {/* toilet-roll nozzle */}
        <rect x="44" y="78" width="26" height="28" rx="4" fill="#cfc2a8" />
        <ellipse cx="46" cy="92" rx="5" ry="14" fill="#5a4a36" />
        <path d="M52 80 L 66 104" stroke="#a89878" strokeWidth="1.2" />

        {/* fuselage box */}
        <path d="M66 72 L 226 66 L 238 90 L 224 112 L 66 110 Z" fill="url(#box)" />
        {/* corrugation flute lines */}
        <g stroke="#9a6331" strokeWidth="1" opacity="0.55">
          <path d="M96 72 L 96 110" />
          <path d="M120 71 L 120 110" />
          <path d="M190 68 L 190 111" />
          <path d="M206 67 L 206 111" />
        </g>
        {/* box flap seam */}
        <path d="M66 91 L 232 89" stroke="#8a5428" strokeWidth="1.3" />

        {/* paper-cup nose cone */}
        <path d="M226 66 L 262 84 Q 268 90 262 96 L 224 112 Z" fill="#f2efe6" />
        <path d="M236 70 L 236 108 M 248 76 L 248 102" stroke="#d14b3a" strokeWidth="3" />

        {/* cockpit opening */}
        <path d="M134 70 Q 160 58 186 68 L 184 76 Q 160 70 136 78 Z" fill="#2b1a0c" />

        {/* pilot: body + arm inside cockpit */}
        <path d="M160 52 L 158 72" stroke="#1d130a" strokeWidth="3" />
        <path d="M159 60 L 174 64 L 182 58" stroke="#1d130a" strokeWidth="2.6" fill="none" />

        {/* fluttering scarf */}
        <path fill="#e8463a" stroke="#7d1d14" strokeWidth="1.8">
          <animate
            attributeName="d"
            dur="0.55s"
            repeatCount="indefinite"
            values="
              M156 52 C 140 50, 120 44, 100 46 C 108 52, 104 56, 96 60 C 118 60, 138 58, 158 58 Z;
              M156 52 C 140 46, 122 38, 102 36 C 108 44, 102 50, 92 50 C 116 56, 138 58, 158 58 Z;
              M156 52 C 140 52, 120 52, 100 56 C 108 60, 104 64, 96 70 C 118 64, 138 60, 158 58 Z;
              M156 52 C 140 50, 120 44, 100 46 C 108 52, 104 56, 96 60 C 118 60, 138 58, 158 58 Z"
          />
        </path>
        <path d="M152 52 Q 160 58 168 52" stroke="#7d1d14" strokeWidth="5" fill="none" />

        {/* head + goggles */}
        <circle cx="161" cy="38" r="12" fill="#fbf7ee" />
        <path d="M149 36 Q 161 30 173 36" stroke="#1d130a" strokeWidth="2.2" fill="none" />
        <circle cx="166" cy="37" r="4.2" fill="#9fe3ff" strokeWidth="2" />
        <circle cx="157" cy="37" r="4.2" fill="#9fe3ff" strokeWidth="2" />
        <path d="M162 44 Q 166 46 169 43" strokeWidth="1.8" fill="none" />

        {/* near wing */}
        <path d="M120 98 L 186 96 L 150 146 L 112 146 Z" fill="url(#wing)" />
        <path d="M134 100 L 124 142" stroke="#9a6331" strokeWidth="1" opacity="0.6" />

        {/* duct tape strips */}
        <g fill="#d8d5cc" stroke="#8d8a80" strokeWidth="1.2" opacity="0.92">
          <rect x="138" y="90" width="14" height="38" transform="rotate(-18 145 109)" />
          <rect x="76" y="68" width="12" height="46" transform="rotate(6 82 91)" />
          <rect x="214" y="64" width="12" height="50" transform="rotate(-4 220 89)" />
          <rect x="54" y="74" width="20" height="10" transform="rotate(-8 64 79)" />
        </g>
      </g>

      {/* marker scribble on the side */}
      <text x="150" y="88" fontFamily="'Permanent Marker', cursive" fontSize="11" fill="#3b2412" opacity="0.8">
        HB-01
      </text>
    </svg>
  )
})
