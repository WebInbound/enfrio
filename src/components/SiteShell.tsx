"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";

type SiteShellProps = PropsWithChildren<{ active: NavItem["key"] }>;

type NavKey = "home" | "solutions" | "technology" | "industries" | "projects" | "company" | "contact" | "legal" | "qhse" | "tower-m";

type NavItem = {
  key: NavKey;
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "solutions", label: "Solutions", href: "/solutions" },
  { key: "technology", label: "Technology", href: "/technology" },
  { key: "tower-m", label: "M Tower", href: "/tower-m" },
  { key: "industries", label: "Industries", href: "/industries" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "company", label: "Company", href: "/company" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export default function SiteShell({ active, children }: SiteShellProps) {
  const pathname = usePathname();
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

        cleanups.push(() => {
          item.removeEventListener("click", onClick);
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
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
        <Link className="floating-logo" href="/" aria-label="Enfrio home">
          <img src="/assets/images/logo-enfrio.png" alt="Enfrio logo" />
        </Link>

        <header className={`topbar ${isSolid ? "is-solid" : ""} ${isMenuOpen ? "menu-open" : ""}`.trim()}>
          <button
            className="menu-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav id="site-menu">
            {NAV_ITEMS.map((item) => (
              <Link key={item.key} data-nav={item.key} className={activeKey === item.key ? "active" : ""} href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
      </div>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-grid">
            <div>
              <h4>Enfrio Srl</h4>
              <p>Engine cooling for Power Generation and Datacenter.</p>
            </div>
            <div>
              <h4>Headquarters</h4>
              <p>Via Cascina Nuova 27, 13875 Ponderano (BI), Italy</p>
              <p>VAT: IT02553940020</p>
            </div>
            <div>
              <h4>Contact</h4>
              <p>
                <a href="mailto:info@enfrio.eu">info@enfrio.eu</a>
              </p>
              <p>
                <Link href="/contact">Request a project call</Link>
              </p>
            </div>
            <div>
              <h4>Compliance</h4>
              <p>
                <a href="/assets/certificazioneiso.pdf" target="_blank" rel="noopener noreferrer">
                  ISO Certificate
                </a>
              </p>
              <p>
                <Link href="/legal">Privacy &amp; Cookies</Link>
              </p>
              <p>
                <Link href="/qhse">QHSE Policy</Link>
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Enfrio Srl. All rights reserved.</p>
            <p className="footer-powered">
              <span>Powered by</span>
              <a
                href="https://www.kiwienterprise.it"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KiwiNetwork — site by Kiwi Enterprise"
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
