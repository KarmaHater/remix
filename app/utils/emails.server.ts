import FormData from "form-data";
import Mailgun from "mailgun.js";

if (typeof process.env.MAILGUN_API_KEY !== "string") {
  throw new Error("MAILGUN_API_KEY is not set");
}

const mailgun = new Mailgun(FormData);
const client = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

type Message = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export function sendEmail(message: Message) {
  if (typeof process.env.MAILGUN_DOMAIN !== "string") {
    throw new Error("MAILGUN_DOMAIN is not set");
  }
  return client.messages.create(process.env.MAILGUN_DOMAIN, message);
}
