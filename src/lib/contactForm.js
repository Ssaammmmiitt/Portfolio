const STORAGE_KEY = "portfolio_contact_submitted_at";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "99fd4e1d-3711-493e-9c9e-fe0896198b94";

/** Web3Forms free-plan hCaptcha site key */
export const HCAPTCHA_SITE_KEY =
  import.meta.env.VITE_HCAPTCHA_SITE_KEY || "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

export function canSubmitContactForm() {
  if (typeof window === "undefined") return true;

  const last = localStorage.getItem(STORAGE_KEY);
  if (!last) return true;

  return Date.now() - Number(last) > COOLDOWN_MS;
}

export function getContactCooldownRemainingMs() {
  if (typeof window === "undefined") return 0;

  const last = localStorage.getItem(STORAGE_KEY);
  if (!last) return 0;

  const remaining = COOLDOWN_MS - (Date.now() - Number(last));
  return Math.max(0, remaining);
}

export function markContactFormSubmitted() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

export function formatCooldown(ms) {
  const hours = Math.ceil(ms / (60 * 60 * 1000));
  return hours <= 1 ? "about an hour" : `${hours} hours`;
}

export async function submitContactForm(payload, hcaptchaToken) {
  if (!WEB3FORMS_ACCESS_KEY) {
    throw new Error("Contact form is not configured. Missing Web3Forms access key.");
  }

  if (!hcaptchaToken) {
    throw new Error("Please complete the verification challenge.");
  }

  const formData = new FormData();
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  formData.append("subject", `Portfolio inquiry from ${payload.name}`);
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("message", payload.project);
  formData.append("budget", payload.budget);
  formData.append("source", payload.source || "Not specified");
  formData.append("botcheck", "");
  formData.append("h-captcha-response", hcaptchaToken);

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to send your message. Please try again.");
  }

  return data;
}
