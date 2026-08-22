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
    <p id={id} role="alert" className="mt-2 text-sm leading-snug text-primary">
      {message}
    </p>
  );
}

function Field({ id, label, type = "text", textarea, error, onClearError, className }) {
  const errorId = `${id}-error`;
  const fieldClass = cn(
    "peer w-full min-h-12 border-b bg-transparent py-3.5 font-sans text-base text-text outline-hidden transition-colors focus:border-text sm:min-h-13 sm:py-4",
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
    <div className={cn("reveal-item relative", className)}>
      {textarea ? (
        <textarea
          {...sharedProps}
          rows={4}
          className={cn(fieldClass, "min-h-28 resize-y sm:min-h-36")}
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
        className="pointer-events-none absolute top-3.5 left-0 max-w-[calc(100%-0.5rem)] origin-left truncate text-faint transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-focus:-translate-y-6 peer-focus:scale-75 sm:top-4"
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
    <fieldset
      className="reveal-item"
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-3.5 max-w-full text-pretty text-[0.95rem] font-medium leading-snug text-text sm:mb-4 sm:text-base md:mb-5 md:text-[1.05rem]">
        {title}
        {required ? <span className="sr-only"> (required)</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "inline-flex min-h-11 max-w-full cursor-pointer items-center rounded-full border px-3 py-2 text-left text-[0.8125rem] leading-snug text-subtle transition-colors has-checked:border-acid has-checked:bg-acid has-checked:text-accent-fg sm:min-h-11 sm:px-3.5 sm:text-sm md:px-4",
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
            <span className="break-words">{option}</span>
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
    <section
      id="contact"
      ref={root}
      className="section-y dock-safe-pb relative overflow-x-clip border-t border-border bg-background"
    >
      <div className="wrap mx-auto w-full max-w-3xl">
        <div className="section-head">
          <p className="reveal-kicker kicker">Contact</p>
          <h2 className="reveal-title display-title max-w-[18ch] text-[clamp(2.35rem,9.5vw,5.75rem)] text-paper sm:max-w-none">
            Ready to bring
            <br />
            your <span className="text-acid">idea</span> to life?
          </h2>
        </div>

        <p className="reveal-item mb-8 flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-2 border-l border-border pl-3.5 sm:mb-10 sm:pl-4 md:mb-12 lg:mb-14">
          <span className="shrink-0 font-condensed text-[0.65rem] uppercase tracking-[0.22em] text-faint sm:tracking-[0.28em]">
            Direct
          </span>
          <a
            href={`mailto:${EMAIL}`}
            className="min-w-0 break-all text-sm text-subtle underline-link transition-colors duration-200 hover:text-soft sm:break-normal"
          >
            {EMAIL}
          </a>
        </p>

        {step === "sent" ? (
          <div className="reveal-item space-y-3 py-2">
            <p className="max-w-prose text-base leading-relaxed text-subtle sm:text-lg md:text-xl">
              Thanks  -  your message was sent. I’ll get back to you soon.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-8 sm:gap-9 md:gap-10"
          >
            <div
              className="absolute-left-[9999px] h-px w-px overflow-hidden opacity-0"
              aria-hidden="true"
            >
              <label htmlFor="botcheck">Leave this empty</label>
              <input
                type="checkbox"
                id="botcheck"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:gap-9 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
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
            </div>

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
              label="Tell me about your project"
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
              title="How did you hear about me? (optional)"
              name="source"
              options={SOURCES}
            />

            <div className="flex flex-col gap-4 pt-1 sm:gap-5 sm:pt-2">
              {step === "verify" || step === "sending" ? (
                <div className="reveal-item space-y-4 rounded-xl border border-border bg-muted/40 p-4 sm:space-y-5 sm:p-5 md:p-6">
                  <p className="text-sm leading-relaxed text-soft">
                    One last step  -  complete the verification below to send your message and help
                    prevent spam.
                  </p>
                  {step === "verify" ? (
                    <div className="max-w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
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
                    </div>
                  ) : (
                    <p className="text-sm text-faint">Sending your message…</p>
                  )}
                  {step === "verify" ? (
                    <button
                      type="button"
                      onClick={resetToForm}
                      className="inline-flex min-h-11 w-fit items-center text-sm text-faint underline-offset-4 hover:underline"
                    >
                      Go back and edit
                    </button>
                  ) : null}
                </div>
              ) : (
                <button
                  type="submit"
                  className="reveal-item inline-flex h-12 w-full min-w-44 items-center justify-center rounded-full bg-acid px-8 text-sm font-medium tracking-wide text-accent-fg uppercase sm:h-13 sm:w-auto sm:min-w-48"
                >
                  submit
                </button>
              )}

              {error ? (
                <p className="text-sm leading-snug text-primary" role="alert">
                  {error}
                </p>
              ) : null}

              <p className="max-w-prose text-xs leading-relaxed text-faint">
                By submitting this form you accept my Privacy Policy. Messages are protected by spam
                filtering and human verification.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
