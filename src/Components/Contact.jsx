import { useCallback, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { BUDGETS, CONTACT_TOPICS, EMAIL, SOURCES } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import {
  canSubmitContactForm,
  formatCooldown,
  getContactCooldownRemainingMs,
  HCAPTCHA_SITE_KEY,
  markContactFormSubmitted,
  submitContactForm,
} from "../lib/contactForm.js";
import { validateContactForm } from "../lib/contactValidation.js";
import { cn } from "../lib/utils.js";

function FieldError({ id, message }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-2 text-sm text-primary">
      {message}
    </p>
  );
}

function Field({ id, label, type = "text", textarea, error, onClearError }) {
  const errorId = `${id}-error`;
  const fieldClass = cn(
    "peer w-full min-h-12 border-b bg-transparent py-3.5 font-sans text-base text-text outline-hidden transition-colors focus:border-text",
    error ? "border-primary" : "border-border-strong"
  );

  const sharedProps = {
    id,
    name: id,
    placeholder: " ",
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onChange: () => onClearError?.(id),
  };

  return (
    <div className="reveal-item relative mb-8 sm:mb-10">
      {textarea ? (
        <textarea
          {...sharedProps}
          rows={3}
          className={cn(fieldClass, "resize-none")}
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          className={fieldClass}
          autoComplete={type === "email" ? "email" : "name"}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-3.5 left-0 origin-left text-faint transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-focus:-translate-y-6 peer-focus:scale-75"
      >
        {label}
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function ChoiceGroup({ title, name, options, required, error, onClearError }) {
  const errorId = `${name}-error`;

  return (
    <fieldset className="reveal-item mb-8 sm:mb-10" aria-describedby={error ? errorId : undefined}>
      <legend className="mb-4 text-base font-medium text-text sm:mb-5 sm:text-[1.05rem]">
        {title}
        {required ? <span className="sr-only"> (required)</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-3.5 py-2 text-sm text-subtle transition-colors has-checked:border-acid has-checked:bg-acid has-checked:text-accent-fg sm:px-4",
              error ? "border-primary/60" : "border-border-strong"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              className="sr-only"
              onChange={() => onClearError?.(name)}
            />
            {option}
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

function getFormValues(form) {
  const data = new FormData(form);

  return {
    name: String(data.get("name") || "").trim(),
    email: String(data.get("email") || "").trim(),
    topic: String(data.get("topic") || "").trim(),
    project: String(data.get("project") || "").trim(),
    budget: String(data.get("budget") || "").trim(),
    source: String(data.get("source") || "").trim(),
    botcheck: data.get("botcheck") === "on",
  };
}

export default function Contact({ ready }) {
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);
  const root = useRef(null);
  const pendingPayload = useRef(null);
  const isSendingRef = useRef(false);
  const captchaRef = useRef(null);

  useReveal(root, ready);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const resetToForm = useCallback(() => {
    isSendingRef.current = false;
    setStep("form");
    setError("");
    setFieldErrors({});
    pendingPayload.current = null;
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    const values = getFormValues(formRef.current);
    const validation = validateContactForm(values, { topics: CONTACT_TOPICS });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setError("Please fix the highlighted fields before continuing.");

      const firstInvalidId = ["name", "email", "topic", "project", "budget"].find(
        (field) => validation.errors[field]
      );
      if (firstInvalidId) {
        formRef.current?.querySelector(`#${firstInvalidId}`)?.focus();
      }
      return;
    }

    setFieldErrors({});

    if (values.botcheck) {
      setStep("sent");
      return;
    }

    if (!canSubmitContactForm()) {
      const remaining = getContactCooldownRemainingMs();
      setError(`You already sent a message recently. Please wait ${formatCooldown(remaining)} before submitting again.`);
      return;
    }

    pendingPayload.current = values;
    setStep("verify");
  };

  const onVerified = useCallback(async (token) => {
    if (!pendingPayload.current || isSendingRef.current) return;

    isSendingRef.current = true;
    setStep("sending");
    setError("");

    try {
      await submitContactForm(pendingPayload.current, token);
      markContactFormSubmitted();
      pendingPayload.current = null;
      setStep("sent");
    } catch (err) {
      isSendingRef.current = false;
      captchaRef.current?.resetCaptcha();
      setError(err.message || "Something went wrong. Please try again.");
      setStep("verify");
    }
  }, []);

  const onCaptchaError = useCallback(() => {
    setError("Verification failed. Please try again.");
  }, []);

  return (
    <section id="contact" ref={root} className="section-y relative overflow-x-clip border-t border-border bg-background">
      <div className="wrap max-w-3xl">
          <p className="reveal-kicker kicker">Contact</p>
          <h2 className="reveal-title display-title mb-6 text-[clamp(2.6rem,9vw,6.2rem)] text-paper md:mb-8">
            Ready to bring
            <br />
            your <span className="text-acid">idea</span> to life?
          </h2>

          <p className="reveal-item mb-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l border-border pl-4 md:mb-12">
            <span className="font-condensed text-[0.65rem] uppercase tracking-[0.28em] text-faint">
              Direct
            </span>
            <a
              href={`mailto:${EMAIL}`}
              className="text-sm text-subtle underline-link transition-colors duration-200 hover:text-soft"
            >
              {EMAIL}
            </a>
          </p>

          {step === "sent" ? (
            <div className="reveal-item space-y-3">
              <p className="text-lg text-subtle sm:text-xl">Thanks  -  your message was sent. I’ll get back to you soon.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate>
              <div
                className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
                aria-hidden="true"
              >
                <label htmlFor="botcheck">Leave this empty</label>
                <input type="checkbox" id="botcheck" name="botcheck" tabIndex={-1} autoComplete="off" />
              </div>

              <Field
                id="name"
                label="Your name"
                error={fieldErrors.name}
                onClearError={clearFieldError}
              />
              <Field
                id="email"
                label="Your email"
                type="email"
                error={fieldErrors.email}
                onClearError={clearFieldError}
              />
              <ChoiceGroup
                title="What would you like to discuss?"
                name="topic"
                options={CONTACT_TOPICS}
                required
                error={fieldErrors.topic}
                onClearError={clearFieldError}
              />
              <Field
                id="project"
                label="Tell us about your project"
                textarea
                error={fieldErrors.project}
                onClearError={clearFieldError}
              />
              <ChoiceGroup
                title="What is your budget for this project?"
                name="budget"
                options={BUDGETS}
                required
                error={fieldErrors.budget}
                onClearError={clearFieldError}
              />
              <ChoiceGroup
                title="How did you hear about us? (optional)"
                name="source"
                options={SOURCES}
              />

              {step === "verify" || step === "sending" ? (
                <div className="reveal-item mt-2 space-y-4 rounded-xl border border-border bg-muted/40 p-5 sm:p-6">
                  <p className="text-sm text-soft">
                    One last step  -  complete the verification below to send your message and help prevent spam.
                  </p>
                  {step === "verify" ? (
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={HCAPTCHA_SITE_KEY}
                      reCaptchaCompat={false}
                      onVerify={onVerified}
                      onError={onCaptchaError}
                      onExpire={() => {
                        captchaRef.current?.resetCaptcha();
                        setError("Verification expired. Please try again.");
                      }}
                    />
                  ) : (
                    <p className="text-sm text-faint">Sending your message…</p>
                  )}
                  {step === "verify" ? (
                    <button
                      type="button"
                      onClick={resetToForm}
                      className="text-sm text-faint underline-offset-4 hover:underline"
                    >
                      Go back and edit
                    </button>
                  ) : null}
                </div>
              ) : (
                <button
                  type="submit"
                  className="reveal-item mt-2 inline-flex h-12 w-full min-w-44 items-center justify-center rounded-full bg-acid px-8 text-sm font-medium tracking-wide text-accent-fg uppercase sm:w-auto"
                >
                  submit
                </button>
              )}

              {error ? (
                <p className="mt-4 text-sm text-primary" role="alert">
                  {error}
                </p>
              ) : null}

              <p className="mt-5 text-xs text-faint">
                By submitting this form you accept our Privacy Policy. Messages are protected by spam filtering and human verification.
              </p>
            </form>
          )}
      </div>
    </section>
  );
}
