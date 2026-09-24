"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import type { EditMap } from "@/lib/kiwi-edit";
import type { GLOBAL } from "@/content/global";
import { useI18n } from "@/components/I18nProvider";
import { localePath, type Lang } from "@/lib/i18n";

export type NavKey = "home" | "solutions" | "technology" | "industries" | "projects" | "company" | "contact" | "legal" | "qhse" | "tower-m";

type MenuKey = Exclude<NavKey, "legal" | "qhse">;

/** Shell texts, resolved server-side from the Kiwi panel (see SiteShell.tsx). */
export type ShellContent = {
  nav: Record<MenuKey, string>;
  logo: string;
  logoAlt: string;
  footer: {
    companyName: string;
    tagline: string;
    hqTitle: string;
    address: string;
    vatLine: string;
    contactTitle: string;
    email: string;
    contactLink: string;
    complianceTitle: string;
    isoUrl: string;
    isoLink: string;
    privacyLink: string;
    qhseLink: string;
    copyright: string;
  };
};

/** Language menu (null while the Italian version isn't public). */
export type ShellLanguages = {
  label: string;
  items: Array<{ lang: Lang; label: string; href: string }>;
};

type SiteShellProps = PropsWithChildren<{
  lang: Lang;
  languages: ShellLanguages | null;
  active: NavKey;
  content: ShellContent;
  /** Kiwi editor markers for the global blocks (undefined for visitors). */
  edit?: EditMap<typeof GLOBAL>;
  /** True only inside the Kiwi editor: menu links tell it which pages exist. */
  editing?: boolean;
}>;

type NavItem = {
  key: MenuKey;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "solutions", href: "/solutions" },
  { key: "technology", href: "/technology" },
  { key: "tower-m", href: "/tower-m" },
  { key: "industries", href: "/industries" },
  { key: "projects", href: "/projects" },
  { key: "company", href: "/company" },
  { key: "contact", href: "/contact" },
];

export default function SiteShellClient({ lang, languages, active, content, edit, editing, children }: SiteShellProps) {
  const { nav, footer } = content;
  const { a11y } = useI18n();
  // Path without the language prefix ("/it/projects" → "/projects").
  const pathname = usePathname().replace(/^\/it(?=\/|$)/, "") || "/";
  const to = (href: string) => localePath(lang, href);
  const [isSolid, setIsSolid] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeKey = useMemo(() => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/projects")) return "projects";
    const found = NAV_ITEMS.find((item) => item.href !== "/" && pathname.startsWith(item.href));
    return found?.key ?? active;
  }, [active, pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsSolid(y > 36);

      const progress = document.querySelector<HTMLElement>(".scroll-progress");
      if (progress) {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const ratio = max > 0 ? y / max : 0;
        progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
      }

      const heroImg = document.querySelector<HTMLElement>(".page-hero-media img");
      if (heroImg) {
        const zoom = Math.min(y / 1800, 0.05);
        heroImg.style.transform = `scale(${1 + zoom})`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-opened", isMenuOpen);
    return () => document.body.classList.remove("menu-opened");
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);

    const cleanups: Array<() => void> = [];

    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -42px 0px",
      }
    );

    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 22, 260)}ms`;
      observer.observe(item);
      // Safety net: if the item is already in the viewport on mount,
      // mark it visible immediately. The IntersectionObserver does fire
      // on initial observe, but hot client-side navigations sometimes
      // miss it. We don't want a blank hero waiting for a scroll.
      const rect = item.getBoundingClientRect();
      if (rect.top < viewportH - 40 && rect.bottom > 0) {
        item.classList.add("is-visible");
      }
    });

    cleanups.push(() => observer.disconnect());

    const interactiveCards = Array.from(
      document.querySelectorAll<HTMLElement>(".card, .panel, .stat, .info, .contact-item, .cta, .process-step")
    );

    interactiveCards.forEach((card) => {
      card.classList.add("interactive");

      const onPointerMove = (event: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const x = event.clientX - r.left;
        const y = event.clientY - r.top;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
      };

      card.addEventListener("pointermove", onPointerMove);
      cleanups.push(() => card.removeEventListener("pointermove", onPointerMove));
    });

    const wowBlocks = Array.from(document.querySelectorAll<HTMLElement>("[data-wow]"));

    wowBlocks.forEach((block) => {
      const items = Array.from(block.querySelectorAll<HTMLElement>(".wow-item[data-id]"));
      const images = Array.from(block.querySelectorAll<HTMLElement>(".wow-media img[data-id]"));
      if (!items.length || !images.length) return;

      let index = 0;
      let timer: ReturnType<typeof setInterval> | null = null;

      const activateByIndex = (i: number) => {
        index = (i + items.length) % items.length;
        const id = items[index].getAttribute("data-id");

        items.forEach((item) => {
          item.classList.toggle("active", item.getAttribute("data-id") === id);
        });

        images.forEach((img) => {
          img.classList.toggle("active", img.getAttribute("data-id") === id);
        });
      };

      const next = () => activateByIndex(index + 1);

      const stop = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };

      const start = () => {
        stop();
        timer = setInterval(next, 3600);
      };

      items.forEach((item, i) => {
        const onClick = () => {
          activateByIndex(i);
          start();
        };
        const onEnter = () => {
          activateByIndex(i);
          stop();
        };
        const onLeave = () => start();

        item.addEventListener("click", onClick);
        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        // Keyboard parity: focusing an item (Tab) activates it and pauses the
        // auto-cycle, blurring resumes — mirrors hover for non-mouse users.
        item.addEventListener("focus", onEnter);
        item.addEventListener("blur", onLeave);

        cleanups.push(() => {
          item.removeEventListener("click", onClick);
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
          item.removeEventListener("focus", onEnter);
          item.removeEventListener("blur", onLeave);
        });
      });

      const onBlockEnter = () => stop();
      const onBlockLeave = () => start();

      block.addEventListener("mouseenter", onBlockEnter);
      block.addEventListener("mouseleave", onBlockLeave);

      cleanups.push(() => {
        block.removeEventListener("mouseenter", onBlockEnter);
        block.removeEventListener("mouseleave", onBlockLeave);
      });

      activateByIndex(0);
      start();
      cleanups.push(stop);
    });

    // Process steps ↔ process visuals (used on /technology)
    const processSteps = Array.from(
      document.querySelectorAll<HTMLElement>(".process-step[data-image]")
    );
    const processVisuals = Array.from(
      document.querySelectorAll<HTMLImageElement>(".process-visual img[data-id]")
    );
    if (processSteps.length && processVisuals.length) {
      const activate = (id: string | null) => {
        if (!id) return;
        processSteps.forEach((s) =>
          s.classList.toggle("active", s.getAttribute("data-image") === id)
        );
        processVisuals.forEach((img) =>
          img.classList.toggle("active", img.getAttribute("data-id") === id)
        );
      };
      processSteps.forEach((step) => {
        const id = step.getAttribute("data-image");
        const onActivate = () => activate(id);
        step.addEventListener("click", onActivate);
        step.addEventListener("mouseenter", onActivate);
        step.addEventListener("focus", onActivate);
        cleanups.push(() => {
          step.removeEventListener("click", onActivate);
          step.removeEventListener("mouseenter", onActivate);
          step.removeEventListener("focus", onActivate);
        });
      });
    }

    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(
        ".page-hero-media img, .photo-card img, .editorial-rail img, .media img, .dominant-cluster img, .wow-media img, .madrid-auto img"
      )
    );

    images.forEach((img) => {
      const applyRatioClass = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;

        const ratio = w / h;
        let ratioClass = "ratio-standard";
        if (ratio < 1.1) ratioClass = "ratio-portrait";
        if (ratio > 1.72) ratioClass = "ratio-wide";

        img.classList.remove("ratio-portrait", "ratio-standard", "ratio-wide");
        img.classList.add(ratioClass);

        const frame = img.closest<HTMLElement>(".auto-lux-card, .photo-card, .editorial-rail figure, .panel.media, .madrid-auto .photo-card");
        if (frame) {
          frame.classList.remove("ratio-portrait", "ratio-standard", "ratio-wide");
          frame.classList.add(ratioClass);
        }
      };

      if (img.complete) {
        applyRatioClass();
      } else {
        img.addEventListener("load", applyRatioClass, { once: true });
      }
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />

      <div className="topbar-wrap">
        <Link className="floating-logo" href={to("/")} aria-label={a11y.home_link}>
          <Image {...edit?.images.logo} src={content.logo} alt={content.logoAlt} width={649} height={403} priority />
        </Link>

        <header className={`topbar ${isSolid ? "is-solid" : ""} ${isMenuOpen ? "menu-open" : ""}`.trim()}>
          <button
            className="menu-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
            aria-label={isMenuOpen ? a11y.menu_close : a11y.menu_open}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav id="site-menu">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                data-nav={item.key}
                className={activeKey === item.key ? "active" : ""}
                href={to(item.href)}
                onClick={() => setIsMenuOpen(false)}
                {...(editing ? { "data-kiwi-page": item.key, "data-kiwi-page-title": nav[item.key] } : {})}
              >
                {nav[item.key]}
              </Link>
            ))}
          </nav>

          {languages ? (
            // Plain links: each language has its own root layout (full page load).
            <div className="lang-switch" role="group" aria-label={languages.label}>
              {languages.items.map((item) => (
                <a
                  key={item.lang}
                  href={item.href}
                  hrefLang={item.lang}
                  lang={item.lang}
                  className={item.lang === lang ? "active" : undefined}
                  aria-current={item.lang === lang ? "true" : undefined}
                  {...(item.lang === "en" ? edit?.i18n.switch_en : edit?.i18n.switch_it)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </header>
      </div>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-grid">
            <div>
              <h4 {...edit?.company.name}>{footer.companyName}</h4>
              <p {...edit?.footer.tagline}>{footer.tagline}</p>
            </div>
            <div>
              <h4 {...edit?.footer.hq_title}>{footer.hqTitle}</h4>
              <p>{footer.address}</p>
              <p>{footer.vatLine}</p>
            </div>
            <div>
              <h4 {...edit?.footer.contact_title}>{footer.contactTitle}</h4>
              <p>
                <a href={`mailto:${footer.email}`} {...edit?.company.email}>{footer.email}</a>
              </p>
              <p>
                <Link href={to("/contact")} {...edit?.footer.contact_link}>{footer.contactLink}</Link>
              </p>
            </div>
            <div>
              <h4 {...edit?.footer.compliance_title}>{footer.complianceTitle}</h4>
              <p>
                <a href={footer.isoUrl} target="_blank" rel="noopener noreferrer" {...edit?.footer.iso_link}>
                  {footer.isoLink}
                </a>
              </p>
              <p>
                <Link href={to("/legal")} {...edit?.footer.privacy_link}>{footer.privacyLink}</Link>
              </p>
              <p>
                <Link href={to("/qhse")} {...edit?.footer.qhse_link}>{footer.qhseLink}</Link>
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{footer.copyright.replace("{year}", String(new Date().getFullYear()))}</p>
            <p className="footer-powered">
              <span>Powered by</span>
              <a
                href="https://www.kiwienterprise.it"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={a11y.kiwi_credit}
              >
                <svg
                  className="kiwi-mark"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <defs>
                    <linearGradient
                      id="kiwiNetGrad"
                      x1="0"
                      y1="0"
                      x2="100"
                      y2="100"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#c6f06a" />
                      <stop offset="100%" stopColor="#4fa30d" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="7" fill="url(#kiwiNetGrad)" />
                  <g transform="translate(50 50)">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                      (deg) => (
                        <g key={deg} transform={`rotate(${deg})`}>
                          <line
                            x1="10"
                            y1="0"
                            x2="33"
                            y2="0"
                            stroke="url(#kiwiNetGrad)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="36"
                            cy="0"
                            r="2.8"
                            fill="url(#kiwiNetGrad)"
                          />
                        </g>
                      )
                    )}
                  </g>
                </svg>
                <span>KiwiNetwork</span>
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
