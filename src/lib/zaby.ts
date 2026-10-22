import { Zaby, configureZaby } from "@zaby-ai/sdk";

export const ZABY_DEFAULT_API_ORIGIN = process.env.ZABY_BASE_URL || process.env.ZABY_API_ORIGIN || "https://genapi.zaby.io";

export function getZabyServerConfig() {
  const apiKey = process.env.ZABY_API_KEY?.trim();
  const apiOrigin = ZABY_DEFAULT_API_ORIGIN.replace(/\/+$/, "");
  const externalAppId = process.env.ZABY_EXTERNAL_APP_ID?.trim();
  const deploymentId = process.env.ZABY_AGENT_DEPLOYMENT_ID?.trim();

  return {
    apiKey,
    apiOrigin,
    externalAppId,
    deploymentId,
    isConfigured: Boolean(apiKey && externalAppId && deploymentId),
  };
}

export function getZabyServerClient() {
  const { apiKey, apiOrigin } = getZabyServerConfig();
  if (!apiKey) return null;

  configureZaby({ apiOrigin });
  return new Zaby({
    apiKey,
    config: { apiOrigin },
  });
}
