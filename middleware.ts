import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import { localeToHSRLang, localeToWWLang } from "@utils/locale-to-lang";

import { i18n } from "./i18n-config";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const href = request.nextUrl.href;
  const pathname = href.replace(request.nextUrl.origin, "");

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  // if (
  //   [
  //     '/manifest.json',
  //     '/favicon.ico',
  //     // Your other files in `public`
  //   ].includes(pathname)
  // )
  //   return

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    let locale = getLocale(request);

    // Ensure we have a locale
    const isWW = pathname.startsWith("/wuthering-waves");
    const isHSR = pathname.startsWith("/hsr");
    const isZenless = pathname.startsWith("/zenless");

    if (isWW) {
      locale = localeToWWLang(locale ?? "en");
    }

    if (isHSR || isZenless) {
      locale = localeToHSRLang(locale ?? "en");
    }

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/` and `/admin/` subpaths
  matcher: [
    "/((?!en|es|ja|cn|zh-tw|de|fr|id|it|ko|pt|ru|th|tr|vi|api|icons|imgs|_next/static|_next/data|admin|_next/image|manifest.json|favicon.ico|robots.txt|sitemap.xml|sitemap-[0-9]+.xml|icon.png|logo.png|ads.txt|sw.js|_axiom/web-vitals|adb.js|workbox-[a-zA-Z0-9]+.js|SourceSansPro-SemiBold/SourceSansPro-SemiBold.woff|monitoring).*)",
  ],
};
