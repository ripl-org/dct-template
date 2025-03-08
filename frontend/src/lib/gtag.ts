interface CustomEventParams extends Gtag.EventParams {
  [key: string]: unknown;
}

/**
 * https://developers.google.com/analytics/devguides/collection/gtagjs/events
 * If you want to track events, you can use the gtag.js event method.
 * */
export const sendEvent = (action: Gtag.EventNames | string, eventParams?: CustomEventParams) => {
  window.gtag('event', action, { ...eventParams });
};
