import { useState, useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import './index.css';

export type MoodKey =
  | 'excited' | 'confident' | 'nervous' | 'confused'
  | 'anxious' | 'sad' | 'humiliated' | 'isolated'
  | 'gaslit' | 'hopeful' | 'angry' | 'violated'
  | 'empowered' | 'broken' | 'determined';

interface MoodConfig {
  headTilt: number;
  eyeState: 'normal' | 'happy' | 'sad' | 'angry' | 'scared' | 'closed';
  mouthState: 'neutral' | 'smile' | 'frown' | 'open' | 'grimace' | 'teeth';
  bodyLean: number;
  leftArmAngle: number;
  rightArmAngle: number;
  leftArmBend: number;
  rightArmBend: number;
  leftFist: boolean;
  rightFist: boolean;
  color: string;
  shirtDark: string;
  blush: boolean;
  sweat: boolean;
  tears: boolean;
  shake: boolean;
  droop: number;
  armHang: number;
  label: string;
}

const MOOD: Record<MoodKey, MoodConfig> = {
  excited:    { headTilt: -5,  eyeState: 'happy',  mouthState: 'smile',   bodyLean: 5,  leftArmAngle: -20, rightArmAngle: 20,  leftArmBend: 10, rightArmBend: 10, leftFist: false, rightFist: false, color: '#fef9c3', shirtDark: '#fde047', blush: true,  sweat: false, tears: false, shake: false, droop: 0,    armHang: 0,   label: '充满期待' },
  confident:  { headTilt: 0,   eyeState: 'normal', mouthState: 'smile',   bodyLean: 0,  leftArmAngle: -30, rightArmAngle: 30,  leftArmBend: 0,  rightArmBend: 0,  leftFist: false, rightFist: false, color: '#bfdbfe', shirtDark: '#93c5fd', blush: false, sweat: false, tears: false, shake: false, droop: 0,    armHang: 0,   label: '自信满满' },
  nervous:    { headTilt: 6,   eyeState: 'scared', mouthState: 'neutral', bodyLean: -3, leftArmAngle: -60, rightArmAngle: 40,  leftArmBend: 20, rightArmBend: 0,  leftFist: false, rightFist: false, color: '#fed7aa', shirtDark: '#fb923c', blush: false, sweat: true,  tears: false, shake: false, droop: 0,    armHang: 0,   label: '紧张不安' },
  confused:   { headTilt: 12,  eyeState: 'sad',    mouthState: 'neutral', bodyLean: -5, leftArmAngle: -40, rightArmAngle: 40,  leftArmBend: 20, rightArmBend: 20, leftFist: false, rightFist: false, color: '#e5e7eb', shirtDark: '#9ca3af', blush: false, sweat: false, tears: false, shake: false, droop: 0,    armHang: 0,   label: '困惑不解' },
  anxious:    { headTilt: 5,   eyeState: 'scared', mouthState: 'open',    bodyLean: -4, leftArmAngle: -70, rightArmAngle: 70,  leftArmBend: 30, rightArmBend: 30, leftFist: false, rightFist: false, color: '#fde68a', shirtDark: '#f59e0b', blush: false, sweat: true,  tears: false, shake: true,  droop: 0.3,  armHang: 0.3, label: '焦虑不安' },
  sad:        { headTilt: 20,  eyeState: 'sad',    mouthState: 'frown',   bodyLean: -10, leftArmAngle: -60, rightArmAngle: 60,  leftArmBend: 50, rightArmBend: 50, leftFist: false, rightFist: false, color: '#ddd6fe', shirtDark: '#a78bfa', blush: false, sweat: false, tears: true,  shake: false, droop: 0.5,  armHang: 0.5, label: '难过失落' },
  humiliated: { headTilt: 25,  eyeState: 'sad',    mouthState: 'frown',   bodyLean: -15, leftArmAngle: -90, rightArmAngle: 90,  leftArmBend: 70, rightArmBend: 70, leftFist: true,  rightFist: true,  color: '#fce7f3', shirtDark: '#f9a8d4', blush: true,  sweat: false, tears: true,  shake: true,  droop: 0.8,  armHang: 0.7, label: '被羞辱了' },
  isolated:   { headTilt: 18,  eyeState: 'sad',    mouthState: 'neutral', bodyLean: -10, leftArmAngle: -80, rightArmAngle: 80,  leftArmBend: 60, rightArmBend: 60, leftFist: false, rightFist: false, color: '#f3f4f6', shirtDark: '#d1d5db', blush: false, sweat: false, tears: false, shake: false, droop: 0.7,  armHang: 0.6, label: '被孤立' },
  gaslit:     { headTilt: 15,  eyeState: 'sad',    mouthState: 'neutral', bodyLean: -8,  leftArmAngle: -70, rightArmAngle: 70,  leftArmBend: 50, rightArmBend: 50, leftFist: false, rightFist: false, color: '#fde68a', shirtDark: '#d97706', blush: false, sweat: false, tears: false, shake: false, droop: 0.6,  armHang: 0.5, label: '自我怀疑' },
  hopeful:    { headTilt: -3,  eyeState: 'happy',  mouthState: 'smile',   bodyLean: 3,  leftArmAngle: -10, rightArmAngle: 10,  leftArmBend: 0,  rightArmBend: 0,  leftFist: false, rightFist: false, color: '#bbf7d0', shirtDark: '#4ade80', blush: true,  sweat: false, tears: false, shake: false, droop: 0,    armHang: 0,   label: '心存希望' },
  angry:      { headTilt: -10, eyeState: 'angry',  mouthState: 'teeth',   bodyLean: 12, leftArmAngle: -95, rightArmAngle: 95,  leftArmBend: 0,  rightArmBend: 0,  leftFist: true,  rightFist: true,  color: '#fecaca', shirtDark: '#ef4444', blush: false, sweat: false, tears: false, shake: true,  droop: 0,    armHang: 0,   label: '愤怒不满' },
  violated:   { headTilt: 12,  eyeState: 'scared', mouthState: 'open',    bodyLean: -8, leftArmAngle: -90, rightArmAngle: 90,  leftArmBend: 40, rightArmBend: 40, leftFist: true,  rightFist: true,  color: '#fee2e2', shirtDark: '#dc2626', blush: false, sweat: true,  tears: false, shake: true,  droop: 0.4,  armHang: 0.4, label: '边界被侵犯' },
  empowered:  { headTilt: -10, eyeState: 'happy',  mouthState: 'smile',   bodyLean: 0,  leftArmAngle: -80, rightArmAngle: 80,  leftArmBend: 0,  rightArmBend: 0,  leftFist: false, rightFist: false, color: '#a7f3d0', shirtDark: '#34d399', blush: true,  sweat: false, tears: false, shake: false, droop: 0,    armHang: 0,   label: '充满力量' },
  broken:     { headTilt: 30,  eyeState: 'sad',    mouthState: 'frown',   bodyLean: -18, leftArmAngle: -80, rightArmAngle: 80,  leftArmBend: 80, rightArmBend: 80, leftFist: false, rightFist: false, color: '#d1d5db', shirtDark: '#9ca3af', blush: false, sweat: false, tears: true,  shake: false, droop: 1,    armHang: 0.9, label: '精疲力尽' },
  determined: { headTilt: -8,  eyeState: 'angry',  mouthState: 'neutral', bodyLean: 8,  leftArmAngle: -90, rightArmAngle: 90,  leftArmBend: 0,  rightArmBend: 0,  leftFist: true,  rightFist: true,  color: '#fef08a', shirtDark: '#f59e0b', blush: false, sweat: false, tears: false, shake: false, droop: 0,    armHang: 0,   label: '下定决心' },
};

function buildSvgString(cfg: MoodConfig, tearY1: number, tearY2: number, sweatY: number): string {
  const c = cfg.color;
  const sd = cfg.shirtDark;
  const crying = cfg.tears;
  const bl = cfg.bodyLean;
  const dt = cfg.droop;

  // Body group rotation origin: 50px 118px
  const bodyRot = bl * 0.35;
  // Head group rotation origin: 50px 45px
  const headRot = cfg.headTilt + dt * 20;
  const headTranslateY = dt * 8;

  // Left arm upper rotation origin: 28px 72px
  const leftUpperRot = cfg.leftArmAngle + cfg.armHang * 30 + (crying ? 10 : 0);
  // Left arm lower rotation origin: 18px 80px
  const leftLowerRot = cfg.leftArmBend + cfg.armHang * 40 + (cfg.leftFist ? -20 : 0);

  // Right arm upper rotation origin: 72px 72px
  const rightUpperRot = cfg.rightArmAngle - cfg.armHang * 30 - (crying ? 10 : 0);
  // Right arm lower rotation origin: 82px 80px
  const rightLowerRot = -(cfg.rightArmBend + cfg.armHang * 40) + (cfg.rightFist ? 20 : 0);

  // Eyebrow paths
  const leftBrowPath = cfg.eyeState === 'angry'
    ? 'M23 29 L37 33'
    : cfg.eyeState === 'sad'
    ? 'M23 30 Q30 33 37 31'
    : 'M23 31 Q30 28 37 31';
  const rightBrowPath = cfg.eyeState === 'angry'
    ? 'M63 33 L77 29'
    : cfg.eyeState === 'sad'
    ? 'M63 31 Q70 33 77 30'
    : 'M63 31 Q70 28 77 31';
  const browWidth = cfg.eyeState === 'angry' ? '3' : '2.5';

  // Left eye SVG
  function leftEye(): string {
    const base = '<ellipse cx="33" cy="39" rx="6.5" ry="5.5" fill="white"/>';
    switch (cfg.eyeState) {
      case 'normal':
        return base + '<ellipse cx="33" cy="39.5" rx="4.5" ry="5.5" fill="#1a1a2e"/>';
      case 'happy':
        return base + '<path d="M29 39 Q33 34 37 39" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
      case 'sad':
        return base + '<ellipse cx="33" cy="40.5" rx="4.5" ry="5" fill="#1a1a2e"/>' +
          '<path d="M28 33 L37 36" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>';
      case 'angry':
        return base + '<ellipse cx="33" cy="40.5" rx="4.5" ry="4.5" fill="#1a1a2e"/>' +
          '<path d="M28 33 L37 36" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/>';
      case 'scared':
        return base + '<ellipse cx="33" cy="39" rx="7" ry="8" fill="#1a1a2e"/>' +
          '<circle cx="33" cy="37" r="2.5" fill="white"/>';
      case 'closed':
        return base + '<path d="M29 39 Q33 43 37 39" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
      default:
        return base + '<ellipse cx="33" cy="39.5" rx="4.5" ry="5.5" fill="#1a1a2e"/>';
    }
  }

  // Right eye SVG
  function rightEye(): string {
    const base = '<ellipse cx="67" cy="39" rx="6.5" ry="5.5" fill="white"/>';
    switch (cfg.eyeState) {
      case 'normal':
        return base + '<ellipse cx="67" cy="39.5" rx="4.5" ry="5.5" fill="#1a1a2e"/>';
      case 'happy':
        return base + '<path d="M63 39 Q67 34 71 39" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
      case 'sad':
        return base + '<ellipse cx="67" cy="40.5" rx="4.5" ry="5" fill="#1a1a2e"/>' +
          '<path d="M63 36 L72 33" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>';
      case 'angry':
        return base + '<ellipse cx="67" cy="40.5" rx="4.5" ry="4.5" fill="#1a1a2e"/>' +
          '<path d="M63 36 L72 33" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/>';
      case 'scared':
        return base + '<ellipse cx="67" cy="39" rx="7" ry="8" fill="#1a1a2e"/>' +
          '<circle cx="67" cy="37" r="2.5" fill="white"/>';
      case 'closed':
        return base + '<path d="M63 39 Q67 43 71 39" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
      default:
        return base + '<ellipse cx="67" cy="39.5" rx="4.5" ry="5.5" fill="#1a1a2e"/>';
    }
  }

  // Mouth SVG
  function mouth(): string {
    switch (cfg.mouthState) {
      case 'neutral':
        return '<path d="M43 56 Q50 58 57 56" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
      case 'smile':
        return '<path d="M42 54 Q50 62 58 54" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
      case 'frown':
        return '<path d="M42 62 Q50 54 58 62" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
      case 'open':
        return '<ellipse cx="50" cy="57" rx="7" ry="7" fill="#1a1a2e"/>';
      case 'grimace':
        return '<path d="M42 55 Q46 50 50 56 Q54 62 58 55" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
      case 'teeth':
        return '<rect x="42" y="54" width="16" height="9" rx="2.5" fill="white"/>' +
          '<path d="M42 58 Q50 54 58 58" stroke="#1a1a2e" stroke-width="1.5" fill="none"/>' +
          '<path d="M44 54 L44 63 M47 54 L47 63 M50 54 L50 63 M53 54 L53 63 M56 54 L56 63" stroke="#ddd" stroke-width="0.5"/>';
      default:
        return '<path d="M43 56 Q50 58 57 56" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
    }
  }

  // Tears SVG (with animated Y positions from state)
  function tears(): string {
    if (!crying) return '';
    // tearY1 and tearY2 are the animated drop Y positions (0..1 = start..end)
    const drop1Y = 76 + tearY1 * 24;  // 76 → 100
    const drop2Y = 76 + tearY2 * 24;
    const drop1Opacity = (1 - tearY1) * 0.85;
    const drop2Opacity = (1 - tearY2) * 0.85;
    return (
      '<path d="M26 43 Q24 50 25 60 Q26 68 24 75" stroke="#60a5fa" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>' +
      `<circle cx="24" cy="${drop1Y.toFixed(1)}" r="3.5" fill="#60a5fa" opacity="${drop1Opacity.toFixed(2)}"/>` +
      '<path d="M74 43 Q76 50 75 60 Q74 68 76 75" stroke="#60a5fa" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>' +
      `<circle cx="76" cy="${drop2Y.toFixed(1)}" r="3.5" fill="#60a5fa" opacity="${drop2Opacity.toFixed(2)}"/>`
    );
  }

  // Sweat SVG (with animated Y position from state)
  function sweat(): string {
    if (!cfg.sweat) return '';
    const sy = 20 - sweatY * 4;  // 20 → 16
    const sOpacity = 0.85 - sweatY * 0.55;  // 0.85 → 0.30
    return `<ellipse cx="82" cy="${sy.toFixed(1)}" rx="3.5" ry="5" fill="#7dd3fc" opacity="${sOpacity.toFixed(2)}"/>`;
  }

  // Blush SVG
  function blush(): string {
    if (!cfg.blush) return '';
    return '<ellipse cx="20" cy="46" rx="8" ry="5" fill="#f87171" opacity="0.35"/>' +
      '<ellipse cx="80" cy="46" rx="8" ry="5" fill="#f87171" opacity="0.35"/>';
  }

  // Angry vein SVG
  function angryVein(): string {
    if (cfg.eyeState !== 'angry') return '';
    return '<path d="M78 18 Q82 12 85 16 Q82 20 78 18Z" fill="#dc2626" opacity="0.7"/>';
  }

  // Droopy hair side piece
  function droopyHair(): string {
    if (dt <= 0.5) return '';
    return '<path d="M17 32 Q12 45 15 55 Q20 48 22 40Z" fill="#3d2314" opacity="0.7"/>';
  }

  // Left fist / fingers
  function leftHand(): string {
    if (cfg.leftFist) {
      return '<circle cx="18" cy="93" r="8" fill="#fcd9b8"/>' +
        '<rect x="11" y="86" width="14" height="14" rx="4" fill="#fcd9b8"/>';
    }
    return '<circle cx="18" cy="93" r="6.5" fill="#fcd9b8"/>' +
      '<ellipse cx="12" cy="101" rx="2.2" ry="3.5" fill="#fcd9b8"/>' +
      '<ellipse cx="14.8" cy="101" rx="2.2" ry="3.5" fill="#fcd9b8"/>' +
      '<ellipse cx="17.6" cy="101" rx="2.2" ry="3.5" fill="#fcd9b8"/>' +
      '<ellipse cx="20.4" cy="101" rx="2.2" ry="3.5" fill="#fcd9b8"/>';
  }

  // Right fist / fingers
  function rightHand(): string {
    if (cfg.rightFist) {
      return '<circle cx="82" cy="93" r="8" fill="#fcd9b8"/>' +
        '<rect x="75" y="86" width="14" height="14" rx="4" fill="#fcd9b8"/>';
    }
    return '<circle cx="82" cy="93" r="6.5" fill="#fcd9b8"/>' +
      '<ellipse cx="76" cy="101" rx="2.2" ry="3.5" fill="#fcd9b8"/>' +
      '<ellipse cx="78.8" cy="101" rx="2.2" ry="3.5" fill="#fcd9b8"/>' +
      '<ellipse cx="81.6" cy="101" rx="2.2" ry="3.5" fill="#fcd9b8"/>' +
      '<ellipse cx="84.4" cy="101" rx="2.2" ry="3.5" fill="#fcd9b8"/>';
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 165" overflow="visible">
  <!-- Shadow -->
  <ellipse cx="${(50 + bl * 0.4).toFixed(1)}" cy="161" rx="${(28 - dt * 5).toFixed(1)}" ry="${(5 - dt * 2).toFixed(1)}" fill="rgba(0,0,0,0.08)"/>

  <!-- Body group -->
  <g transform="rotate(${bodyRot.toFixed(2)},50,118)">
    <!-- Legs -->
    <rect x="35" y="118" width="12" height="40" rx="6" fill="${c}"/>
    <rect x="53" y="118" width="12" height="40" rx="6" fill="${c}"/>
    <ellipse cx="41" cy="157" rx="10" ry="6" fill="#4a3728"/>
    <ellipse cx="59" cy="157" rx="10" ry="6" fill="#4a3728"/>

    <!-- Body -->
    <rect x="28" y="65" width="44" height="56" rx="13" fill="${c}"/>
    <rect x="28" y="65" width="44" height="56" rx="13" fill="${sd}" opacity="0.15"/>
    <path d="M40 65 L50 78 L60 65" fill="white" opacity="0.6"/>
    <rect x="46" y="68" width="8" height="50" rx="4" fill="${sd}" opacity="0.08"/>

    <!-- Left Arm upper -->
    <g transform="rotate(${leftUpperRot.toFixed(2)},28,72)">
      <rect x="7" y="66" width="23" height="14" rx="7" fill="${c}"/>
      <!-- Left Arm lower -->
      <g transform="rotate(${leftLowerRot.toFixed(2)},18,80)">
        <rect x="8" y="78" width="20" height="13" rx="6.5" fill="${c}" opacity="0.92"/>
        ${leftHand()}
      </g>
    </g>

    <!-- Right Arm upper -->
    <g transform="rotate(${rightUpperRot.toFixed(2)},72,72)">
      <rect x="70" y="66" width="23" height="14" rx="7" fill="${c}"/>
      <!-- Right Arm lower -->
      <g transform="rotate(${rightLowerRot.toFixed(2)},82,80)">
        <rect x="72" y="78" width="20" height="13" rx="6.5" fill="${c}" opacity="0.92"/>
        ${rightHand()}
      </g>
    </g>

    <!-- Neck -->
    <rect x="43" y="55" width="14" height="14" rx="5" fill="#fcd9b8"/>

    <!-- Head group -->
    <g transform="rotate(${headRot.toFixed(2)},50,45) translate(0,${headTranslateY.toFixed(2)})">
      <circle cx="50" cy="38" r="33" fill="#fcd9b8"/>

      <!-- Hair -->
      <path d="M17 32 Q17 7 50 7 Q83 7 83 32 Q77 14 50 14 Q23 14 17 32Z" fill="#3d2314"/>
      <path d="M17 38 Q13 27 18 19 Q22 28 22 41Z" fill="#3d2314"/>
      <path d="M83 38 Q87 27 82 19 Q78 28 78 41Z" fill="#3d2314"/>
      ${droopyHair()}

      <!-- Eyebrows -->
      <path d="${leftBrowPath}" stroke="#3d2314" stroke-width="${browWidth}" stroke-linecap="round" fill="none"/>
      <path d="${rightBrowPath}" stroke="#3d2314" stroke-width="${browWidth}" stroke-linecap="round" fill="none"/>

      <!-- Left eye -->
      ${leftEye()}

      <!-- Right eye -->
      ${rightEye()}

      <!-- Nose -->
      <path d="M48 47 Q50 50 52 47" stroke="#d4a882" stroke-width="1.5" fill="none" stroke-linecap="round"/>

      <!-- Mouth -->
      ${mouth()}

      <!-- Blush -->
      ${blush()}

      <!-- Tears -->
      ${tears()}

      <!-- Sweat -->
      ${sweat()}

      <!-- Angry vein -->
      ${angryVein()}
    </g>
  </g>
</svg>`;
}

interface Props {
  mood: MoodKey;
  size?: number;
  showLabel?: boolean;
}

export default function DigitalHuman({ mood, size = 120, showLabel = true }: Props) {
  const cfg = MOOD[mood] || MOOD.confident;

  const [tearY1, setTearY1] = useState(0);
  const [tearY2, setTearY2] = useState(0.5);
  const [sweatY, setSweatY] = useState(0);

  useEffect(() => {
    if (!cfg.tears && !cfg.sweat) return;

    const timer = setInterval(() => {
      if (cfg.tears) {
        setTearY1(prev => {
          const next = prev + 0.08;
          return next > 1 ? 0 : next;
        });
        setTearY2(prev => {
          const next = prev + 0.07;
          return next > 1 ? 0 : next;
        });
      }
      if (cfg.sweat) {
        setSweatY(prev => {
          const next = prev + 0.1;
          return next > 1 ? 0 : next;
        });
      }
    }, 100);

    return () => clearInterval(timer);
  }, [cfg.tears, cfg.sweat]);

  const svg = buildSvgString(cfg, tearY1, tearY2, sweatY);
  const b64 = typeof btoa !== 'undefined'
    ? btoa(unescape(encodeURIComponent(svg)))
    : Buffer.from(svg).toString('base64');

  const imgHeight = size * 165 / 100;

  return (
    <View
      className={`digital-human-wrap${cfg.shake ? ' digital-human-shake' : ''}`}
      style={{ width: size, position: 'relative' } as any}
    >
      <Image
        src={`data:image/svg+xml;base64,${b64}`}
        style={{ width: size, height: imgHeight } as any}
        mode="aspectFit"
      />
      {showLabel && (
        <Text className="digital-human-label">{cfg.label}</Text>
      )}    </View>
  );
}
