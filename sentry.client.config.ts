// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9c7422fbfed53fb87f55bc455bb22a83@o95426.ingest.us.sentry.io/4507630267400192",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  ignoreErrors: [
    `Cannot read properties of null (reading 'scrollX')`,

    // Ignore freestar, GoogleADS, Google Tag Manager, Google Analytics, and Google Recaptcha errors
    /.+Blocked a frame with origin.+/,
    /.+Blocked a restricted frame with origin.+/,
    /.+freestar.refreshActiveSlots is not a function.+/,
    /.+Cannot read properties of null \(reading 'document'\).+/,
    /.+https:\/\/goo.gl\/LdLk22.+/,
    /.+https:\/\/www.googletagmanager.com\/gtm.js.+/,
    /.+https:\/\/www.google-analytics.com\/analytics.js.+/,
    /.+https:\/\/www.google.com\/recaptcha\/api.js.+/,
  ],
});
