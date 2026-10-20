"use client";
export function CookiePreferencesButton() { return <button className="button" onClick={() => window.dispatchEvent(new Event("hh:consent-open"))}>Manage cookie preferences</button>; }
