/**
 * Sends a Pendo Track Event from the browser. The Pendo agent attaches the current
 * visitor and account automatically, so callers only pass event-specific properties.
 * No-ops when the agent is not loaded, and never lets a tracking failure break the app.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | boolean | number>
): void {
  try {
    window.pendo?.track(eventName, properties);
  } catch {
    // Tracking must never interrupt the user flow.
  }
}
