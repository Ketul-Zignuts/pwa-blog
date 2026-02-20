import React from 'react'

const OffLineIllustration = () => {
  return (
    <div className="offline-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        width="100%"
        height="100%"
        aria-label="You are offline"
        role="img"
      >
        <defs>
          {/* ── Gradients ── */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sky-top)" />
            <stop offset="100%" stopColor="var(--sky-bottom)" />
          </linearGradient>

          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ground-top)" />
            <stop offset="100%" stopColor="var(--ground-bottom)" />
          </linearGradient>

          <linearGradient id="towerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--tower-dark)" />
            <stop offset="50%" stopColor="var(--tower-mid)" />
            <stop offset="100%" stopColor="var(--tower-dark)" />
          </linearGradient>

          <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--screen-top)" />
            <stop offset="100%" stopColor="var(--screen-bottom)" />
          </linearGradient>

          <linearGradient id="routerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--router-top)" />
            <stop offset="100%" stopColor="var(--router-bottom)" />
          </linearGradient>

          <linearGradient id="cableGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--cable-a)" />
            <stop offset="100%" stopColor="var(--cable-b)" />
          </linearGradient>

          <radialGradient id="glowRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4444" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff4444" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="glowAmber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--sun-inner)" stopOpacity="1" />
            <stop offset="55%" stopColor="var(--sun-outer)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--sun-outer)" stopOpacity="0" />
          </radialGradient>

          {/* ── Filters ── */}
          <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="dropShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="var(--shadow-color)" floodOpacity="0.35" />
          </filter>

          {/* ── Patterns ── */}
          <pattern id="gridPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--grid-stroke)" strokeWidth="0.5" opacity="0.4" />
          </pattern>
          <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="var(--dot-fill)" opacity="0.3" />
          </pattern>

          {/* ── Clip Paths ── */}
          <clipPath id="screenClip">
            <rect x="218" y="270" width="164" height="110" rx="4" />
          </clipPath>
        </defs>

        {/* ════════════ SKY / BACKGROUND ════════════ */}
        <rect width="800" height="600" fill="url(#skyGrad)" />
        <rect width="800" height="600" fill="url(#gridPattern)" />

        {/* Celestial body glow halo */}
        <circle cx="680" cy="90" r="60" fill="url(#sunGlow)" className="celestial-glow" />
        {/* Core */}
        <circle cx="680" cy="90" r="30" fill="var(--celestial-core)" />
        {/* Moon craters */}
        <circle cx="672" cy="83" r="5" fill="var(--crater-fill)" opacity="var(--crater-opacity)" />
        <circle cx="688" cy="98" r="3.5" fill="var(--crater-fill)" opacity="var(--crater-opacity)" />
        <circle cx="675" cy="100" r="2.5" fill="var(--crater-fill)" opacity="var(--crater-opacity)" />
        {/* Sun rays */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
          <line
            key={i}
            x1={680 + Math.cos((angle * Math.PI) / 180) * 36}
            y1={90 + Math.sin((angle * Math.PI) / 180) * 36}
            x2={680 + Math.cos((angle * Math.PI) / 180) * 48}
            y2={90 + Math.sin((angle * Math.PI) / 180) * 48}
            stroke="var(--sun-ray)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="var(--sun-ray-opacity)"
          />
        ))}

        {/* Stars */}
        {([
          [50,40],[120,25],[200,60],[310,30],[390,15],[460,50],
          [530,20],[600,45],[150,80],[260,90],[350,70],[430,100],
          [80,110],[500,85],[570,110],[635,60],[720,130],
        ] as [number,number][]).map(([x,y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 2 : 1.2}
            fill="var(--star-fill)"
            opacity="var(--star-opacity)"
            className={`star star-${i % 3}`}
          />
        ))}

        {/* Cloud 1 */}
        <g opacity="var(--cloud-opacity)" className="cloud-1" transform="translate(60,130)">
          <ellipse cx="50" cy="20" rx="45" ry="18" fill="var(--cloud-fill)" />
          <ellipse cx="28" cy="26" rx="30" ry="14" fill="var(--cloud-fill)" />
          <ellipse cx="72" cy="26" rx="28" ry="13" fill="var(--cloud-fill)" />
          <ellipse cx="50" cy="30" rx="45" ry="12" fill="var(--cloud-fill)" />
        </g>
        {/* Cloud 2 */}
        <g opacity="var(--cloud-opacity)" className="cloud-2" transform="translate(550,160)">
          <ellipse cx="40" cy="18" rx="38" ry="15" fill="var(--cloud-fill)" />
          <ellipse cx="22" cy="23" rx="24" ry="12" fill="var(--cloud-fill)" />
          <ellipse cx="58" cy="23" rx="22" ry="11" fill="var(--cloud-fill)" />
          <ellipse cx="40" cy="27" rx="38" ry="10" fill="var(--cloud-fill)" />
        </g>
        {/* Storm cloud */}
        <g opacity="0.75" transform="translate(240,110)">
          <ellipse cx="70" cy="28" rx="65" ry="24" fill="var(--cloud-storm)" />
          <ellipse cx="40" cy="36" rx="42" ry="18" fill="var(--cloud-storm)" />
          <ellipse cx="100" cy="36" rx="38" ry="17" fill="var(--cloud-storm)" />
          <ellipse cx="70" cy="44" rx="65" ry="16" fill="var(--cloud-storm)" />
          {/* Lightning */}
          <path d="M72,50 L62,72 L70,72 L58,95 L80,65 L70,65 Z" fill="var(--lightning)" filter="url(#blur2)" opacity="0.5" className="lightning-glow" />
          <path d="M72,50 L62,72 L70,72 L58,95 L80,65 L70,65 Z" fill="var(--lightning)" className="lightning" />
        </g>

        {/* ════════════ GROUND / LANDSCAPE ════════════ */}
        <path d="M0,380 Q80,310 160,340 Q240,370 320,320 Q400,270 480,320 Q560,370 640,330 Q720,290 800,350 L800,600 L0,600 Z" fill="var(--hill-far)" opacity="0.5" />
        <path d="M0,420 Q100,360 200,390 Q300,420 400,370 Q500,320 600,380 Q700,440 800,400 L800,600 L0,600 Z" fill="var(--hill-mid)" opacity="0.7" />
        <path d="M0,470 Q200,450 400,460 Q600,470 800,455 L800,600 L0,600 Z" fill="url(#groundGrad)" />
        <path d="M0,470 Q200,450 400,460 Q600,470 800,455 L800,600 L0,600 Z" fill="url(#dotPattern)" opacity="0.4" />
        {/* Road */}
        <path d="M280,600 Q340,530 360,480 Q370,460 400,455 Q430,450 440,480 Q460,530 520,600 Z" fill="var(--road)" opacity="0.6" />
        <path d="M398,470 Q399,490 400,510 Q401,530 400,560" stroke="var(--road-line)" strokeWidth="2" strokeDasharray="8,6" strokeLinecap="round" fill="none" opacity="0.5" />

        {/* ════════════ CELL TOWER ════════════ */}
        <g transform="translate(110,160)">
          <polygon points="40,0 50,0 72,280 18,280" fill="url(#towerGrad)" />
          {[40,80,120,160,200,240].map((y, i) => (
            <g key={i}>
              <line x1={18+(y/280)*22} y1={y} x2={72-(y/280)*22} y2={y+40} stroke="var(--tower-brace)" strokeWidth="1.5" opacity="0.6" />
              <line x1={72-(y/280)*22} y1={y} x2={18+(y/280)*22} y2={y+40} stroke="var(--tower-brace)" strokeWidth="1.5" opacity="0.6" />
              <line x1={18+(y/280)*22} y1={y} x2={72-(y/280)*22} y2={y} stroke="var(--tower-bar)" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          {/* Dish */}
          <rect x="50" y="-15" width="4" height="20" fill="var(--tower-bar)" />
          <ellipse cx="64" cy="-18" rx="14" ry="9" fill="none" stroke="var(--tower-bar)" strokeWidth="2" />
          <line x1="52" y1="-15" x2="50" y2="-22" stroke="var(--tower-bar)" strokeWidth="1.5" />
          <line x1="54" y1="-15" x2="64" y2="-26" stroke="var(--tower-bar)" strokeWidth="1.5" />
          {/* Status blink */}
          <circle cx="45" cy="-28" r="10" fill="url(#glowRed)" className="blink" />
          <circle cx="45" cy="-28" r="4" fill="#ff3333" />
          {/* Foundation */}
          <rect x="10" y="278" width="70" height="10" rx="4" fill="var(--tower-base)" />
          <rect x="0" y="285" width="90" height="6" rx="3" fill="var(--tower-base)" opacity="0.7" />
          {/* Broken signal arcs */}
          <path d="M-30,-5 Q-10,-25 10,-5" fill="none" stroke="var(--signal-arc)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
          <path d="M-44,-2 Q-10,-40 24,-2" fill="none" stroke="var(--signal-arc)" strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
          <path d="M-58,2 Q-10,-55 38,2" fill="none" stroke="var(--signal-arc)" strokeWidth="2" strokeLinecap="round" opacity="0.08" />
          {/* X mark */}
          <line x1="-14" y1="-22" x2="14" y2="2" stroke="#ff4444" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="14" y1="-22" x2="-14" y2="2" stroke="#ff4444" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* ════════════ LAPTOP ════════════ */}
        <g filter="url(#dropShadow)">
          {/* Lid */}
          <rect x="205" y="260" width="190" height="130" rx="10" fill="var(--laptop-body)" />
          <rect x="210" y="265" width="180" height="120" rx="8" fill="var(--bezel)" />
          <rect x="218" y="270" width="164" height="110" rx="4" fill="url(#screenGrad)" />

          {/* Screen content */}
          <g clipPath="url(#screenClip)">
            {Array.from({length:18}).map((_,i) => (
              <rect key={i} x="218" y={270+i*6} width="164" height="3" fill="var(--scanline)" opacity="0.05" />
            ))}
            {/* Status bar */}
            <rect x="218" y="270" width="164" height="10" fill="var(--status-bar)" opacity="0.7" />
            <circle cx="224" cy="275" r="2.5" fill="#ff5f57" />
            <circle cx="231" cy="275" r="2.5" fill="#febc2e" />
            <circle cx="238" cy="275" r="2.5" fill="#28c840" opacity="0.4" />
            {/* Wifi broken */}
            <g transform="translate(300,302)">
              <path d="M-22,-18 Q0,-36 22,-18" fill="none" stroke="var(--wifi-stroke)" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
              <path d="M-15,-10 Q0,-22 15,-10" fill="none" stroke="var(--wifi-stroke)" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
              <path d="M-8,-3 Q0,-10 8,-3" fill="none" stroke="var(--wifi-stroke)" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
              <circle cx="0" cy="3" r="3" fill="var(--wifi-stroke)" opacity="0.25" />
              <line x1="-24" y1="-22" x2="24" y2="8" stroke="#ff4444" strokeWidth="3" strokeLinecap="round" />
              <line x1="24" y1="-22" x2="-24" y2="8" stroke="#ff4444" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Text placeholders */}
            <rect x="250" y="322" width="100" height="6" rx="3" fill="var(--text-line)" opacity="0.9" />
            <rect x="262" y="333" width="76" height="4" rx="2" fill="var(--text-line)" opacity="0.5" />
            <rect x="272" y="342" width="56" height="4" rx="2" fill="var(--text-line)" opacity="0.3" />
            {/* Retry button */}
            <rect x="264" y="354" width="72" height="18" rx="9" fill="var(--btn-fill)" opacity="0.8" />
            <rect x="278" y="359" width="44" height="4" rx="2" fill="var(--btn-text)" opacity="0.9" />
          </g>

          {/* Camera */}
          <circle cx="300" cy="268" r="2.5" fill="var(--camera)" />

          {/* Base */}
          <rect x="195" y="390" width="210" height="14" rx="5" fill="var(--laptop-body)" />
          <rect x="240" y="393" width="120" height="8" rx="3" fill="var(--keyboard-base)" opacity="0.4" />
          {Array.from({length:12}).map((_,i) => (
            <rect key={i} x={244+i*9.5} y={394} width="7" height="5" rx="1.5" fill="var(--key)" opacity="0.5" />
          ))}
          <rect x="271" y="403" width="58" height="38" rx="6" fill="var(--trackpad)" opacity="0.35" />
          <rect x="195" y="388" width="210" height="5" rx="2" fill="var(--hinge)" />
        </g>

        {/* ════════════ ROUTER ════════════ */}
        <g transform="translate(355,368)" filter="url(#dropShadow)">
          <rect x="0" y="0" width="90" height="44" rx="8" fill="url(#routerGrad)" />
          {[12,18,24,30,36].map((x,i) => (
            <rect key={i} x={x} y="6" width="1.5" height="16" rx="1" fill="var(--vent)" opacity="0.4" />
          ))}
          {/* LEDs */}
          <circle cx="58" cy="14" r="5" fill="url(#glowRed)" className="blink" />
          <circle cx="58" cy="14" r="2.5" fill="#ff3333" />
          <circle cx="68" cy="14" r="5" fill="url(#glowAmber)" className="blink-slow" />
          <circle cx="68" cy="14" r="2.5" fill="#ffaa00" />
          <circle cx="78" cy="14" r="3" fill="var(--led-off)" opacity="0.4" />
          {/* Label */}
          <rect x="10" y="28" width="50" height="3" rx="1.5" fill="var(--vent)" opacity="0.25" />
          <rect x="10" y="34" width="35" height="2" rx="1" fill="var(--vent)" opacity="0.15" />
          {/* Antennas */}
          <rect x="8" y="-28" width="3" height="30" rx="1.5" fill="var(--antenna)" />
          <circle cx="9.5" cy="-30" r="2.5" fill="var(--antenna)" />
          <g transform="rotate(15,81,-22)">
            <rect x="79" y="-22" width="3" height="24" rx="1.5" fill="var(--antenna)" />
            <circle cx="80.5" cy="-24" r="2.5" fill="var(--antenna)" />
          </g>
        </g>

        {/* ════════════ BROKEN CABLE ════════════ */}
        <path d="M405,395 Q405,430 390,435 Q375,440 370,438" fill="none" stroke="url(#cableGrad)" strokeWidth="5" strokeLinecap="round" />
        <path d="M355,435 Q348,432 345,425 Q342,415 355,412" fill="none" stroke="url(#cableGrad)" strokeWidth="5" strokeLinecap="round" />
        {/* Break sparks */}
        <circle cx="363" cy="437" r="14" fill="url(#glowRed)" opacity="0.45" className="blink" />
        <path d="M360,432 L366,438 L360,441 L368,448" stroke="#ff6644" strokeWidth="2.5" strokeLinecap="round" fill="none" className="spark" />
        <path d="M358,436 L354,429" stroke="#ffcc00" strokeWidth="1.5" strokeLinecap="round" className="spark" />
        <path d="M367,434 L371,427" stroke="#ffcc00" strokeWidth="1.5" strokeLinecap="round" className="spark" />
        {/* Frayed ends */}
        <path d="M370,437 L374,433 M370,438 L375,441 M370,439 L372,444" stroke="var(--cable-a)" strokeWidth="2" strokeLinecap="round" />
        <path d="M356,435 L352,431 M357,437 L351,439 M356,440 L353,444" stroke="var(--cable-b)" strokeWidth="2" strokeLinecap="round" />

        {/* ════════════ DISABLED SIGNAL WAVES ════════════ */}
        <g transform="translate(400,375)" opacity="0.15">
          <path d="M-30,0 Q0,-50 30,0" fill="none" stroke="var(--signal-arc)" strokeWidth="3" strokeLinecap="round" />
          <path d="M-50,0 Q0,-80 50,0" fill="none" stroke="var(--signal-arc)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M-70,0 Q0,-110 70,0" fill="none" stroke="var(--signal-arc)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ════════════ FLOATING ERROR PACKETS ════════════ */}
        <g className="packet-1">
          <rect x="480" y="300" width="36" height="24" rx="5" fill="var(--packet-bg)" opacity="0.85" />
          <rect x="484" y="305" width="28" height="3" rx="1.5" fill="var(--packet-line)" opacity="0.6" />
          <rect x="484" y="311" width="20" height="3" rx="1.5" fill="var(--packet-line)" opacity="0.4" />
          <rect x="484" y="317" width="24" height="3" rx="1.5" fill="var(--packet-line)" opacity="0.3" />
          <rect x="502" y="294" width="22" height="13" rx="4" fill="#ff4444" />
          <text x="513" y="304" fontSize="8" fontFamily="monospace" fill="white" textAnchor="middle" fontWeight="bold">ERR</text>
        </g>
        <g className="packet-2">
          <rect x="150" y="350" width="32" height="22" rx="4" fill="var(--packet-bg)" opacity="0.8" />
          <rect x="154" y="355" width="24" height="3" rx="1.5" fill="var(--packet-line)" opacity="0.5" />
          <rect x="154" y="361" width="16" height="3" rx="1.5" fill="var(--packet-line)" opacity="0.35" />
          <rect x="154" y="366" width="20" height="3" rx="1.5" fill="var(--packet-line)" opacity="0.25" />
          <rect x="168" y="345" width="22" height="13" rx="4" fill="#ff8800" />
          <text x="179" y="355" fontSize="8" fontFamily="monospace" fill="white" textAnchor="middle" fontWeight="bold">504</text>
        </g>

        {/* ════════════ BINARY STREAM ════════════ */}
        <g opacity="var(--binary-opacity)" fontFamily="monospace" fontSize="9" fill="var(--binary-fill)" className="binary-stream">
          <text x="540" y="220">01001110 01000101 01010100</text>
          <text x="555" y="232">01010111 01001111 01010010</text>
          <text x="548" y="244">01001011 00100001 00000000</text>
        </g>

        {/* ════════════ TREES ════════════ */}
        <g transform="translate(620,390)">
          <polygon points="20,0 40,70 0,70" fill="var(--tree)" opacity="0.7" />
          <polygon points="20,20 44,80 -4,80" fill="var(--tree)" opacity="0.8" />
          <polygon points="20,40 46,90 -6,90" fill="var(--tree)" opacity="0.9" />
          <rect x="17" y="88" width="6" height="16" fill="var(--tree-trunk)" />
        </g>
        <g transform="translate(658,405)">
          <polygon points="16,0 32,55 0,55" fill="var(--tree)" opacity="0.65" />
          <polygon points="16,18 34,64 -2,64" fill="var(--tree)" opacity="0.75" />
          <polygon points="16,34 36,74 -4,74" fill="var(--tree)" opacity="0.85" />
          <rect x="13" y="72" width="6" height="13" fill="var(--tree-trunk)" />
        </g>
        <g transform="translate(80,415)">
          <polygon points="16,0 30,50 2,50" fill="var(--tree)" opacity="0.45" />
          <polygon points="16,16 32,60 0,60" fill="var(--tree)" opacity="0.55" />
          <rect x="13" y="58" width="5" height="12" fill="var(--tree-trunk)" opacity="0.5" />
        </g>

        {/* Ground fog */}
        <ellipse cx="400" cy="500" rx="200" ry="20" fill="var(--fog)" opacity="0.15" filter="url(#blur6)" />

        {/* ════════════ CSS VARIABLES & ANIMATIONS ════════════ */}
        <style>{`
          /* ── LIGHT MODE ── */
          :root {
            --sky-top: #bcd8f5;
            --sky-bottom: #e8f4fb;
            --ground-top: #c8d8a0;
            --ground-bottom: #a0b870;
            --hill-far: #90b870;
            --hill-mid: #78a860;
            --road: #94908a;
            --road-line: #e8e4d0;

            --celestial-core: #ffd700;
            --sun-inner: #fff176;
            --sun-outer: #ffe082;
            --sun-ray: #ffd54f;
            --sun-ray-opacity: 1;
            --crater-fill: transparent;
            --crater-opacity: 0;

            --star-fill: #fff;
            --star-opacity: 0;
            --cloud-fill: #fff;
            --cloud-storm: #9daab8;
            --cloud-opacity: 0.9;
            --lightning: #ffe066;

            --tower-dark: #7a8c9e;
            --tower-mid: #aabcce;
            --tower-brace: #5a6c7e;
            --tower-bar: #8a9cae;
            --tower-base: #6a7c8e;
            --antenna: #8a9cae;
            --signal-arc: #9ab0c8;

            --laptop-body: #d0d8e0;
            --bezel: #1a1a2e;
            --screen-top: #0d1b2a;
            --screen-bottom: #1a2a3a;
            --camera: #2a3a4a;
            --keyboard-base: #b0b8c0;
            --key: #a0a8b0;
            --trackpad: #b8c0c8;
            --hinge: #a0a8b0;
            --status-bar: #0f1729;
            --scanline: #fff;
            --wifi-stroke: #8ab4d4;
            --text-line: #5a8aa0;
            --btn-fill: #1a5a7a;
            --btn-text: #fff;

            --router-top: #c0c8d0;
            --router-bottom: #909aa4;
            --vent: #606870;
            --led-off: #404850;

            --cable-a: #e08040;
            --cable-b: #c06030;
            --packet-bg: #d8e4f0;
            --packet-line: #4a6a8a;

            --tree: #4a7a3a;
            --tree-trunk: #5a4030;
            --fog: #c8e8f8;
            --shadow-color: #20406080;
            --grid-stroke: #6090b0;
            --dot-fill: #4080a0;
            --binary-fill: #3070a0;
            --binary-opacity: 0.12;
          }

          /* ── DARK MODE ── */
          @media (prefers-color-scheme: dark) {
            :root {
              --sky-top: #060d1a;
              --sky-bottom: #0d1a30;
              --ground-top: #1a2a1a;
              --ground-bottom: #101810;
              --hill-far: #152015;
              --hill-mid: #1a2818;
              --road: #282420;
              --road-line: #3a3620;

              --celestial-core: #e8e4c0;
              --sun-inner: #f5f2e0;
              --sun-outer: #d8d4b0;
              --sun-ray: #ffd54f;
              --sun-ray-opacity: 0;
              --crater-fill: #c0b890;
              --crater-opacity: 0.35;

              --star-fill: #e8f0ff;
              --star-opacity: 0.85;
              --cloud-fill: #2a3850;
              --cloud-storm: #1a2840;
              --cloud-opacity: 0.6;
              --lightning: #ffe866;

              --tower-dark: #1e2a38;
              --tower-mid: #2e3e50;
              --tower-brace: #0e1a28;
              --tower-bar: #3a4e62;
              --tower-base: #1a2838;
              --antenna: #3a4e62;
              --signal-arc: #2a4060;

              --laptop-body: #1e2838;
              --bezel: #080d14;
              --screen-top: #040810;
              --screen-bottom: #0a1422;
              --camera: #3a4e62;
              --keyboard-base: #162030;
              --key: #1e2e40;
              --trackpad: #162030;
              --hinge: #0e1a28;
              --status-bar: #02040a;
              --scanline: #fff;
              --wifi-stroke: #4a7090;
              --text-line: #3a6080;
              --btn-fill: #0d3050;
              --btn-text: #a0c8e0;

              --router-top: #1e2838;
              --router-bottom: #0e1820;
              --vent: #3a4e62;
              --led-off: #1e2838;

              --cable-a: #a06030;
              --cable-b: #804020;
              --packet-bg: #1a2838;
              --packet-line: #3a6080;

              --tree: #1a3020;
              --tree-trunk: #2a1810;
              --fog: #0a2040;
              --shadow-color: #00000090;
              --grid-stroke: #1a3050;
              --dot-fill: #1a3050;
              --binary-fill: #1a5080;
              --binary-opacity: 0.2;
            }
          }

          /* ── Animations ── */
          @keyframes blink {
            0%,100% { opacity:1; }
            50% { opacity:0.1; }
          }
          @keyframes blinkSlow {
            0%,100% { opacity:0.8; }
            60% { opacity:0.25; }
          }
          @keyframes floatUp1 {
            0%,100% { transform:translateY(0) rotate(0deg); }
            50% { transform:translateY(-8px) rotate(3deg); }
          }
          @keyframes floatUp2 {
            0%,100% { transform:translateY(0) rotate(0deg); }
            50% { transform:translateY(7px) rotate(-4deg); }
          }
          @keyframes drift1 {
            0%,100% { transform:translate(60px,130px); }
            50% { transform:translate(74px,130px); }
          }
          @keyframes drift2 {
            0%,100% { transform:translate(550px,160px); }
            50% { transform:translate(536px,160px); }
          }
          @keyframes lightning {
            0%,82%,100% { opacity:0; }
            86% { opacity:1; }
            90% { opacity:0.15; }
            94% { opacity:0.8; }
          }
          @keyframes lightGlow {
            0%,82%,100% { opacity:0; }
            86% { opacity:0.7; }
            90% { opacity:0.05; }
            94% { opacity:0.5; }
          }
          @keyframes spark {
            0%,100% { opacity:0.95; transform:scale(1); }
            40% { opacity:0.4; transform:scale(0.85) rotate(12deg); }
            70% { opacity:1; transform:scale(1.12) rotate(-6deg); }
          }
          @keyframes starTwinkle0 {
            0%,100% { opacity:0.85; }
            50% { opacity:0.2; }
          }
          @keyframes starTwinkle1 {
            0%,100% { opacity:0.55; }
            50% { opacity:1; }
          }
          @keyframes starTwinkle2 {
            0%,100% { opacity:0.75; }
            35% { opacity:0.15; }
            70% { opacity:1; }
          }
          @keyframes binScroll {
            0% { transform:translateY(0); }
            100% { transform:translateY(8px); opacity:0; }
          }

          .blink { animation:blink 1.4s ease-in-out infinite; }
          .blink-slow { animation:blinkSlow 2.2s ease-in-out infinite; }
          .packet-1 { animation:floatUp1 3.5s ease-in-out infinite; }
          .packet-2 { animation:floatUp2 4.2s ease-in-out infinite; }
          .cloud-1 { animation:drift1 8s ease-in-out infinite; }
          .cloud-2 { animation:drift2 10s ease-in-out infinite; }
          .lightning { animation:lightning 5s ease-in-out infinite; }
          .lightning-glow { animation:lightGlow 5s ease-in-out infinite; }
          .spark { animation:spark 0.65s ease-in-out infinite; }
          .star-0 { animation:starTwinkle0 2.5s ease-in-out infinite; }
          .star-1 { animation:starTwinkle1 3.1s ease-in-out infinite 0.5s; }
          .star-2 { animation:starTwinkle2 2.8s ease-in-out infinite 1.2s; }
          .binary-stream { animation:binScroll 3s linear infinite; }
          .celestial-glow { animation:blinkSlow 4s ease-in-out infinite; }
        `}</style>
      </svg>

      <style>{`
        .offline-wrapper {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          display: block;
        }
        .offline-wrapper svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }
      `}</style>
    </div>
  )
}

export default OffLineIllustration