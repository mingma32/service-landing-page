"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeWhatsAppNumber } from "@/lib/phone";
import { SIGNUP_FIELDS } from "@/lib/flodesk-fields";

const FORM_ID = "6ae5c2b4753c3852487971f7";
const CONTAINER_ID = `fd-form-${FORM_ID}`;
const SDK_URL = "https://assets.flodesk.com/universal.js";
export const RECEIPT_KEY = "khumbu-flodesk-confirmed-at";

type FlodeskFunction = ((command: string, options: Record<string, unknown>) => void) & { q?: unknown[][] };
declare global { interface Window { fd?: FlodeskFunction; FlodeskObject?: string; } }
let sdkPromise: Promise<void> | undefined;

function loadSdk(): Promise<void> {
  if (window.fd && !window.fd.q) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    if (!window.fd) {
      const queue = ((...args: unknown[]) => { queue.q?.push(args); }) as FlodeskFunction;
      queue.q = [];
      window.fd = queue;
    }
    window.FlodeskObject = "fd";
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.dataset.flodeskSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); sdkPromise = undefined; reject(new Error("Flodesk could not load.")); };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

// Keep Flodesk's actual fields, mapped names, CSRF token and anti-spam fields.
// Only visible customer fields receive the website's presentation and constraints.
function styleFields(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>(".fd-form-group").forEach(group => {
    if (group.dataset.lodgeField || getComputedStyle(group).display === "none") return;
    const input = group.querySelector<HTMLInputElement>("input:not([type=hidden])");
    const label = group.querySelector<HTMLLabelElement>("label");
    if (!input || !label) return;
    const text = label.innerText.toLowerCase().replace(/[^a-z]/g, "");
    let field = "";
    if (text.includes("email")) field = "email";
    else if (text.includes("whatsapp") || text.includes("phone")) field = "phone";
    else if (text.includes("business")) field = "business";
    else if (text.includes("website") || text.includes("facebook") || text.includes("url")) field = "url";
    else if (text.includes("say") || text.includes("message")) field = "message";
    else if (text.includes("name")) field = "name";
    if (!field) return;
    group.dataset.lodgeField = field;
    const definition = SIGNUP_FIELDS.find(item => item.key === field);
    if (definition) label.textContent = definition.label;
    input.required = field !== "message";
    group.dataset.lodgeRequired = String(input.required);
    const placeholders: Record<string, string> = { name: "Your full name", email: "you@example.com", phone: "+977 98XXXXXXXX", business: "Your lodge or hotel name", url: "https://", message: "Tell us about your billing or booking challenges…" };
    input.placeholder = placeholders[field];
    input.maxLength = 255;
    if (field === "email") { input.type = "email"; input.autocomplete = "email"; }
    if (field === "phone") { input.type = "tel"; input.autocomplete = "tel"; input.inputMode = "tel"; input.removeAttribute("pattern"); }
    if (field === "name") input.autocomplete = "name";
    if (field === "business") input.autocomplete = "organization";
    if (field === "url") input.type = "url";
    if (field === "message") {
      // Flodesk stores custom values as text and serializes its own input controls.
      // A visible textarea mirrors into that mapped input, without changing its name.
      const textarea = document.createElement("textarea");
      textarea.id = `${input.id}-message`;
      textarea.placeholder = placeholders.message;
      textarea.rows = 3;
      textarea.maxLength = input.maxLength;
      textarea.value = input.value;
      textarea.addEventListener("input", () => {
        input.value = textarea.value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      input.type = "hidden";
      label.htmlFor = textarea.id;
      group.appendChild(textarea);
    }
  });
}

// Retain every field from the supplied HTML without inventing backend mappings.
// Native published fields take precedence and automatically replace these on reload.
function restoreMissingFields(container: HTMLElement) {
  const fields = container.querySelector<HTMLElement>('[data-ff-el="fields"]');
  if (!fields) return;
  SIGNUP_FIELDS.forEach(definition => {
    if (fields.querySelector(`[data-lodge-field="${definition.key}"]`)) return;
    const group = document.createElement("div");
    group.className = "fd-form-group";
    group.dataset.flodeskPending = "true";
    const input = document.createElement("input");
    input.id = `${CONTAINER_ID}-pending-${definition.key}`;
    input.className = "fd-form-control";
    input.required = definition.required;
    input.type = "text";
    input.maxLength = 255;
    // No name: Flodesk must never receive an unfinished or invented mapping.
    const label = document.createElement("label");
    label.className = "fd-form-label";
    label.htmlFor = input.id;
    label.textContent = definition.label;
    group.append(input, label);
    const note = document.createElement("p");
    note.className = "flodesk-pending-note";
    note.textContent = definition.required
      ? "This field is temporarily unavailable. Please try again later."
      : "Please leave this optional field blank for now. You can send your message on WhatsApp on the next page.";
    group.appendChild(note);
    fields.appendChild(group);
  });
  styleFields(container);
}

export default function FlodeskForm() {
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    let submitted = false;
    let redirecting = false;
    setState("loading");
    element.replaceChildren();
    element.removeAttribute(`data-ff-${FORM_ID}-rendered`);
    const timeout = window.setTimeout(() => { if (!cancelled) setState("error"); }, 25000);

    const observer = new MutationObserver(() => {
      if (cancelled) return;
      styleFields(element);
      restoreMissingFields(element);
      const root = element.querySelector<HTMLElement>('[data-ff-el="root"]');
      if (root && element.querySelector('[data-ff-el="form"]')) {
        clearTimeout(timeout);
        setState("ready");
      }
      // This stage is set by Flodesk only after its server accepts the signup.
      // Validation failures, HTTP errors and captcha verification never redirect.
      if (submitted && !redirecting && root?.dataset.ffStage === "success") {
        redirecting = true;
        try { sessionStorage.setItem(RECEIPT_KEY, String(Date.now())); } catch { /* Storage is optional. */ }
        window.location.assign("/thank-you");
      }
    });
    observer.observe(element, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-ff-stage"] });

    const validate = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const visible = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-lodge-field] input:not([type=hidden]), [data-lodge-field] textarea"));
      let firstInvalid: HTMLElement | undefined;
      visible.forEach(input => {
        const group = input.closest<HTMLElement>("[data-lodge-field]")!;
        group.querySelector(".lodge-field-error")?.remove();
        input.removeAttribute("aria-describedby");
        input.setAttribute("aria-invalid", "false");
        let message = "";
        if (group.dataset.flodeskPending === "true" && (input.required || input.value.trim())) message = input.required ? "This field is not available yet. Please try again later." : "This optional message cannot be saved yet. Please leave it blank and contact us on WhatsApp.";
        else if (input.required && !input.value.trim()) message = "Please complete this field.";
        else if (group.dataset.lodgeField === "phone") {
          const normalized = normalizeWhatsAppNumber(input.value);
          if (!normalized) message = "Enter a phone number with 7–15 digits, for example +977 9846701009.";
          else if (input.value !== normalized) {
            input.value = normalized;
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
        else if (group.dataset.lodgeField === "name" && input.value.trim().length < 2) message = "Enter your full name.";
        else if (input.value && !input.validity.valid) message = group.dataset.lodgeField === "url" ? "Enter a complete website or Facebook URL starting with https://." : group.dataset.lodgeField === "email" ? "Enter a valid email address." : "Please enter a valid value.";
        if (message) {
          const error = document.createElement("p");
          error.className = "lodge-field-error";
          error.id = `${input.id}-error`;
          error.setAttribute("role", "alert");
          error.textContent = message;
          group.appendChild(error);
          input.setAttribute("aria-invalid", "true");
          input.setAttribute("aria-describedby", error.id);
          firstInvalid ??= input;
        }
      });
      if (firstInvalid) {
        event.preventDefault();
        event.stopImmediatePropagation();
        firstInvalid.focus();
        return;
      }
      submitted = true;
    };
    element.addEventListener("submit", validate, true);

    loadSdk().then(() => {
      if (cancelled) return;
      window.fd?.("form", {
        formId: FORM_ID,
        containerEl: `#${CONTAINER_ID}`,
        callback: (error?: unknown) => { if (error && !cancelled) setState("error"); },
      });
    }).catch(() => { if (!cancelled) setState("error"); });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      observer.disconnect();
      element.removeEventListener("submit", validate, true);
    };
  }, [attempt]);

  return <>
    {state === "loading" && <p className="flodesk-loading" role="status">Loading the secure signup form…</p>}
    {state === "error" && <div className="flodesk-load-error" role="alert"><p>The signup form couldn’t load. Please check your connection and try again.</p><button type="button" className="text-link" onClick={() => setAttempt(value => value + 1)}>Try again</button></div>}
    <div id={CONTAINER_ID} ref={container} className="flodesk-mount" aria-label="Free checklist and demo signup" />
    <noscript><p>Please enable JavaScript to use this signup form.</p></noscript>
  </>;
}
