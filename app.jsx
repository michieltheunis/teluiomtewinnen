// App.jsx — root + tweaks wiring
const { useEffect: useEffectApp, useState: useStateApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "dark",
  "type": "sans",
  "showLogo": true,
  "showMottos": true,
  "showMedia": true,
  "showProgress": true,
  "humor": 9
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [content, setContent] = useStateApp(null);

  useReveal(!!content);

  useEffectApp(() => {
    document.body.dataset.mode = tweaks.mode;
    document.body.dataset.type = tweaks.type;
  }, [tweaks.mode, tweaks.type]);

  useEffectApp(() => {
    fetch('content.json?v=' + Date.now())
      .then(r => r.json())
      .then(setContent)
      .catch(() => setContent({}));
  }, []);

  if (!content) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontFamily: 'var(--font-mono)', fontSize: '13px',
        letterSpacing: '0.08em', color: 'var(--teal-deep)'
      }}>
        laden…
      </div>
    );
  }

  return (
    <>
      {tweaks.showProgress && <ScrollProgress />}
      <Nav />
      <Hero uitslagen={content.uitslagen} kalender={content.kalender} />
      {content.eigenQuiz?.active && <EigenQuizBanner eq={content.eigenQuiz} />}
      <About />
      {tweaks.showMottos && <Mottos mottos={content.mottos} />}
      <Uitslagen uitslagen={content.uitslagen} />
      <Kalender kalender={content.kalender} eigenQuiz={content.eigenQuiz} />
      <Leden leden={content.leden} />
      {tweaks.showMedia && <Media media={content.media} />}
      <Contact />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Sfeer">
          <TweakRadio
            label="Kleurmodus"
            value={tweaks.mode}
            options={[
              { value: "light", label: "Licht" },
              { value: "warm", label: "Warm" },
              { value: "dark", label: "Donker" },
            ]}
            onChange={(v) => setTweak("mode", v)}
          />
          <TweakRadio
            label="Typografie"
            value={tweaks.type}
            options={[
              { value: "editorial", label: "Editorial" },
              { value: "mix", label: "Mix" },
              { value: "sans", label: "Sans" },
            ]}
            onChange={(v) => setTweak("type", v)}
          />
        </TweakSection>
        <TweakSection title="Secties">
          <TweakToggle label="Logo in hero" value={tweaks.showLogo} onChange={(v) => setTweak("showLogo", v)} />
          <TweakToggle label="Motto's tonen" value={tweaks.showMottos} onChange={(v) => setTweak("showMottos", v)} />
          <TweakToggle label="Media tonen" value={tweaks.showMedia} onChange={(v) => setTweak("showMedia", v)} />
          <TweakToggle label="Scroll-balk" value={tweaks.showProgress} onChange={(v) => setTweak("showProgress", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
