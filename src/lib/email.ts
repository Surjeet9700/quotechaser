import { Resend } from "resend";

export function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing in environment variables.");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export function getFromEmail() {
  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL is missing in environment variables.");
  }
  return process.env.RESEND_FROM_EMAIL;
}
