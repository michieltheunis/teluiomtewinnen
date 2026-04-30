// Components for Te Lui Om Te Winnen onepager
const { useState, useEffect, useRef } = React;

// ----- Data -----
const KALENDER = [
{ d: "08", m: "MEI", quiz: "Quiztion", where: "Lommel", ploeg: ["Michiel", "Jorik", "Nore", "Baileyke", "Rik", "Rosalie"] },
{ d: "15", m: "MEI", quiz: "Bruudruusterquiz", where: "Lommel", ploeg: ["Michiel", "Robin", "Jorik", "Jensie", "Baileyke", "Wouter"] },
{ d: "18", m: "SEP", quiz: "Geknipte Lommelse Gazet Quiz", where: "Lommel", ploeg: ["Michiel", "?", "?", "?", "?", "?"] },
{ d: "09", m: "OKT", quiz: "FC Vandenberken Quiz", where: "Lommel", ploeg: ["Michiel", "Bob", "Jorik", "Jensie", "Robin", "?"] },
{ d: "30", m: "OKT", quiz: "Lovoc Quiz", where: "Lommel", ploeg: ["Michiel", "Bob", "Jorik", "Jensie", "Robin", "?"] }];


const UITSLAGEN_2526 = [
{ date: "24 APR 2026", quiz: "Die van os quiz", place: "Lommel", rank: 4, of: 39 },
{ date: "17 APR 2026", quiz: "Mèndetquiz", place: "Lommel", rank: 5, of: 37, youthWin: true },
{ date: "27 MRT 2026", quiz: "COE Quiz", place: "Lommel", rank: 4, of: 36 },
{ date: "14 MRT 2026", quiz: "Klapkwis", place: "Lommel", rank: 4, of: 75 },
{ date: "27 FEB 2026", quiz: "Leopoldquiz", place: "Lommel", rank: 7, of: 46 },
{ date: "14 NOV 2025", quiz: "Lovoc Quiz", place: "Lommel", rank: 1, of: 36 },
{ date: "10 OKT 2025", quiz: "FC Vandenberken Quiz", place: "Lommel", rank: 3, of: 42 },
{ date: "19 SEP 2025", quiz: "Internetgazet Quiz", place: "Lommel", rank: 7, of: 33 },
{ date: "14 AUG 2025", quiz: "Sporta Quiz", place: "Westerlo", rank: 6, of: 14 }];


// Vorig seizoen — placeholders, gemarkeerd zodat user ze kan vervangen
const UITSLAGEN_2425 = [
{ date: "— 2025", quiz: "Archief 2024–2025", place: "Lommel", rank: "—", of: "—", placeholder: true }];


const SEIZOENEN = {
  "2025/26": UITSLAGEN_2526,
  "2024/25": UITSLAGEN_2425
};

const LEDEN = [
{ name: "Michiel", role: "De vaste waarde", bio: "Aanwezig op elke quiz sinds mensenheugenis. Houdt onbewust de naamgeving vol." },
{ name: "Jorik", role: "Popcultuur & muziek", bio: "Herkent intro's binnen 0,4 seconden. Is daarna boos als de vraag iets anders blijkt." },
{ name: "Bob", role: "Geschiedenis & politiek", bio: "Geeft het juiste antwoord op vragen die niemand gesteld heeft. Drinkt langzaam." },
{ name: "Jensie", role: "Wetenschap & techniek", bio: "Twijfelt bij elk antwoord en heeft 9 op 10 keer gelijk. Ondergewaardeerd nationaal erfgoed." },
{ name: "Robin", role: "Sport & algemeen", bio: "Schreeuwt antwoorden door. Soms goed. Soms heel niet. Levert sfeer in elk geval." },
{ name: "Het 6e lid", role: "Roulerende stoel", bio: "Wisselend gevuld door Nore, Baileyke, Rik, Rosalie of Wouter. Brengt steevast een nieuw perspectief én één onverwacht juist antwoord." }];


const MOTTOS = [
{ q: "Wij zijn niet hier om te winnen. Wij zijn hier voor de borrelplank.", a: "Michiel, openingswoord" },
{ q: "Een vierde plaats voelt eigenlijk beter dan een derde. Minder druk volgende keer.", a: "Bob, na FC Vandenberken" },
{ q: "Hadden we maar wat sneller bij de bestelling moeten zijn.", a: "Elke quiz, ronde 3" },
{ q: "We hebben gewonnen. Eén keer. Dat moet genoeg zijn voor een decennium.", a: "Lovoc, nov. 2025" }];


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
      // hide on scroll down past 200px, show on scroll up
      if (y > 200 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Close drawer when a link is clicked
  const close = () => setOpen(false);
  // Lock scroll when drawer open
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
function Hero() {
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
                <span><b>14.08.25</b> Sporta Quiz <span className="pos">6/14</span></span><span className="sep">✦</span>
                <span><b>19.09.25</b> Internetgazet Quiz <span className="pos">7/33</span></span><span className="sep">✦</span>
                <span><b>10.10.25</b> FC Vandenberken <span className="pos">3/42</span></span><span className="sep">✦</span>
                <span><b>14.11.25</b> Lovoc Quiz <span className="pos">1/36</span></span><span className="sep">✦</span>
                <span><b>27.02.26</b> Leopoldquiz <span className="pos">7/46</span></span><span className="sep">✦</span>
                <span><b>14.03.26</b> Klapkwis <span className="pos">4/75</span></span><span className="sep">✦</span>
                <span><b>27.03.26</b> COE Quiz <span className="pos">4/36</span></span><span className="sep">✦</span>
                <span><b>17.04.26</b> Mèndetquiz <span className="pos">5/37 ★</span></span><span className="sep">✦</span>
                <span><b>24.04.26</b> Die van os <span className="pos">4/39</span></span><span className="sep">✦</span>
                <span><b>Volgende</b> 08.05.26 Quiztion</span><span className="sep">✦</span>
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="hero-ticker-side">9 gekwist · 1 zege</div>
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
              <p>
                We doen mee aan zo'n tien quizzen per jaar in en rond Lommel. Onze sterke vakgebieden? Daar zijn we zelf nog niet uit. Onze zwakke vakgebieden? Onbekend, maar legio.
              </p>
              <p>
                We zijn niet de luidste ploeg. Niet de strakste. Niet de snelste met het opheffen van de hand. Maar als de jury de laatste kruisjes zet en wij eindigen ergens tussen plek 4 en 7 — dan was het een goede avond.
              </p>
              <p>
                We hebben één keer gewonnen. Dat blijft voorlopig genoeg.
              </p>
            </div>
          </div>
          <div className="about-stats-wrap">
            <div className="about-stats">
            <div className="stat">
              <div className="num">±10</div>
              <span className="lab">Quizzen / jaar</span>
            </div>
            <div className="stat">
              <div className="num">5</div>
              <span className="lab">Vaste leden</span>
            </div>
            <div className="stat">
              <div className="num"><em>1</em></div>
              <span className="lab">Officiële zege</span>
            </div>
            <div className="stat">
              <div className="num">∞</div>
              <span className="lab">Uitverkochte planken</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>);

}

// ----- Mottos -----
function Mottos() {
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
          {MOTTOS.map((m, i) =>
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
function Kalender() {
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
          {KALENDER.map((k, i) =>
          <div className="kal-row" key={i}>
              <div className="kal-date">
                <div className="date-d">{k.d}</div>
                <span className="date-m">{k.m} '26</span>
              </div>
              <div className="kal-main">
                <div className="name">{k.quiz}</div>
                <div className="ploeg">
                  {k.ploeg.map((p, idx) =>
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
function Uitslagen() {
  const [season, setSeason] = useState("2025/26");
  const rows = SEIZOENEN[season];
  const numericRows = rows.filter((r) => typeof r.rank === "number");
  const podiums = numericRows.filter((u) => u.rank <= 3).length;
  const top5 = numericRows.filter((u) => u.rank <= 5).length;
  const best = numericRows.length ? numericRows.reduce((a, b) => a.rank < b.rank ? a : b) : null;
  const avg = numericRows.length ? (numericRows.reduce((s, u) => s + u.rank, 0) / numericRows.length).toFixed(1) : "—";
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
              {Object.keys(SEIZOENEN).map((s) =>
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
              {rows[0].placeholder &&
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
                <div className="big"><em>{best.rank}</em><span style={{ fontSize: "36px" }}>e</span> </div>
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
function Leden() {
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
          {LEDEN.map((l, i) =>
          <div className="lid" key={i}>
              <div className="num">№ {String(i + 1).padStart(2, "0")} / 06</div>
              <div className="portrait"></div>
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
function Media() {
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
          <article className="clip span-7">
            <div className="clip-thumb"></div>
            <div className="clip-meta">
              <span>DE LOMMELSE GAZET</span>
              <span>15.11.2025</span>
            </div>
            <h3 className="clip-headline">"Te Lui Om Te Winnen" wint dan toch <em>één keer</em></h3>
            <p className="clip-quote">"Niemand was meer verbaasd dan zijzelf, getuige de stille reactie aan tafel 7."</p>
          </article>
          <article className="clip span-5">
            <div className="clip-thumb"></div>
            <div className="clip-meta">
              <span>DE LOMMELSE GAZET</span>
              <span>11.10.2025</span>
            </div>
            <h3 className="clip-headline">Lokale ploeg <em>derde</em> bij FC Vandenberken</h3>
            <p className="clip-quote">"Een knap resultaat, mits de borrelplank vooraf besteld."</p>
          </article>
          <article className="clip span-6">
            <div className="clip-thumb"></div>
            <div className="clip-meta">
              <span>DE LOMMELSE GAZET</span>
              <span>15.03.2026</span>
            </div>
            <h3 className="clip-headline">Klapkwis kent <em>verrassende</em> top tien</h3>
            <p className="clip-quote">"Met 75 ploegen aan de start wordt vier op vier en zeventig opnieuw bewezen knap."</p>
          </article>
          <article className="clip span-6">
            <div className="clip-thumb"></div>
            <div className="clip-meta">
              <span>DE LOMMELSE GAZET</span>
              <span>18.04.2026</span>
            </div>
            <h3 className="clip-headline">Mèndetquiz: <em>discussie</em> over één antwoord</h3>
            <p className="clip-quote">"De ploeg gaf na afloop 'geen verdere commentaar' en bestelde een plank."</p>
          </article>
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
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.18em", color: "var(--orange)", marginBottom: "32px" }}>Contact

          </div>
          <h2 className="contact-h">
            Quiz te <em>verdedigen?</em><br />
            We denken erover na.
          </h2>
          <div className="contact-meta reveal-stagger" style={{ marginTop: "40px" }}>
            <div className="row">
              <span className="k">EMAIL</span>
              <span className="v"><a href="mailto:info@teluiomtewinnen.be" style={{ textDecoration: "none" }}>info@teluiomtewinnen.be</a></span>
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