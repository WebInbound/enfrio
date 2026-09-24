"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import { numberLocale, type Lang } from "@/lib/i18n";

/**
 * Screen-reader texts of the client components (panel "Globale › Testi per
 * gli screen reader"), resolved in the page language by the root layout.
 */
export type A11yTexts = {
  home_link: string;
  menu_open: string;
  menu_close: string;
  back_to_top: string;
  send_email: string;
  kiwi_credit: string;
  mtower_3d: string;
  power_slider: string;
  power_input: string;
  build_readout: string;
  build_stage: string;
  deploy_contexts: string;
  machinery_gallery: string;
  madrid_gallery: string;
  snapshots_gallery: string;
};

// English defaults = the texts the site shipped with (used only if a client
// component renders outside the provider).
const DEFAULT_A11Y: A11yTexts = {
  home_link: "Enfrio home",
  menu_open: "Open menu",
  menu_close: "Close menu",
  back_to_top: "Back to top",
  send_email: "Send email to {email}",
  kiwi_credit: "KiwiNetwork — site by Kiwi Enterprise",
  mtower_3d: "Enfrio M Tower 3D render — drag or scroll to rotate",
  power_slider: "Engine power in kilowatts",
  power_input: "Engine power numeric input",
  build_readout: "Live build specifications",
  build_stage: "Visualisation of {n} M Tower modules",
  deploy_contexts: "Deployment contexts",
  machinery_gallery: "Machinery detail auto gallery",
  madrid_gallery: "Madrid waste truck project gallery",
  snapshots_gallery: "Project snapshots auto gallery",
};

type I18n = { lang: Lang; locale: string; a11y: A11yTexts };

const I18nContext = createContext<I18n>({ lang: "en", locale: numberLocale("en"), a11y: DEFAULT_A11Y });

export function I18nProvider({ lang, a11y, children }: PropsWithChildren<{ lang: Lang; a11y: A11yTexts }>) {
  return (
    <I18nContext.Provider value={{ lang, locale: numberLocale(lang), a11y }}>{children}</I18nContext.Provider>
  );
}

/** Language, number locale ("en-US" / "it-IT") and screen-reader texts of the page. */
export function useI18n(): I18n {
  return useContext(I18nContext);
}
