import "server-only";
import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { env } from "./env";

export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

/* Création d'une instance de arcjet */

export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],

  // define base rules here, can also be empty i you don't want to have any base rules
  rules: [
    shield({
      mode: "DRY_RUN",
    }),
  ],
});
