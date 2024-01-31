import { json } from "@remix-run/node";
import Cryptr from "cryptr";

if (typeof process.env.MAGIC_LINK_SECRET !== "string") {
  throw new Error("MAGIC_LINK_SECRET environment variable is not set");
}

const cryptr = new Cryptr(process.env.MAGIC_LINK_SECRET);

type MagicLinkPayload = {
  email: string;
  nonce: string;
  createdAt: string;
};

export function generateMagicLink(email: string, nonce: string) {
  const payload: MagicLinkPayload = {
    email,
    nonce,
    createdAt: new Date().toISOString(),
  };

  const encryptedPayload = cryptr.encrypt(JSON.stringify(payload));

  if (typeof process.env.ORIGIN !== "string") {
    throw new Error("ORIGIN environment variable is not set");
  }

  const url = new URL(process.env.ORIGIN);
  url.pathname = "/validate-magic-link";
  url.searchParams.set("magic", encryptedPayload);

  return url.toString();
}

export function invalidMagicLink(message: string) {
  return json({ error: message }, { status: 400 });
}

export function isMagicLinkPayload(value: any): value is MagicLinkPayload {
  return (
    typeof value === "object" &&
    typeof value.email === "string" &&
    typeof value.nonce === "string" &&
    typeof value.createdAt === "string"
  );
}

export function getMagicLinkPayload(request: any) {
  const url = new URL(request.url);
  const magic = url.searchParams.get("magic");

  if (typeof magic !== "string") {
    throw invalidMagicLink("Magic search parameter does nto exist link");
  }

  const magicLinkPayload = JSON.parse(cryptr.decrypt(magic));

  if (!isMagicLinkPayload(magicLinkPayload)) {
    throw invalidMagicLink("Invalid magic link");
  }

  return magicLinkPayload;
}
