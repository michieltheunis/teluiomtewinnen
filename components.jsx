// Components for Te Lui Om Te Winnen onepager
const { useState, useEffect, useRef } = React;

// ----- Reveal hook -----
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-stagger");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ----- Scroll progress -----
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-prog" ref={ref}></div>;
}

// ----- Nav -----
function Nav() {
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 80);
      if (y > 200 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const close = () => setOpen(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <>
      <nav className={"nav " + (stuck ? "is-stuck " : "") + (hidden && !open ? "is-hidden" : "")}>
        <a href="#top" className="nav-logo" onClick={close}>
          <img src="assets/logo.png" alt="Te Lui Om Te Winnen" />
        </a>
        <div className="nav-links">
          <a href="#over">Over ons</a>
          <a href="#leuzen">Leuzen</a>
          <a href="#uitslagen">Uitslagen</a>
          <a href="#kalender">Kalender</a>
          <a href="#leden">De ploeg</a>
          <a href="#media">In de pers</a>
          <a href="#contact">Contact</a>
        </div>
        <button
          className={"nav-burger " + (open ? "is-open" : "")}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
      <div className={"nav-drawer " + (open ? "is-open" : "")} onClick={close}>
        <div className="nav-drawer-inner" onClick={(e) => e.stopPropagation()}>
          <a href="#over" onClick={close}>Over ons</a>
          <a href="#leuzen" onClick={close}>Leuzen</a>
          <a href="#uitslagen" onClick={close}>Uitslagen</a>
          <a href="#kalender" onClick={close}>Kalender</a>
          <a href="#leden" onClick={close}>De ploeg</a>
          <a href="#media" onClick={close}>In de pers</a>
          <a href="#contact" onClick={close}>Contact</a>
        </div>
      </div>
    </>);
}

// ----- Hero -----
function Hero({ uitslagen, kalender }) {
  const seizoen = uitslagen ? Object.keys(uitslagen)[0] : null;
  const rows = seizoen ? (uitslagen[seizoen] || []).filter(r => !r.placeholder) : [];
  const volgende = kalender && kalender[0];
  const totalGekwist = rows.length;
  const zeges = rows.filter(r => r.rank === 1).length;

  return (
    <header className="hero">
      <div className="shell">
        <div className="hero-grid reveal-stagger">
          <h1 className="hero-statement">
            Te lui<br />om te <em>winnen.</em>
          </h1>
          <div className="hero-side">
            <p className="hero-tagline">
              Vijf vaste leden. Tien quizzen per jaar. Eén onuitgesproken pact: nooit te vroeg de borrelplank bestellen.
            </p>
            <div className="hero-quote">
              "Als je niet wint, voelt elke vierde plaats nog vrij comfortabel."
              <span className="hero-quote-attr">— ongeschreven huishoudelijk reglement</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-ticker-wrap">
        <div className="hero-ticker-label"><span className="dot"></span>Live ticker · seizoen '25/'26</div>
        <div className="hero-ticker-track">
          <div className="hero-ticker">
            {Array.from({ length: 2 }).map((_, k) =>
              <React.Fragment key={k}>
                {rows.slice().reverse().map((r, i) =>
                  <React.Fragment key={i}>
                    <span><b>{r.date}</b> {r.quiz} <span className="pos">{r.rank}/{r.of}</span></span>
                    <span className="sep">✦</span>
                  </React.Fragment>
                )}
                {volgende && <><span><b>Volgende</b> {volgende.d} {volgende.m} · {volgende.quiz}</span><span className="sep">✦</span></>}
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="hero-ticker-side">{totalGekwist} gekwist · {zeges} zege{zeges !== 1 ? "n" : ""}</div>
      </div>
    </header>);
}

// ----- About -----
function About() {
  return (
    <section className="section" id="over">
      <div className="shell">
        <div className="section-head reveal">
          <div className="meta">
            <div className="section-num">Over ons</div>
          </div>
          <h2>Een quizploeg met <em>verdacht weinig</em> ambitie.</h2>
        </div>
        <div className="about reveal-stagger">
          <div>
            <p className="about-lead">
              Wij zijn <em>Te Lui Om Te Winnen.</em> Een vijftal vaste leden uit Lommel die al ongeveer tien jaar quizzen en zich onderscheiden door een opvallende specialiteit: borrelplanken bestellen op het moment dat ze net uitverkocht zijn.
            </p>
            <div className="about-body">
              <p>We doen mee aan zo'n tien quizzen per jaar in en rond Lommel. Onze sterke vakgebieden? Daar zijn we zelf nog niet uit. Onze zwakke vakgebieden? Onbekend, maar legio.</p>
              <p>We zijn niet de luidste ploeg. Niet de strakste. Niet de snelste met het opheffen van de hand. Maar als de jury de laatste kruisjes zet en wij eindigen ergens tussen plek 4 en 7 — dan was het een goede avond.</p>
              <p>We hebben één keer gewonnen. Dat blijft voorlopig genoeg.</p>
            </div>
          </div>
          <div className="about-stats-wrap">
            <div className="about-stats">
              <div className="stat"><div className="num">±10</div><span className="lab">Quizzen / jaar</span></div>
              <div className="stat"><div className="num">5</div><span className="lab">Vaste leden</span></div>
              <div className="stat"><div className="num"><em>1</em></div><span className="lab">Officiële zege</span></div>
              <div className="stat"><div className="num">∞</div><span className="lab">Uitverkochte planken</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}

// ----- Mottos -----
function Mottos({ mottos = [] }) {
  return (
    <section className="mottos" id="leuzen">
      <div className="shell">
        <div className="section-head reveal" style={{ borderColor: "var(--panel-rule)" }}>
          <div className="meta">
            <div className="section-num" style={{ color: "var(--orange)", opacity: 1 }}>Leuzen</div>
          </div>
          <h2 style={{ color: "var(--panel-fg)" }}>Onuitgesproken <em>regels</em>, <br/>luidop herhaald.</h2>
        </div>
        <div className="motto-list reveal-stagger">
          {mottos.map((m, i) =>
            <div className="motto" key={i}>
              <div className="n">{String(i + 1).padStart(2, "0")}</div>
              <div className="q">"{m.q}"</div>
              <div className="a">{m.a}</div>
            </div>
          )}
        </div>
      </div>
    </section>);
}

// ----- Kalender -----
function Kalender({ kalender = [] }) {
  return (
    <section className="section" id="kalender">
      <div className="shell">
        <div className="section-head reveal">
          <div className="meta">
            <div className="section-num">Kalender 2026</div>
          </div>
          <h2>Wat staat er <em>nog</em> op de planning.</h2>
        </div>
        <div className="kalender-list reveal-stagger">
          {kalender.map((k, i) =>
            <div className="kal-row" key={i}>
              <div className="kal-date">
                <div className="date-d">{k.d}</div>
                <span className="date-m">{k.m} '26</span>
              </div>
              <div className="kal-main">
                <div className="name">{k.quiz}</div>
                <div className="ploeg">
                  {(k.ploeg || []).map((p, idx) =>
                    <React.Fragment key={idx}>
                      {idx > 0 && " · "}
                      {p === "?" ? <span className="qmark">?</span> : p}
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="where">{k.where}</div>
            </div>
          )}
        </div>
      </div>
    </section>);
}

// ----- Uitslagen -----
function Uitslagen({ uitslagen = {} }) {
  const seasons = Object.keys(uitslagen);
  const [season, setSeason] = useState(seasons[0] || "2025/26");
  const rows = uitslagen[season] || [];
  const numericRows = rows.filter((r) => typeof r.rank === "number");
  const podiums = numericRows.filter((u) => u.rank <= 3).length;
  const top5 = numericRows.filter((u) => u.rank <= 5).length;
  const best = numericRows.length ? numericRows.reduce((a, b) => a.rank < b.rank ? a : b) : null;
  const avg = numericRows.length ? (numericRows.reduce((s, u) => s + u.rank, 0) / numericRows.length).toFixed(1) : "—";

  useEffect(() => {
    if (seasons.length && !uitslagen[season]) setSeason(seasons[0]);
  }, [uitslagen]);

  return (
    <section className="section" id="uitslagen" style={{ background: "var(--bone)" }}>
      <div className="shell">
        <div className="section-head reveal">
          <div className="meta">
            <div className="section-num">Palmares</div>
          </div>
          <h2>De koude, harde, <em>bescheiden</em> cijfers.</h2>
        </div>
        <div className="reveal season-tabs-wrap">
          <div className="season-tabs-scroll">
            <div className="season-tabs" role="tablist">
              {seasons.map((s) =>
                <button key={s} className={"season-tab " + (s === season ? "active" : "")} onClick={() => setSeason(s)}>
                  Seizoen {s}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="uit-wrap">
          <table className="uit-table reveal">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Quiz</th>
                <th>Plaats</th>
                <th style={{ textAlign: "right" }}>Eindstand</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u, i) =>
                <tr key={i} className={u.rank === 1 || u.rank === 2 || u.rank === 3 ? "podium" : ""}>
                  <td className="date">{u.date}</td>
                  <td><span className="quiz-name">{u.quiz}</span></td>
                  <td className="place">{u.place}</td>
                  <td className="pos">
                    <span className="rank">{u.rank}</span>
                    <span className="of"> / {u.of}</span>
                  </td>
                </tr>
              )}
              {rows[0] && rows[0].placeholder &&
                <tr>
                  <td colSpan={4} style={{ padding: "40px 0", fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--teal-deep)", fontSize: "18px", textAlign: "center" }}>
                    Archief van vorig seizoen wordt later aangevuld.
                  </td>
                </tr>
              }
            </tbody>
          </table>
          <aside className="uit-side reveal">
            <span className="label">Seizoen {season}</span>
            {best ?
              <>
                <div className="big"><em>{best.rank}</em><span style={{ fontSize: "36px" }}>e</span></div>
                <span className="small">Beste prestatie · {best.quiz}</span>
              </> :
              <div className="big" style={{ fontSize: "40px" }}>—</div>
            }
            <div className="divider"></div>
            <div className="row"><span>Aantal quizzen</span><span className="v">{numericRows.length || "—"}</span></div>
            <div className="row"><span>Podiumplaatsen</span><span className="v">{best ? podiums : "—"}</span></div>
            <div className="row"><span>Top-5 noteringen</span><span className="v">{best ? top5 : "—"}</span></div>
            <div className="row"><span>Gemiddelde stand</span><span className="v">{avg}</span></div>
            <div className="divider"></div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "15px", lineHeight: 1.4, color: "var(--teal-deep)" }}>
              ★ Mèndetquiz: <strong style={{ fontStyle: "normal" }}>beste jongerenploeg</strong>. De enige titel die we dit seizoen écht verdiend hebben.
            </div>
          </aside>
        </div>
      </div>
    </section>);
}

// ----- Leden -----
function Leden({ leden = [] }) {
  return (
    <section className="section" id="leden">
      <div className="shell">
        <div className="section-head reveal">
          <div className="meta">
            <div className="section-num">De ploeg</div>
          </div>
          <h2>Zes mensen. <em>Eén</em> tafel.</h2>
        </div>
        <div className="leden-grid reveal-stagger">
          {leden.map((l, i) =>
            <div className="lid" key={i}>
              <div className="num">№ {String(i + 1).padStart(2, "0")} / {String(leden.length).padStart(2, "0")}</div>
              <div className="portrait">
                {l.photo
                  ? <img src={l.photo} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : null}
              </div>
              <div className="name">{l.name}</div>
              <div className="role">{l.role}</div>
              <div className="bio">{l.bio}</div>
            </div>
          )}
        </div>
      </div>
    </section>);
}

// ----- Media -----
function Media({ media = [] }) {
  const spans = ["span-7", "span-5", "span-6", "span-6"];
  return (
    <section className="section" id="media" style={{ background: "var(--bone)" }}>
      <div className="shell">
        <div className="section-head reveal">
          <div className="meta">
            <div className="section-num">In de pers</div>
          </div>
          <h2>Vermeld in <em>De Lommelse Gazet.</em></h2>
        </div>
        <div className="media-grid reveal-stagger">
          {media.map((clip, i) =>
            <article className={"clip " + (spans[i] || "span-6")} key={i}>
              <div className="clip-thumb">
                {clip.foto && <img src={clip.foto} alt={clip.titel} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
              </div>
              <div className="clip-meta">
                <span>{clip.bron}</span>
                <span>{clip.datum}</span>
              </div>
              <h3 className="clip-headline">{clip.titel}</h3>
              <p className="clip-quote">"{clip.quote}"</p>
            </article>
          )}
        </div>
        <div style={{ marginTop: "60px", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em", color: "var(--teal-deep)", opacity: 0.7 }}>
          — Volledige knipsels op aanvraag —
        </div>
      </div>
    </section>);
}

// ----- Contact -----
function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <section className="contact" id="contact">
      <div className="shell">
        <div className="reveal">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.18em", color: "var(--orange)", marginBottom: "32px" }}>Contact</div>
          <h2 className="contact-h">
            Quiz te <em>verdedigen?</em><br />
            We denken erover na.
          </h2>
          <div className="contact-meta reveal-stagger" style={{ marginTop: "40px" }}>
            <div className="row">
              <span className="k">EMAIL</span>
              <span className="v"><a href="mailto:info@teluiomtewinnen.be">info@teluiomtewinnen.be</a></span>
            </div>
            <div className="row">
              <span className="k">BASIS</span>
              <span className="v">Lommel, België</span>
            </div>
            <div className="row">
              <span className="k">VOORWAARDE</span>
              <span className="v">Borrelplank verzekerd</span>
            </div>
          </div>
        </div>
        <div className="reveal">
          {sent ?
            <div className="cf-thanks">
              Bericht <em>verzonden.</em><br />
              We laten van ons horen — vermoedelijk net na de borrelplank.
            </div> :
            <form className="contact-form" onSubmit={onSubmit}>
              <div className="cf-row">
                <div className="cf-field">
                  <label htmlFor="cf-name">Jouw naam</label>
                  <input id="cf-name" type="text" required placeholder="Voornaam Achternaam" />
                </div>
                <div className="cf-field">
                  <label htmlFor="cf-email">E-mail</label>
                  <input id="cf-email" type="email" required placeholder="jij@voorbeeld.be" />
                </div>
              </div>
              <div className="cf-field">
                <label htmlFor="cf-onderwerp">Onderwerp</label>
                <select id="cf-onderwerp" defaultValue="" required>
                  <option value="" disabled>Kies een reden</option>
                  <option>Uitnodiging voor een quiz</option>
                  <option>Persvraag · De Lommelse Gazet</option>
                  <option>Sponsoring (lees: borrelplanken)</option>
                  <option>Iets anders</option>
                </select>
              </div>
              <div className="cf-field">
                <label htmlFor="cf-bericht">Bericht</label>
                <textarea id="cf-bericht" required placeholder="Datum, locatie, en — belangrijk — of er borrelplanken voorzien zijn."></textarea>
              </div>
              <button type="submit" className="cf-submit">Verzenden →</button>
            </form>
          }
        </div>
      </div>
    </section>);
}

// ----- Footer -----
function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div>© {new Date().getFullYear()} Te Lui Om Te Winnen · Lommel</div>
        <div>Sinds ± 2016 · één zege bevestigd</div>
        <div>info@teluiomtewinnen.be</div>
      </div>
    </footer>);
}

Object.assign(window, {
  ScrollProgress, Nav, Hero, About, Mottos, Kalender, Uitslagen, Leden, Media, Contact, Footer, useReveal
});
