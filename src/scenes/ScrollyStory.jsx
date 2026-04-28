import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollyStory.module.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 190;
const SCENES       = ['scene1', 'scene2', 'scene3'];
const SCENE_COUNT  = 3;

const BEATS = [
  [
    {
      start: 0.0, end: 0.28, label: 'THE CRISIS',
      lines: [
        { text: '600 million',    cls: 'hero' },
        { text: 'litres of oil.', cls: 'hero' },
        { text: 'Dumped illegally into our oceans — every year.', cls: 'sub' },
      ],
      enter: 'bottom', align: 'left', vpos: 'bottom',
    },
    {
      start: 0.70, end: 1.0, label: 'INVISIBLE',
      lines: [
        { text: 'Hidden beneath',  cls: 'hero' },
        { text: 'the surface.',    cls: 'hero' },
        { text: 'Undetected. Unpunished. Until now.', cls: 'sub' },
      ],
      enter: 'right', align: 'right', vpos: 'center',
    },
  ],
  [
    {
      start: 0.0, end: 0.28, label: 'ESA SENTINEL-1 SAR',
      lines: [
        { text: 'Sees through',      cls: 'hero' },
        { text: 'night and storms.', cls: 'hero' },
        { text: 'Where human eyes fail — Synthetic Aperture Radar sees.', cls: 'sub' },
      ],
      enter: 'top', align: 'center', vpos: 'top',
    },
    {
      start: 0.70, end: 1.0, label: 'GLOBAL SURVEILLANCE',
      lines: [
        { text: 'Every sea.',    cls: 'hero' },
        { text: 'Every 6 days.', cls: 'hero' },
        { text: 'Complete ocean coverage. Zero blind spots.', cls: 'sub' },
      ],
      enter: 'left', align: 'left', vpos: 'center',
    },
  ],
  [
    {
      start: 0.0, end: 0.28, label: 'AIS CROSS-REFERENCE',
      lines: [
        { text: 'The exact ship.',  cls: 'hero' },
        { text: 'The exact time.', cls: 'hero' },
        { text: 'AIS vessel tracking identifies the responsible vessel automatically.', cls: 'sub' },
      ],
      enter: 'bottom', align: 'center', vpos: 'bottom',
    },
    {
      start: 0.70, end: 1.0, label: '⚡ ALERT DISPATCHED',
      lines: [
        { text: 'Automated.',   cls: 'hero' },
        { text: 'Irrefutable.', cls: 'hero' },
        { text: 'Delivered to maritime authorities — in real time.', cls: 'sub' },
      ],
      enter: 'right', align: 'right', vpos: 'center',
    },
  ],
];

function buildUrls(folder) {
  return Array.from({ length: TOTAL_FRAMES }, (_, i) => {
    const n = String(i + 1).padStart(3, '0');
    return `/frames/${folder}/frame_${n}.jpg`;
  });
}

// ── Pre-create Image objects (one per frame, per scene) ──────────────────────
// Sets .src immediately so the browser starts fetching and caching.
// When the user scrolls, we just read from this array — no allocation,
// no creation, just a cache lookup.  If img.complete === true the draw
// is instant from browser memory; otherwise we keep the previous frame.
function buildImagePool(urls) {
  return urls.map(url => {
    const img = new Image();
    img.src   = url;           // triggers fetch + HTTP-cache population
    return img;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ScrollyStory() {
  const scrollSpaceRef = useRef(null);
  const canvasRef      = useRef(null);
  const beatRef        = useRef(null);
  const accentRef      = useRef(null);
  const linesContRef   = useRef(null);
  const sceneNumRef    = useRef(null);
  const progressBarRef = useRef(null);
  const rafRef         = useRef(null);   // pending rAF id
  const pendingRef     = useRef(null);   // { scene, fi } we want to draw next

  const allUrls  = useMemo(() => SCENES.map(buildUrls), []);

  // Pool[sceneIdx][frameIdx] = HTMLImageElement (already fetching)
  const pool = useRef(null);

  // Loader state: count how many scene-0 images are loaded
  const [loaderPct, setLoaderPct] = useState(0);

  // ── Build pools & track scene-0 load progress ─────────────────────────
  useEffect(() => {
    pool.current = allUrls.map(urls => buildImagePool(urls));

    // Count scene 0 loads for the progress bar
    let loaded = 0;
    pool.current[0].forEach(img => {
      if (img.complete) {
        loaded++;
        setLoaderPct(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === 1) drawFrame(0, 0); // draw first frame immediately
      } else {
        img.addEventListener('load', () => {
          loaded++;
          setLoaderPct(Math.round((loaded / TOTAL_FRAMES) * 100));
          if (loaded === 1) drawFrame(0, 0); // draw first frame as soon as it arrives
        }, { once: true });
      }
    });

    return () => { pool.current = null; };
  }, []); // eslint-disable-line

  // ── Canvas cover-fit draw ────────────────────────────────────────────────
  const drawFrame = useCallback((sceneIdx, fi) => {
    const canvas = canvasRef.current;
    if (!canvas || !pool.current) return;
    const img = pool.current[sceneIdx]?.[fi];
    if (!img?.complete || !img.naturalWidth) return;   // not ready, keep old frame

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cover-fit: scale image to fill canvas maintaining aspect ratio
    const cw    = canvas.width;
    const ch    = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw    = img.naturalWidth  * scale;
    const dh    = img.naturalHeight * scale;
    const dx    = (cw - dw) / 2;
    const dy    = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ── Resize canvas, redraw current frame ──────────────────────────────────
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width  = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      if (pendingRef.current) {
        drawFrame(pendingRef.current.scene, pendingRef.current.fi);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame]);

  // ── Beat text ────────────────────────────────────────────────────────────
  const activeBeatKey = useRef('');
  const lineEls       = useRef([]);

  const clearBeat = useCallback((onDone) => {
    const els = lineEls.current;
    if (!els.length) { onDone?.(); return; }
    els.forEach((el, i) => {
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)', opacity: 0, filter: 'blur(8px)',
        duration: 0.35, ease: 'power2.inOut', delay: i * 0.04,
        onComplete: i === els.length - 1 ? onDone : undefined,
      });
    });
    if (accentRef.current) gsap.to(accentRef.current, { opacity: 0, filter: 'blur(4px)', duration: 0.25 });
  }, []);

  const revealBeat = useCallback((beat) => {
    const container = linesContRef.current;
    if (!container) return;
    if (beatRef.current) {
      beatRef.current.dataset.align = beat.align;
      beatRef.current.dataset.vpos  = beat.vpos;
      beatRef.current.style.opacity = '1';
    }
    if (accentRef.current) {
      accentRef.current.textContent = beat.label;
      gsap.fromTo(accentRef.current,
        { opacity: 0, y: 10, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', delay: 0.1 });
    }
    container.innerHTML = '';
    lineEls.current = [];
    const offsets = { top: { y: -40, x: 0 }, left: { x: -60, y: 0 }, right: { x: 60, y: 0 }, bottom: { y: 40, x: 0 } };
    const off = offsets[beat.enter] ?? offsets.bottom;
    beat.lines.forEach((line, i) => {
      const wrap = document.createElement('div');
      wrap.className = styles.lineWrap;
      const el = document.createElement('span');
      el.className  = line.cls === 'hero' ? styles.lineHero : styles.lineSub;
      el.textContent = line.text;
      wrap.appendChild(el);
      container.appendChild(wrap);
      lineEls.current.push(wrap);
      gsap.fromTo(wrap,
        { clipPath: 'inset(0 0 100% 0)', filter: 'blur(8px)', scale: 0.96, ...off },
        { clipPath: 'inset(0 0 0% 0)', filter: 'blur(0px)', scale: 1, x: 0, y: 0,
          duration: line.cls === 'hero' ? 0.9 : 0.7, ease: 'expo.out', delay: 0.15 + i * 0.1 });
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
      } else {
        revealBeat(beats[targetIdx]);
      }
    };
    if (prevKey !== '' && prevKey !== `${sceneIdx}--1`) clearBeat(doReveal);
    else doReveal();
  }, [revealBeat, clearBeat]);

  // ── ScrollTrigger ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!scrollSpaceRef.current) return;

    const st = ScrollTrigger.create({
      trigger: scrollSpaceRef.current,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   0.8,    // slight lag smooths micro-jitter without feeling sticky
      onUpdate(self) {
        const overall  = self.progress;
        const rawScene = overall * SCENE_COUNT;
        const sceneIdx = Math.min(SCENE_COUNT - 1, Math.floor(rawScene));
        const scenePct = Math.min(1, rawScene - sceneIdx);
        const fi       = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(scenePct * (TOTAL_FRAMES - 1))));

        // Store target for rAF — fast scroll just overwrites this before drawing
        pendingRef.current = { scene: sceneIdx, fi };

        // Cancel any queued draw from previous tick, schedule fresh one
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          const p = pendingRef.current;
          if (p) drawFrame(p.scene, p.fi);
        });

        // UI updates (cheap, run immediately outside rAF)
        if (sceneNumRef.current)    sceneNumRef.current.textContent = `0${sceneIdx + 1} / 0${SCENE_COUNT}`;
        if (progressBarRef.current) progressBarRef.current.style.height = `${Math.round(overall * 100)}%`;
        updateBeat(sceneIdx, scenePct);
      },
    });

    return () => {
      st.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, updateBeat]); // eslint-disable-line

  return (
    <div className={styles.wrapper}>
      <div ref={scrollSpaceRef} className={styles.scrollSpace}>
        <div className={styles.sticky}>

          <canvas ref={canvasRef} className={styles.frame} />

          <div className={styles.vignette} aria-hidden="true" />

          <div className={styles.sceneCounter}>
            <span ref={sceneNumRef} className={styles.sceneNum}>01 / 03</span>
            <div  className={styles.sceneTrack}>
              <div ref={progressBarRef} className={styles.sceneProgress} />
            </div>
          </div>

          <div ref={beatRef} className={styles.beat} style={{ opacity: 0 }}>
            <span ref={accentRef}    className={styles.beatLabel} />
            <div  ref={linesContRef} className={styles.linesContainer} />
          </div>

          {loaderPct < 100 && (
            <div className={styles.loader} style={{ width: `${loaderPct}%` }} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
