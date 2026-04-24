import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollyStory.module.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 192;
const SCENES       = ['scene1', 'scene2', 'scene3'];
const SCENE_COUNT  = 3;
const VH_PER_SCENE = 500;   // ← slow, deliberate scroll

/*
  Each beat: { start, end, label, lines:[{text,cls}], enter, align, vpos }
  cls = 'hero' (large) | 'sub' (small supporting)
  enter = direction the lines slide in from
*/
const BEATS = [
  // ── Scene 1 ──────────────────────────────────────────────
  [
    {
      start: 0.0, end: 0.30,
      label: 'THE CRISIS',
      lines: [
        { text: '600 million',          cls: 'hero' },
        { text: 'litres of oil.',       cls: 'hero' },
        { text: 'Dumped illegally into our oceans — every year.', cls: 'sub' },
      ],
      enter: 'bottom', align: 'left', vpos: 'bottom',
    },
    {
      start: 0.68, end: 1.0,
      label: 'INVISIBLE',
      lines: [
        { text: 'Hidden beneath',  cls: 'hero' },
        { text: 'the surface.',    cls: 'hero' },
        { text: 'Undetected. Unpunished. Until now.', cls: 'sub' },
      ],
      enter: 'right', align: 'right', vpos: 'center',
    },
  ],
  // ── Scene 2 ──────────────────────────────────────────────
  [
    {
      start: 0.0, end: 0.30,
      label: 'ESA SENTINEL-1 SAR',
      lines: [
        { text: 'Sees through',      cls: 'hero' },
        { text: 'night and storms.', cls: 'hero' },
        { text: 'Where human eyes fail — Synthetic Aperture Radar sees.', cls: 'sub' },
      ],
      enter: 'top', align: 'center', vpos: 'top',
    },
    {
      start: 0.68, end: 1.0,
      label: 'GLOBAL SURVEILLANCE',
      lines: [
        { text: 'Every sea.',    cls: 'hero' },
        { text: 'Every 6 days.', cls: 'hero' },
        { text: 'Complete ocean coverage. Zero blind spots.', cls: 'sub' },
      ],
      enter: 'left', align: 'left', vpos: 'center',
    },
  ],
  // ── Scene 3 ──────────────────────────────────────────────
  [
    {
      start: 0.0, end: 0.30,
      label: 'AIS CROSS-REFERENCE',
      lines: [
        { text: 'The exact ship.',  cls: 'hero' },
        { text: 'The exact time.', cls: 'hero' },
        { text: 'AIS vessel tracking identifies the responsible vessel automatically.', cls: 'sub' },
      ],
      enter: 'bottom', align: 'center', vpos: 'bottom',
    },
    {
      start: 0.68, end: 1.0,
      label: '⚡  ALERT DISPATCHED',
      lines: [
        { text: 'Automated.',   cls: 'hero' },
        { text: 'Irrefutable.', cls: 'hero' },
        { text: 'Delivered to maritime authorities — in real time.', cls: 'sub' },
      ],
      enter: 'right', align: 'right', vpos: 'center',
    },
  ],
];

function buildFrameUrls(folder) {
  return Array.from({ length: TOTAL_FRAMES }, (_, i) => {
    const n = String(i + 1).padStart(5, '0');
    return `/frames/${folder}/${n}.jpg`;
  });
}

function usePreload(urls, enabled) {
  const [progress, setProgress] = useState(0);
  const [done,     setDone]     = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let loaded = 0;
    const imgs = urls.map(src => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        setProgress(loaded / urls.length);
        if (loaded === urls.length) setDone(true);
      };
      img.src = src;
      return img;
    });
    return () => imgs.forEach(img => { img.onload = null; img.onerror = null; });
  }, [enabled]); // eslint-disable-line
  return { progress, done };
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ScrollyStory() {
  const scrollSpaceRef = useRef(null);
  const imgRef         = useRef(null);
  const beatRef        = useRef(null);
  const accentRef      = useRef(null);
  const linesContRef   = useRef(null);
  const sceneNumRef    = useRef(null);
  const progressBarRef = useRef(null);

  const frameUrls = useMemo(() => SCENES.map(buildFrameUrls), []);

  const [preEnabled, setPreEnabled] = useState([true, false, false]);
  const preEnabledRef  = useRef([true, false, false]);
  const sceneReadyRef  = useRef([false, false, false]);
  const loadingIdxRef  = useRef(0);

  const [loaderPct, setLoaderPct] = useState(0);

  const pre0 = usePreload(frameUrls[0], preEnabled[0]);
  const pre1 = usePreload(frameUrls[1], preEnabled[1]);
  const pre2 = usePreload(frameUrls[2], preEnabled[2]);
  const pres = [pre0, pre1, pre2];

  useEffect(() => {
    pres.forEach(({ done }, i) => {
      if (done && !sceneReadyRef.current[i]) sceneReadyRef.current[i] = true;
    });
  }, [pre0.done, pre1.done, pre2.done]); // eslint-disable-line

  useEffect(() => {
    const idx = loadingIdxRef.current;
    const { progress, done } = pres[idx];
    setLoaderPct(done ? 100 : Math.round(progress * 100));
  }, [pre0.progress, pre1.progress, pre2.progress]); // eslint-disable-line

  // ── active beat tracking ──────────────────────────────────
  const activeBeatKey = useRef('');  // `${sceneIdx}-${beatIdx}`
  const lineEls       = useRef([]);

  const clearBeat = useCallback((onDone) => {
    const els = lineEls.current;
    if (!els.length) { onDone?.(); return; }
    els.forEach((el, i) => {
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        delay: i * 0.03,
        onComplete: i === els.length - 1 ? onDone : undefined,
      });
    });
    if (accentRef.current) gsap.to(accentRef.current, { opacity: 0, duration: 0.2 });
  }, []);

  const revealBeat = useCallback((beat) => {
    const container = linesContRef.current;
    if (!container) return;

    // Set alignment
    if (beatRef.current) {
      beatRef.current.dataset.align = beat.align;
      beatRef.current.dataset.vpos  = beat.vpos;
      beatRef.current.style.opacity = '1';
    }

    // Accent
    if (accentRef.current) {
      accentRef.current.textContent = beat.label;
      gsap.fromTo(accentRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 }
      );
    }

    // Build line elements
    container.innerHTML = '';
    lineEls.current = [];

    const getOffset = (enter) => {
      switch (enter) {
        case 'top':    return { y: -28, x: 0 };
        case 'left':   return { x: -40, y: 0 };
        case 'right':  return { x: 40,  y: 0 };
        default:       return { y: 28,  x: 0 };   // bottom
      }
    };
    const off = getOffset(beat.enter);

    beat.lines.forEach((line, i) => {
      const wrap = document.createElement('div');
      wrap.className = styles.lineWrap;

      const el = document.createElement('span');
      el.className = line.cls === 'hero' ? styles.lineHero : styles.lineSub;
      el.textContent = line.text;

      wrap.appendChild(el);
      container.appendChild(wrap);
      lineEls.current.push(wrap);

      gsap.fromTo(wrap,
        { clipPath: 'inset(0 0 100% 0)', ...off },
        {
          clipPath: 'inset(0 0 0% 0)',
          x: 0, y: 0,
          duration: line.cls === 'hero' ? 0.75 : 0.55,
          ease: 'power3.out',
          delay: 0.1 + i * 0.13,
        }
      );
    });
  }, []);

  const updateBeat = useCallback((sceneIdx, pct) => {
    const beats = BEATS[sceneIdx];
    let targetIdx = -1;
    for (let i = 0; i < beats.length; i++) {
      if (pct >= beats[i].start && pct <= beats[i].end) { targetIdx = i; break; }
    }
    const key = `${sceneIdx}-${targetIdx}`;
    if (key === activeBeatKey.current) return;

    const prevKey = activeBeatKey.current;
    activeBeatKey.current = key;

    const doReveal = () => {
      if (targetIdx === -1) {
        if (beatRef.current) beatRef.current.style.opacity = '0';
        lineEls.current = [];
        return;
      }
      revealBeat(beats[targetIdx]);
    };

    // If changing to a different beat, clear first
    if (prevKey !== '' && prevKey !== `${sceneIdx}--1`) {
      clearBeat(doReveal);
    } else {
      doReveal();
    }
  }, [revealBeat, clearBeat]);

  // ── mount: set first frame ──────────────────────────────────
  useEffect(() => {
    if (imgRef.current) imgRef.current.src = frameUrls[0][0];
  }, []); // eslint-disable-line

  // ── ScrollTrigger ───────────────────────────────────────────
  useEffect(() => {
    if (!scrollSpaceRef.current) return;

    const st = ScrollTrigger.create({
      trigger: scrollSpaceRef.current,
      start: 'top top',
      end:   'bottom bottom',
      scrub: 1.8,
      onUpdate(self) {
        const overall   = self.progress;
        const rawScene  = overall * SCENE_COUNT;
        const sceneIdx  = Math.min(SCENE_COUNT - 1, Math.floor(rawScene));
        const scenePct  = rawScene - sceneIdx;

        // Frame scrub
        if (sceneReadyRef.current[sceneIdx] && imgRef.current) {
          const fi  = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(scenePct * (TOTAL_FRAMES - 1)) + 1));
          const url = frameUrls[sceneIdx][fi - 1];
          if (imgRef.current.dataset.u !== url) {
            imgRef.current.dataset.u = url;
            imgRef.current.src       = url;
          }
        }

        // Scene counter
        if (sceneNumRef.current) {
          sceneNumRef.current.textContent = `0${sceneIdx + 1} / 0${SCENE_COUNT}`;
        }

        // Side progress bar
        if (progressBarRef.current) {
          progressBarRef.current.style.height = `${Math.round(overall * 100)}%`;
        }

        // Text beats
        updateBeat(sceneIdx, scenePct);

        // Preload next scene early
        if (scenePct > 0.70 && sceneIdx < SCENE_COUNT - 1) {
          const next = sceneIdx + 1;
          if (!preEnabledRef.current[next]) {
            preEnabledRef.current[next] = true;
            loadingIdxRef.current = next;
            setPreEnabled([...preEnabledRef.current]);
          }
        }
      },
    });

    return () => st.kill();
  }, [frameUrls, updateBeat]); // eslint-disable-line

  return (
    <div className={styles.wrapper}>

      {/* ── 1500vh scroll space with CSS-sticky frame ── */}
      <div ref={scrollSpaceRef} className={styles.scrollSpace}>

        {/* Letterbox + film frame */}
        <div className={styles.sticky}>

          <img ref={imgRef} className={styles.frame} alt="" draggable={false} />

          {/* Cinematic overlays */}
          <div className={styles.letterboxTop}    aria-hidden="true" />
          <div className={styles.letterboxBottom} aria-hidden="true" />
          <div className={styles.vignette}        aria-hidden="true" />
          <div className={styles.grain}           aria-hidden="true" />

          {/* Scene counter top-right */}
          <div className={styles.sceneCounter}>
            <span ref={sceneNumRef} className={styles.sceneNum}>01 / 03</span>
            <div  className={styles.sceneTrack}>
              <div ref={progressBarRef} className={styles.sceneProgress} />
            </div>
          </div>

          {/* Beat text */}
          <div
            ref={beatRef}
            className={styles.beat}
            style={{ opacity: 0 }}
          >
            <span ref={accentRef} className={styles.beatLabel} />
            <div  ref={linesContRef} className={styles.linesContainer} />
          </div>

          {/* Loader bar */}
          {loaderPct < 100 && (
            <div className={styles.loader} style={{ width: `${loaderPct}%` }} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
