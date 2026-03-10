import { useState, useEffect, useRef } from "react";

/* ── GOOGLE FONTS ─────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');
  `}</style>
);

/* ── DESIGN TOKENS ────────────────────────────────────────── */
const CSS = `
  :root {
    --red: #e8000a;
    --darker: #030303;
    --text: #d4d4d4;
    --glow: 0 0 25px rgba(232,0,10,.5), 0 0 60px rgba(232,0,10,.12);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { background:var(--darker); color:var(--text); font-family:'Rajdhani',sans-serif; overflow-x:hidden; }

  /* ── PAGE SLIDE TRANSITION ── */
  .page-wrap {
    position:fixed; inset:0; z-index:1000;
    background:var(--darker);
    transform:translateY(100%);
    transition:transform .65s cubic-bezier(.77,0,.18,1);
    overflow-y:auto;
  }
  .page-wrap.entering { transform:translateY(0); }
  .page-wrap.visible  { transform:translateY(0); }
  .page-wrap.leaving  { transform:translateY(100%); }

  /* ── NAV ── */
  nav {
    position:fixed; top:0; left:0; right:0; z-index:500;
    display:flex; justify-content:space-between; align-items:center;
    padding:16px 5vw;
    background:rgba(3,3,3,.96); backdrop-filter:blur(10px);
    border-bottom:1px solid rgba(232,0,10,.15); gap:12px;
  }
  .logo {
    font-family:'Bebas Neue',sans-serif; font-size:1.8rem; letter-spacing:6px;
    color:var(--red); text-shadow:var(--glow); cursor:pointer;
  }
  .nav-links { display:flex; gap:28px; }
  .nav-links a {
    font-family:'Share Tech Mono',monospace; font-size:.68rem; letter-spacing:3px;
    text-transform:uppercase; color:rgba(212,212,212,.45); text-decoration:none;
    transition:color .25s;
  }
  .nav-links a:hover { color:var(--red); }
  @media(max-width:650px){ .nav-links { display:none; } }

  /* ── HERO ── */
  #hero {
    position:relative; z-index:2; min-height:100vh;
    display:grid; grid-template-rows:1fr auto;
    padding:0 5vw; overflow:hidden;
  }
  .hero-bg-right { position:absolute; inset:0; background:#0a0a0a; z-index:0; }
  .hero-bg-left {
    position:absolute; inset:0; background:var(--darker);
    clip-path:polygon(0 0,62% 0,48% 100%,0 100%); z-index:0;
  }
  .hero-stripe {
    position:absolute; top:0; bottom:0; left:calc(48% - 3px); width:6px;
    background:var(--red); box-shadow:var(--glow); z-index:1; transform:skewX(-8deg);
  }
  .hero-content {
    position:relative; z-index:3; display:flex; flex-direction:column;
    justify-content:center; padding-top:100px; min-height:100vh;
  }
  .hero-pre {
    font-family:'Share Tech Mono',monospace; font-size:.7rem; letter-spacing:6px;
    text-transform:uppercase; color:var(--red); margin-bottom:8px;
    opacity:0; animation:fadeUp .6s .1s forwards;
  }
  .hero-name-wrap { line-height:.88; opacity:0; animation:fadeUp .6s .25s forwards; }
  .line1,.line2 {
    display:block; font-family:'Bebas Neue',sans-serif;
    font-size:clamp(5rem,15vw,14rem); letter-spacing:4px;
  }
  .line1 { color:var(--red); text-shadow:var(--glow); }
  .line2 { color:transparent; -webkit-text-stroke:2px rgba(255,255,255,.12); }
  .hero-divider {
    width:80px; height:3px; background:var(--red); box-shadow:var(--glow);
    margin:28px 0; opacity:0; animation:fadeUp .6s .4s forwards;
  }
  .hero-sub {
    font-size:clamp(1rem,2vw,1.4rem); font-weight:300; letter-spacing:6px;
    text-transform:uppercase; color:rgba(212,212,212,.55);
    opacity:0; animation:fadeUp .6s .5s forwards;
  }
  .hero-sub b { color:var(--red); font-weight:700; }
  .hero-socials {
    display:flex; gap:12px; flex-wrap:wrap; margin-top:36px;
    opacity:0; animation:fadeUp .6s .75s forwards;
  }
  .hero-ticker {
    position:relative; z-index:3; border-top:1px solid rgba(232,0,10,.2);
    padding:14px 0; overflow:hidden; white-space:nowrap;
  }
  .ticker-inner {
    display:inline-block; animation:ticker 20s linear infinite;
    font-family:'Bebas Neue',sans-serif; font-size:1rem; letter-spacing:8px;
    color:rgba(232,0,10,.22);
  }

  /* ── S-BTN ── */
  .s-btn {
    font-family:'Share Tech Mono',monospace; font-size:.62rem; letter-spacing:2px;
    text-transform:uppercase; padding:9px 18px; text-decoration:none;
    border:1px solid rgba(232,0,10,.3); color:rgba(212,212,212,.5);
    transition:all .25s; border-radius:1px; display:inline-block; cursor:pointer;
    background:transparent;
  }
  .s-btn:hover      { border-color:var(--red); color:var(--red); box-shadow:var(--glow); }
  .s-btn.yt:hover   { border-color:#ff4444; color:#ff4444; box-shadow:0 0 20px rgba(255,68,68,.4); }
  .s-btn.dc:hover   { border-color:#7289da; color:#7289da; box-shadow:0 0 20px rgba(114,137,218,.4); }

  /* ── GALLERY ── */
  #gallery { position:relative; z-index:2; padding:100px 5vw; border-top:1px solid rgba(232,0,10,.1); }
  .sec-head { display:flex; align-items:baseline; gap:20px; margin-bottom:55px; flex-wrap:wrap; }
  .sec-num { font-family:'Share Tech Mono',monospace; font-size:.65rem; color:var(--red); letter-spacing:4px; }
  .sec-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,4rem); letter-spacing:4px; color:#fff; }
  .sec-line { flex:1; height:1px; background:linear-gradient(to right,rgba(232,0,10,.3),transparent); min-width:30px; }
  .cat-tabs { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:44px; }
  .cat-tab {
    font-family:'Share Tech Mono',monospace; font-size:.65rem; letter-spacing:3px;
    text-transform:uppercase; padding:9px 22px; border:1px solid rgba(232,0,10,.2);
    background:transparent; color:rgba(212,212,212,.35); cursor:pointer;
    transition:all .25s; border-radius:1px;
  }
  .cat-tab:hover,.cat-tab.active {
    border-color:var(--red); color:var(--red);
    background:rgba(232,0,10,.07); box-shadow:var(--glow);
  }
  .gallery-grid { columns:3; column-gap:14px; }
  @media(max-width:900px){ .gallery-grid { columns:2; } }
  @media(max-width:540px){ .gallery-grid { columns:1; } }

  /* ── GALLERY CARD ── */
  .gallery-card {
    break-inside:avoid; margin-bottom:14px; position:relative; overflow:hidden;
    border:1px solid rgba(232,0,10,.1); background:#0c0c0c; cursor:pointer;
    transition:border-color .3s, transform .35s;
  }
  .gallery-card:hover { border-color:rgba(232,0,10,.55); transform:translateY(-5px); }
  .card-thumb {
    width:100%; aspect-ratio:16/9; object-fit:cover; display:block;
    transition:transform .5s; background:#111;
  }
  .gallery-card:hover .card-thumb { transform:scale(1.04); }
  .card-thumb-wrap { position:relative; overflow:hidden; }

  /* thumbnail placeholder */
  .thumb-placeholder {
    width:100%; aspect-ratio:16/9; background:linear-gradient(135deg,#110000,#0a0a0a);
    display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden;
  }
  .thumb-placeholder::after {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(-45deg,transparent,transparent 12px,rgba(232,0,10,.015) 12px,rgba(232,0,10,.015) 13px);
  }
  .thumb-play {
    width:54px; height:54px; border:2px solid rgba(232,0,10,.4); border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:1.2rem; color:rgba(232,0,10,.5);
    transition:all .3s; z-index:1;
  }
  .gallery-card:hover .thumb-play {
    border-color:var(--red); color:var(--red);
    box-shadow:var(--glow); transform:scale(1.1);
  }

  .thumb-play-overlay {
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .3s; font-size:1.4rem;
    background:rgba(3,3,3,.35);
    color:rgba(255,255,255,.9);
  }
  .gallery-card:hover .thumb-play-overlay { opacity:1; }

  .card-type-icon {
    position:absolute; top:10px; right:10px;
    background:rgba(3,3,3,.88); border:1px solid rgba(232,0,10,.2);
    padding:4px 9px; font-family:'Share Tech Mono',monospace; font-size:.55rem;
    color:rgba(232,0,10,.5); letter-spacing:2px; pointer-events:none;
  }
  .card-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(3,3,3,.92) 0%,transparent 55%);
    opacity:0; transition:opacity .3s;
    display:flex; flex-direction:column; justify-content:flex-end;
    padding:16px; pointer-events:none;
  }
  .gallery-card:hover .card-overlay { opacity:1; }
  .card-title { font-family:'Bebas Neue',sans-serif; font-size:1.1rem; color:#fff; letter-spacing:3px; margin-bottom:5px; }
  .card-tag {
    display:inline-block; font-family:'Share Tech Mono',monospace; font-size:.52rem;
    letter-spacing:2px; text-transform:uppercase; padding:2px 8px;
    border:1px solid var(--red); color:var(--red);
  }

  /* ── PROJECT PAGE ── */
  .proj-nav {
    position:sticky; top:0; z-index:100; padding:16px 5vw;
    background:rgba(3,3,3,.96); backdrop-filter:blur(10px);
    border-bottom:1px solid rgba(232,0,10,.15);
    display:flex; align-items:center; justify-content:space-between;
  }
  .proj-back {
    font-family:'Share Tech Mono',monospace; font-size:.65rem; letter-spacing:3px;
    color:rgba(212,212,212,.45); text-transform:uppercase; cursor:pointer;
    transition:color .25s; background:none; border:none; display:flex; align-items:center; gap:8px;
  }
  .proj-back:hover { color:var(--red); }
  .proj-back-arrow { font-size:1rem; }

  .proj-hero {
    position:relative; width:100%;
    background:#000; overflow:hidden;
  }
  .proj-video-wrap {
    position:relative; padding-bottom:56.25%; height:0;
  }
  .proj-video-wrap iframe {
    position:absolute; top:0; left:0; width:100%; height:100%;
    border:none;
  }

  .proj-body { max-width:1100px; margin:0 auto; padding:70px 5vw 100px; }

  .proj-header { margin-bottom:60px; }
  .proj-cat-badge {
    font-family:'Share Tech Mono',monospace; font-size:.62rem; letter-spacing:4px;
    text-transform:uppercase; color:var(--red); margin-bottom:14px; display:block;
  }
  .proj-title {
    font-family:'Bebas Neue',sans-serif; font-size:clamp(3rem,8vw,7rem);
    letter-spacing:4px; color:#fff; line-height:.9;
    text-shadow:var(--glow);
  }
  .proj-divider { width:80px; height:3px; background:var(--red); box-shadow:var(--glow); margin:24px 0; }

  .proj-grid { display:grid; grid-template-columns:1fr 340px; gap:60px; align-items:start; }
  @media(max-width:860px){ .proj-grid { grid-template-columns:1fr; } }

  .proj-description {
    font-size:1.1rem; font-weight:300; color:rgba(212,212,212,.72);
    line-height:1.9;
  }

  .proj-meta { display:flex; flex-direction:column; gap:0; }
  .meta-item {
    padding:18px 0; border-bottom:1px solid rgba(232,0,10,.08);
  }
  .meta-item:first-child { border-top:1px solid rgba(232,0,10,.08); }
  .meta-label {
    font-family:'Share Tech Mono',monospace; font-size:.58rem; letter-spacing:3px;
    text-transform:uppercase; color:rgba(232,0,10,.5); margin-bottom:6px;
  }
  .meta-value {
    font-family:'Rajdhani',sans-serif; font-size:1rem; font-weight:600;
    color:rgba(212,212,212,.85); letter-spacing:1px;
  }

  .soft-list { display:flex; flex-wrap:wrap; gap:8px; margin-top:4px; }
  .soft-badge {
    font-family:'Share Tech Mono',monospace; font-size:.55rem; letter-spacing:2px;
    text-transform:uppercase; padding:4px 10px;
    border:1px solid rgba(232,0,10,.25); color:rgba(232,0,10,.6);
    border-radius:1px;
  }

  /* ── ABOUT ── */
  #about { position:relative; z-index:2; padding:100px 5vw; border-top:1px solid rgba(232,0,10,.1); }
  .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:70px; align-items:start; }
  @media(max-width:768px){ .about-grid { grid-template-columns:1fr; gap:40px; } }
  .about-text p { font-size:1.05rem; font-weight:300; color:rgba(212,212,212,.68); line-height:1.9; margin-bottom:18px; }
  .about-text p strong { color:var(--red); font-weight:700; }

  /* ── CONTACT ── */
  #contact { position:relative; z-index:2; padding:100px 5vw; border-top:1px solid rgba(232,0,10,.1); overflow:hidden; }
  #contact::before {
    content:'CONTACT'; position:absolute; left:-2vw; top:50%; transform:translateY(-50%);
    font-family:'Bebas Neue',sans-serif; font-size:clamp(8rem,20vw,18rem);
    color:transparent; -webkit-text-stroke:1px rgba(232,0,10,.04);
    letter-spacing:6px; pointer-events:none; z-index:0; white-space:nowrap;
  }
  .contact-inner { position:relative; z-index:1; text-align:center; }
  .contact-tag { font-family:'Share Tech Mono',monospace; font-size:.65rem; letter-spacing:5px; color:var(--red); margin-bottom:20px; }
  .contact-email {
    display:inline-block; font-family:'Bebas Neue',sans-serif;
    font-size:clamp(1.5rem,4vw,3rem); letter-spacing:5px; color:#fff;
    text-decoration:none; transition:color .25s,text-shadow .25s; margin:16px 0 36px;
  }
  .contact-email:hover { color:var(--red); text-shadow:var(--glow); }
  .contact-socials { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

  /* ── FOOTER ── */
  footer {
    position:relative; z-index:2; display:flex; justify-content:space-between;
    align-items:center; padding:18px 5vw; border-top:1px solid rgba(232,0,10,.1);
    font-family:'Share Tech Mono',monospace; font-size:.52rem;
    color:rgba(212,212,212,.12); letter-spacing:3px;
  }
  .footer-logo { font-family:'Bebas Neue',sans-serif; font-size:1rem; letter-spacing:4px; color:rgba(232,0,10,.18); }

  /* ── REVEAL ── */
  .reveal { opacity:0; transform:translateY(28px); transition:opacity .7s,transform .7s; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* ── PROJ PAGE FADE IN ── */
  .proj-fade { opacity:0; transform:translateY(20px); transition:opacity .5s,transform .5s; }
  .proj-fade.in { opacity:1; transform:translateY(0); }
`;

/* ── DATA ─────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "storm-vfx",
    title: "STORM VFX BREAKDOWN",
    cat: "vfx",
    tag: "VFX",
    embedUrl: "https://streamable.com/e/36l364",
    thumbUrl: "https://cdn-cf-east.streamable.com/image/36l364.jpg",
    description: "Une séquence VFX explorant les effets atmosphériques d'une tempête — foudre, particules et compositing cinématographique. Le but était de créer une ambiance lourde et réaliste à partir de rien.",
    role: "VFX Artist · Compositing",
    client: "Projet personnel",
    duration: "3 semaines",
    softwares: ["After Effects", "Blender", "DaVinci Resolve"],
  },
  {
    id: "void-loop",
    title: "VOID LOOP ANIM",
    cat: "animation",
    tag: "ANIMATION",
    embedUrl: "https://streamable.com/e/3w3g84",
    thumbUrl: "https://cdn-cf-east.streamable.com/image/3w3g84.jpg",
    description: "Animation en boucle parfaite plongeant dans un vide stylisé. Travail sur la fluidité du mouvement, le timing et la cohérence visuelle d'une animation destinée à tourner indéfiniment.",
    role: "Animateur · Motion Design",
    client: "Projet personnel",
    duration: "1 semaine",
    softwares: ["Blender", "After Effects"],
  },
];

/* ── REVEAL HOOK ──────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 60);
      }),
      { threshold: 0.07 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── CARD COMPONENT ───────────────────────────────────────── */
function GalleryCard({ project, onOpen }) {
  return (
    <div className="gallery-card" onClick={() => onOpen(project)}>
      <div className="card-thumb-wrap">
        {project.thumbUrl ? (
          <img className="card-thumb" src={project.thumbUrl} alt={project.title} />
        ) : (
          <div className="thumb-placeholder">
            <div className="thumb-play">▶</div>
          </div>
        )}
        <div className="thumb-play-overlay">▶</div>
        <div className="card-type-icon">▶ {project.tag}</div>
        <div className="card-overlay">
          <div className="card-title">{project.title}</div>
          <span className="card-tag">{project.tag}</span>
        </div>
      </div>
    </div>
  );
}

/* ── PROJECT PAGE ─────────────────────────────────────────── */
function ProjectPage({ project, onClose }) {
  const [phase, setPhase] = useState("entering");
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // entering → visible
    const t1 = setTimeout(() => { setPhase("visible"); setContentVisible(true); }, 50);
    return () => clearTimeout(t1);
  }, []);

  const handleClose = () => {
    setPhase("leaving");
    setTimeout(onClose, 650);
  };

  return (
    <div className={`page-wrap ${phase}`}>
      {/* sticky nav */}
      <div className="proj-nav">
        <button className="proj-back" onClick={handleClose}>
          <span className="proj-back-arrow">←</span> RETOUR
        </button>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.2rem", letterSpacing: "5px", color: "var(--red)" }}>
          AÏKO
        </span>
      </div>

      {/* video */}
      <div className="proj-hero">
        <div className="proj-video-wrap">
          <iframe src={project.embedUrl} title={project.title} allowFullScreen />
        </div>
      </div>

      {/* body */}
      <div className="proj-body">
        <div className={`proj-header proj-fade ${contentVisible ? "in" : ""}`} style={{ transitionDelay: ".1s" }}>
          <span className="proj-cat-badge">// {project.tag}</span>
          <h1 className="proj-title">{project.title}</h1>
          <div className="proj-divider" />
        </div>

        <div className={`proj-grid proj-fade ${contentVisible ? "in" : ""}`} style={{ transitionDelay: ".25s" }}>
          {/* description */}
          <div>
            <p className="proj-description">{project.description}</p>
          </div>

          {/* meta */}
          <div className="proj-meta">
            <div className="meta-item">
              <div className="meta-label">// Rôle</div>
              <div className="meta-value">{project.role}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">// Commanditaire</div>
              <div className="meta-value">{project.client}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">// Temps de réalisation</div>
              <div className="meta-value">{project.duration}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">// Logiciels</div>
              <div className="soft-list">
                {project.softwares.map(s => (
                  <span key={s} className="soft-badge">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── HOME PAGE ────────────────────────────────────────────── */
function HomePage({ onOpenProject }) {
  const [filter, setFilter] = useState("all");
  useReveal();

  const visible = PROJECTS.filter(p => filter === "all" || p.cat === filter);

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="logo">AÏKO</div>
        <div className="nav-links">
          <a href="#gallery">Créations</a>
          <a href="#about">À propos</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg-right" />
        <div className="hero-bg-left" />
        <div className="hero-stripe" />
        <div className="hero-content">
          <div className="hero-pre">// Animator · VFX Maker</div>
          <div className="hero-name-wrap">
            <span className="line1">AÏKO</span>
            <span className="line2">PORTFOLIO</span>
          </div>
          <div className="hero-divider" />
          <p className="hero-sub">Donner vie à l'<b>impossible</b></p>
          <div className="hero-socials">
            <a href="https://www.youtube.com/@RED_I.K.O" target="_blank" rel="noreferrer" className="s-btn yt">▶ YouTube</a>
            <a href="https://discord.com/channels/1479986610081628273/1479990102745677976" target="_blank" rel="noreferrer" className="s-btn dc"># Discord · red_AIKO</a>
          </div>
        </div>
        <div className="hero-ticker">
          <span className="ticker-inner">
            ANIMATION &nbsp;·&nbsp; VFX &nbsp;·&nbsp; COMPOSITING &nbsp;·&nbsp; MOTION DESIGN &nbsp;·&nbsp; 3D &nbsp;·&nbsp; AFTER EFFECTS &nbsp;·&nbsp; BLENDER &nbsp;·&nbsp; ANIMATION &nbsp;·&nbsp; VFX &nbsp;·&nbsp; COMPOSITING &nbsp;·&nbsp; MOTION DESIGN &nbsp;·&nbsp; 3D &nbsp;·&nbsp; AFTER EFFECTS &nbsp;·&nbsp; BLENDER &nbsp;·&nbsp;
          </span>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery">
        <div className="sec-head reveal">
          <span className="sec-num">01 //</span>
          <h2 className="sec-title">MES CRÉATIONS</h2>
          <div className="sec-line" />
        </div>
        <div className="cat-tabs reveal">
          {["all", "animation", "vfx"].map(f => (
            <button
              key={f}
              className={`cat-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Tout voir" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="gallery-grid">
          {visible.map(p => (
            <GalleryCard key={p.id} project={p} onOpen={onOpenProject} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="sec-head reveal">
          <span className="sec-num">02 //</span>
          <h2 className="sec-title">À PROPOS</h2>
          <div className="sec-line" />
        </div>
        <div className="about-grid">
          <div className="about-text reveal">
            <p>Je suis <strong>AÏKO</strong>, animateur et créateur de VFX passionné par la frontière entre le réel et le numérique.</p>
            <p>Mon travail explore les <strong>effets visuels cinématographiques</strong>, les animations dynamiques et la création d'univers qui captivent et fascinent.</p>
            <p>Chaque projet est une <strong>nouvelle dimension</strong> à construire — des particules aux simulations complexes, je transforme les idées en expériences visuelles mémorables.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-inner">
          <div className="sec-head reveal" style={{ justifyContent: "center" }}>
            <span className="sec-num">03 //</span>
            <h2 className="sec-title">CONTACT</h2>
          </div>
          <p className="contact-tag reveal">PRÊT À COLLABORER ?</p>
          <a href="mailto:aiko@email.com" className="contact-email reveal">AIKO@EMAIL.COM</a>
          <div className="contact-socials reveal">
            <a href="https://www.youtube.com/@RED_I.K.O" target="_blank" rel="noreferrer" className="s-btn yt">▶ YouTube</a>
            <a href="https://discord.com/channels/1479986610081628273/1479990102745677976" target="_blank" rel="noreferrer" className="s-btn dc"># Discord · red_AIKO</a>
          </div>
        </div>
      </section>

      <footer>
        <span className="footer-logo">AÏKO</span>
        <span>ANIMATOR & VFX MAKER // ALL RIGHTS RESERVED</span>
        <span>2025</span>
      </footer>
    </>
  );
}

/* ── APP ──────────────────────────────────────────────────── */
export default function App() {
  const [activeProject, setActiveProject] = useState(null);

  const handleOpenProject = (project) => {
    setActiveProject(project);
    window.scrollTo(0, 0);
  };

  const handleCloseProject = () => {
    setActiveProject(null);
  };

  return (
    <>
      <FontLoader />
      <style>{CSS}</style>
      <HomePage onOpenProject={handleOpenProject} />
      {activeProject && (
        <ProjectPage project={activeProject} onClose={handleCloseProject} />
      )}
    </>
  );
}