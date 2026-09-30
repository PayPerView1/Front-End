"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMessages } from "next-intl";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronDown, CirclePlay, Globe2,
  Layers3, Moon, ShieldCheck, Sparkles, Sun, Wallet,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const signup = (locale) => `/${locale}/register`;
const languages = [
  ["ar", "العربية"], ["en", "English"], ["de", "Deutsch"], ["es", "Español"],
  ["fr", "Français"], ["pt", "Português"], ["zh", "中文"], ["it", "Italiano"],
  ["nl", "Nederlands"], ["pl", "Polski"], ["ja", "日本語"], ["tr", "Türkçe"],
];
const richKeys = new Set(["heroTitle", "flowTitle", "loopTitle", "brandsTitle", "clipperTitle", "verifiedTitle", "whyTitle", "wallTitle", "wallNote", "ctaTitle", "footerText"]);

function RichText({ value }) {
  return String(value).split(/(\[\[.*?\]\]|\n)/gs).map((part, index) => {
    if (part === "\n") return <br key={index} />;
    if (part.startsWith("[[") && part.endsWith("]]")) return <em key={index}>{part.slice(2, -2)}</em>;
    return part;
  });
}

function useLandingMessages() {
  const allMessages = useMessages();
  const messages = allMessages.landing;
  return new Proxy(Object.create(null), {
    get(_target, key) {
      if (typeof key !== "string") return undefined;
      const value = messages?.[key];
      return richKeys.has(key) ? <RichText value={value} /> : value;
    },
  });
}

function BrandMark() {
  return (
    <a className="ppv-brand" href="#home" aria-label="PayPerView home">
      <Image className="ppv-mark-image" src="/images/logo6.png" width={34} height={34} alt="" />
      <span>payperview<span className="ppv-brand-dot">.</span></span>
    </a>
  );
}

function LandingNavbar({ locale, t, isDark, toggleTheme }) {
  const [compact, setCompact] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef(null);
  useEffect(() => {
    const update = () => setCompact(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!languageMenuOpen) return;
    const closeOnOutsideClick = (event) => {
      if (!languageMenuRef.current?.contains(event.target)) setLanguageMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setLanguageMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [languageMenuOpen]);

  function changeLanguage(nextLocale) {
    const nextPath = window.location.pathname.replace(/^\/[^/]+/, `/${nextLocale}`);
    window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`);
  }

  return (
    <header className={`ppv-nav ${compact ? "is-compact" : ""}`}>
      <div className="ppv-nav-inner">
        <BrandMark />
        <nav aria-label="Main navigation">
          <a href="#how-it-works">{t.nav[0]}</a>
          <a href="#brands">{t.nav[1]}</a>
          <a href="#clippers">{t.nav[2]}</a>
        </nav>
        <div className="ppv-nav-tools">
          <div className="ppv-language-picker" ref={languageMenuRef}>
            <button className="ppv-language-control" type="button" aria-label={t.language} aria-expanded={languageMenuOpen} aria-haspopup="listbox" onClick={() => setLanguageMenuOpen((open) => !open)}>
              <Globe2 size={15} aria-hidden="true" />
              <span>{languages.find(([code]) => code === locale)?.[1] ?? locale}</span>
              <ChevronDown className={languageMenuOpen ? "is-open" : ""} size={13} aria-hidden="true" />
            </button>
            {languageMenuOpen && <div className="ppv-language-menu" role="listbox" aria-label={t.language}>
              {languages.map(([code, name]) => <button className="ppv-language-option" type="button" role="option" aria-selected={locale === code} key={code} onClick={() => { setLanguageMenuOpen(false); if (locale !== code) changeLanguage(code); }}>
                <span>{name}</span>{locale === code && <Check size={15} aria-hidden="true" />}
              </button>)}
            </div>}
          </div>
          <button className="ppv-theme-toggle" type="button" onClick={toggleTheme} aria-label={`${t.theme}: ${isDark ? t.light : t.dark}`} title={`${t.theme}: ${isDark ? t.light : t.dark}`}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a className="ppv-button ppv-button-small ppv-nav-start" href={signup(locale)}><span>{t.nav[3]}</span><ArrowUpRight size={15} /></a>
          <a className="ppv-nav-login" href={`/${locale}/login`}>{t.nav[4]}</a>
        </div>
      </div>
    </header>
  );
}

function VideoTile({ className = "", title, category, imageSrc, imageAlt = "", videoSrc }) {
  return (
    <article className={`ppv-video-tile ${className}`}>
      <div className="ppv-video-art">
        {videoSrc ? (
          <video className="ppv-video-media" autoPlay loop muted preload="metadata" playsInline poster={imageSrc} aria-label={title}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : imageSrc ? (
          <Image className="ppv-video-photo" src={imageSrc} alt={imageAlt} fill sizes="(max-width: 760px) 45vw, 25vw" />
        ) : (
          <><div className="ppv-video-sun" /><div className="ppv-video-horizon" /><div className="ppv-video-person" /><span className="ppv-play"><CirclePlay size={25} /></span></>
        )}
        <span className="ppv-video-tag">{category}</span>
      </div>
      <div className="ppv-video-meta"><span>{title}</span></div>
    </article>
  );
}

function Hero({ locale, t }) {
  const compactNumber = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  return (
    <section className="ppv-hero" id="home">
      <div className="ppv-hero-grid" />
      <div className="ppv-container ppv-hero-layout">
        <div className="ppv-hero-copy">
          <div className="ppv-eyebrow"><span className="ppv-live-dot" /> {t.heroEyebrow}</div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="ppv-hero-actions">
            <a className="ppv-button" href={signup(locale)}>{t.nav[3]} <ArrowRight size={17} /></a>
            <a className="ppv-text-link" href="#how-it-works">{t.explore} <ArrowDown size={15} /></a>
          </div>
          <div className="ppv-proof">
            <span className="ppv-proof-heading">{t.proof}</span>
            <div className="ppv-proof-stats" aria-label={t.proof}>
              <span><strong>{compactNumber.format(12840)}</strong><small>{t.verifiedViews}</small></span>
              <span><strong>{compactNumber.format(842)}</strong><small>{t.tabs[1]}</small></span>
              <span><strong>{compactNumber.format(36)}</strong><small>{t.campaign}</small></span>
            </div>
          </div>
        </div>
        <div className="ppv-hero-visual" aria-label={t.heroText}>
          <div className="ppv-orbit ppv-orbit-one" /><div className="ppv-orbit ppv-orbit-two" />
          <svg className="ppv-flow-lines" viewBox="0 0 610 500" aria-hidden="true">
            <path d="M105 175 C195 60 285 92 316 215 S430 334 522 224" />
            <path d="M100 364 C210 420 250 318 315 250 S430 94 512 142" />
            <circle cx="105" cy="175" r="3" /><circle cx="522" cy="224" r="3" />
          </svg>
          <div className="ppv-float-card ppv-float-video"><VideoTile title={t.wallTitles[1]} category={t.clippersEyebrow} imageSrc="/landing/friends-outdoors.jpg" imageAlt="Friends creating content together in a park" /></div>
          <div className="ppv-float-card ppv-float-campaign"><span className="ppv-card-label"><span className="ppv-icon-box"><CirclePlay size={16} /></span> {t.workspace}</span><strong>{t.campaign}</strong><span className="ppv-card-sub">{t.workspaceTitle}</span></div>
          <div className="ppv-float-card ppv-float-verified"><div className="ppv-verified-head"><span className="ppv-icon-box mint"><ShieldCheck size={17} /></span><span className="ppv-card-label">{t.verification}</span></div><strong>{t.readyActivity}</strong><div className="ppv-verified-foot"><span className="ppv-live-dot" /> {t.inDevelopment}</div></div>
          <div className="ppv-float-card ppv-float-source"><div className="ppv-source-icon"><CirclePlay size={17} /></div><div><b>{t.creatorWorkspace}</b><span>{t.workspaceLabel}</span></div><ArrowRight size={15} /></div>
          <span className="ppv-data-pulse pulse-one" /><span className="ppv-data-pulse pulse-two" />
        </div>
      </div>
      <div className="ppv-container ppv-hero-bottom"><span>{t.heroEyebrow}</span><span>{t.nav[1]} · {t.nav[2]} · {t.wallEyebrow}</span></div>
    </section>
  );
}

function ViewFlow({ t }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const nodes = [...document.querySelectorAll(".ppv-flow-step")];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(Number(entry.target.dataset.step));
    }), { rootMargin: "-38% 0px -38% 0px", threshold: 0 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return (
    <section className="ppv-section ppv-flow-section" id="how-it-works"><div className="ppv-container">
      <div className="ppv-section-heading"><div><span className="ppv-eyebrow">{t.flowEyebrow}</span><h2>{t.flowTitle}</h2></div><p>{t.flowIntro}</p></div>
      <div className="ppv-flow-board"><div className="ppv-flow-rail"><span style={{ height: `${(active / (t.steps.length - 1)) * 100}%` }} /></div>
        {t.steps.map((step, index) => <div className={`ppv-flow-step ${index <= active ? "is-active" : ""}`} data-step={index} key={step}>
          <span className="ppv-flow-index" aria-hidden="true" /><span className="ppv-flow-node">{index === 4 ? <ShieldCheck size={20} /> : index === 5 ? <Wallet size={20} /> : index === 3 ? <CirclePlay size={20} /> : <span className="ppv-node-dot" />}</span>
          <div className="ppv-flow-copy"><span>{step}</span><small>{t.stepDetails[index]}</small></div>
          {index === 4 && active >= 4 && <span className="ppv-flow-stamp"><BadgeCheck size={14} /> {t.verifiedViews}</span>}
        </div>)}
      </div>
      <div className="ppv-flow-caption"><span><span className="ppv-live-dot" /> {t.flowLabel}</span><span>{t.steps[0]} → {t.steps[2]} → {t.steps[4]} → {t.steps[5]}</span></div>
    </div></section>
  );
}

function LoopSection({ t }) {
  return <section className="ppv-loop-section"><div className="ppv-container ppv-loop-layout"><div><span className="ppv-eyebrow">{t.loopEyebrow}</span><h2>{t.loopTitle}</h2><p>{t.loopText}</p></div>
    <div className="ppv-loop-visual"><div className="ppv-loop-ring" /><div className="ppv-loop-center"><span className="ppv-mark"><span /></span><small>{t.loopEyebrow}</small></div>{t.loop.map((item, index) => <div key={item} className={`ppv-loop-node loop-node-${index + 1}`}>{item}</div>)}<div className="ppv-loop-spark"><Sparkles size={15} /></div></div>
  </div></section>;
}

function BrandsSection({ locale, t }) {
  const compactNumber = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const metrics = [
    [t.verifiedViews, compactNumber.format(12840)],
    [t.tabs[1], compactNumber.format(842)],
    [t.tabs[2], compactNumber.format(1260)],
    [t.tabs[3], new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(0.948)],
  ];
  return <section className="ppv-section ppv-audience-section" id="brands"><div className="ppv-container ppv-audience-layout">
    <div className="ppv-audience-copy"><span className="ppv-eyebrow">{t.brandsEyebrow} <span className="ppv-eyebrow-line" /></span><h2>{t.brandsTitle}</h2><p>{t.brandsText}</p><a className="ppv-text-link" href={signup(locale)}>{t.brandsLink} <ArrowRight size={16} /></a></div>
    <div className="ppv-dashboard"><div className="ppv-dashboard-top"><div><span className="ppv-dash-overline">{t.workspace}</span><h3>{t.campaign} <span className="ppv-status-live">{t.preview}</span></h3></div><span className="ppv-draft-state">{t.inDevelopment}</span></div>
      <div className="ppv-dashboard-tabs">{t.tabs.map((tab, i) => <span className={i === 0 ? "active" : ""} key={tab}>{tab}</span>)}</div>
      <div className="ppv-metric-grid">{metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="ppv-workspace-empty"><span className="ppv-icon-box mint"><CirclePlay size={18} /></span><span className="ppv-dash-overline">{t.workspaceEyebrow}</span><h4>{t.workspaceTitle}</h4><p>{t.workspaceText}</p><a href={signup(locale)}>{t.nav[3]} <ArrowRight size={14} /></a></div>
      <div className="ppv-workflow-preview">{t.workflow.map((label, i) => <span key={label}><i>{i === 0 ? "✓" : "·"}</i>{label}</span>).flatMap((node, i, nodes) => i < nodes.length - 1 ? [node, <b key={`line-${i}`} />] : [node])}</div>
      <div className="ppv-dashboard-bottom"><span><ShieldCheck size={13} /> {t.workspaceFoot}</span><span>{t.workspaceLabel}</span></div>
    </div>
  </div></section>;
}

function ClippersSection({ locale, t }) {
  return <section className="ppv-section ppv-clippers-section" id="clippers"><div className="ppv-container ppv-clippers-layout">
    <div className="ppv-clippers-visual"><div className="ppv-clippers-glow" /><VideoTile className="ppv-clip-main" title={t.wallTitles[2]} category={t.clippersEyebrow} imageSrc="/landing/city-creator.jpg" imageAlt="Creator looking over a city at golden hour" />
      <div className="ppv-earned-card"><div className="ppv-earned-top"><span className="ppv-icon-box"><Wallet size={16} /></span><span>{t.creatorWorkspace}</span></div><strong>{t.readyCreate}</strong><span className="ppv-earned-caption"><BadgeCheck size={14} /> {t.rewardsHere}</span></div>
      <div className="ppv-clips-mini"><span className="ppv-mini-thumb" /><span><b>{t.nextClip}</b><small>{t.campaignDetails}</small></span><CirclePlay size={16} /></div>
    </div>
    <div className="ppv-audience-copy"><span className="ppv-eyebrow">{t.clippersEyebrow} <span className="ppv-eyebrow-line" /></span><h2>{t.clipperTitle}</h2><p>{t.clipperText}</p><a className="ppv-text-link" href={signup(locale)}>{t.clipperLink} <ArrowRight size={16} /></a></div>
  </div></section>;
}

function VerifiedSection({ t }) {
  return <section className="ppv-verified-section" id="verified"><div className="ppv-verified-glow" /><div className="ppv-container ppv-verified-layout">
    <div className="ppv-verified-copy"><span className="ppv-eyebrow">{t.verifiedEyebrow}</span><h2>{t.verifiedTitle}</h2><p>{t.verifiedText}</p><div className="ppv-verified-checks">{t.checks.map((check) => <span key={check}><BadgeCheck size={16} /> {check}</span>)}</div></div>
    <div className="ppv-verification-module"><div className="ppv-verification-top"><span>{t.verification}</span><span className="ppv-check-live"><i /> {t.status}</span></div>
      <div className="ppv-verification-empty"><span className="ppv-result-icon"><ShieldCheck size={23} /></span><div><span>{t.statusTitle}</span><strong>{t.readyActivity}</strong></div></div>
      <div className="ppv-verify-steps">{t.verifySteps.map((step, index) => <span key={step}><i>{index === 0 ? <CirclePlay size={13} /> : index === 1 ? <Layers3 size={13} /> : <ShieldCheck size={13} />}</i>{step}</span>)}</div>
      <div className="ppv-verification-foot">{t.verifyFoot}</div>
    </div>
  </div></section>;
}

function WhySection({ t }) {
  const icons = [<BadgeCheck size={17} />, <CirclePlay size={17} />, <ShieldCheck size={17} />];
  return <section className="ppv-section ppv-why-section"><div className="ppv-container ppv-why-layout">
    <div className="ppv-why-intro"><span className="ppv-eyebrow">{t.whyEyebrow}</span><h2>{t.whyTitle}</h2><p>{t.whyText}</p></div>
    <div className="ppv-why-list">{t.why.map(([label, title, desc], i) => <article className="ppv-why-item" key={label}><span className="ppv-why-icon">{icons[i]}</span><div><span className="ppv-why-label">{label}</span><h3>{title}</h3><p>{desc}</p></div><ArrowUpRight className="ppv-why-arrow" size={18} /></article>)}</div>
  </div></section>;
}

function ContentWall({ t }) {
  return <section className="ppv-section ppv-wall-section"><div className="ppv-container"><div className="ppv-wall-heading"><div><span className="ppv-eyebrow">{t.wallEyebrow}</span><h2>{t.wallTitle}</h2></div><p>{t.wallText}</p></div>
    <div className="ppv-content-wall"><VideoTile className="wall-tile wall-tile-tall" title={t.wallTitles[0]} category={t.wallEyebrow} imageSrc="/landing/city-creator.jpg" imageAlt={t.wallTitles[0]} videoSrc="/landing/creator-coffee.mp4" /><VideoTile className="wall-tile wall-tile-wide" title={t.wallTitles[1]} category={t.clippersEyebrow} imageSrc="/landing/friends-outdoors.jpg" imageAlt={t.wallTitles[1]} /><VideoTile className="wall-tile wall-tile-small" title={t.wallTitles[2]} category={t.brandsEyebrow} imageSrc="/landing/city-creator.jpg" imageAlt={t.wallTitles[2]} /><VideoTile className="wall-tile wall-tile-mid" title={t.wallTitles[3]} category={t.workspaceLabel} imageSrc="/landing/creator-filming.jpg" imageAlt={t.wallTitles[3]} /><div className="ppv-wall-note"><span className="ppv-live-dot" /><b>{t.wallNote}</b><span>{t.brandsEyebrow} × {t.clippersEyebrow}</span></div></div>
    <p className="ppv-media-credit">{t.mediaCredit} <a href="https://www.pexels.com/video/woman-drinking-coffee-onn-the-rooftop-6808084/" target="_blank" rel="noreferrer">Pexels</a>. {t.photosCredit} <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash</a>.</p>
  </div></section>;
}

function FinalCTA({ locale, t }) {
  return <section className="ppv-final-cta"><div className="ppv-cta-grid" /><div className="ppv-container ppv-cta-inner"><span className="ppv-eyebrow"><span className="ppv-live-dot" /> {t.ctaEyebrow}</span><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p><div><a className="ppv-button" href={signup(locale)}>{t.forBrands} <ArrowRight size={16} /></a><a className="ppv-button ppv-button-ghost" href={signup(locale)}>{t.forCreators} <ArrowRight size={16} /></a></div><span className="ppv-cta-loop">{t.ctaLoop}</span></div></section>;
}

function Footer({ locale, t }) {
  return <footer className="ppv-footer"><div className="ppv-container"><div className="ppv-footer-main"><div><BrandMark /><p>{t.footerText}</p></div><div className="ppv-footer-links">
    <div><span>{t.exploreLabel}</span><a href="#how-it-works">{t.nav[0]}</a><a href="#brands">{t.nav[1]}</a><a href="#clippers">{t.nav[2]}</a></div>
    <div><span>{t.accountLabel}</span><a href={signup(locale)}>{t.nav[3]}</a><a href={`/${locale}/login`}>{t.nav[4]}</a></div>
    <div><span>{t.platformLabel}</span><a href="#verified">{t.verifiedViews}</a><a href="#home">{t.backTop}</a></div>
  </div></div><div className="ppv-footer-bottom"><span>© PayPerView</span><span>{t.ctaLoop}</span><a href="#home">{t.footerTag} <span>↗</span></a></div></div></footer>;
}

export default function LandingPage({ locale }) {
  const t = useLandingMessages();
  const { isDark, toggleTheme } = useTheme();
  return <div className={`ppv-landing ${isDark ? "is-dark" : "is-light"}`} dir={locale === "ar" ? "rtl" : "ltr"}>
    <LandingNavbar locale={locale} t={t} isDark={isDark} toggleTheme={toggleTheme} />
    <main><Hero locale={locale} t={t} /><ViewFlow t={t} /><LoopSection t={t} /><BrandsSection locale={locale} t={t} /><ClippersSection locale={locale} t={t} /><VerifiedSection t={t} /><WhySection t={t} /><ContentWall t={t} /><FinalCTA locale={locale} t={t} /></main>
    <Footer locale={locale} t={t} />
  </div>;
}
