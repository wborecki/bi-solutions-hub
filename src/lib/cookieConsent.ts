export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-changed";

export type CookieConsentStatus = "accepted" | "rejected" | null;

export function getCookieConsent(): CookieConsentStatus {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : null;
}

export function setCookieConsent(status: Exclude<CookieConsentStatus, null>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(COOKIE_CONSENT_KEY, status);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: status }));
}