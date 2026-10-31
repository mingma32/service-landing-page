import { Check, LockKeyhole } from "lucide-react";
import FlodeskForm from "./FlodeskForm";

export default function CTAForm() {
  return <section id="consultation" className="form-section">
    <div className="form-layout">
      <div className="form-intro">
        <span className="eyebrow">LET’S START WITH YOUR LODGE</span>
        <h2>A little more clarity.<br /><span>A simpler next step.</span></h2>
        <p>Get the free Lodge Money Leak Checklist and explore your free 20-minute demo.</p>
        <ul className="offer-list">
          <li><Check size={18} /> Checklist in English + Nepali</li>
          <li><Check size={18} /> Free 20-minute system demo</li>
          <li><Check size={18} /> Focused on your billing &amp; bookings</li>
        </ul>
        <p className="signup-next-step">After signing up, check your inbox for a confirmation email. Confirm your subscription to receive the kit and follow-up emails.</p>
      </div>
      <div className="lead-form flodesk-card">
        <span className="form-kicker">YOUR FREE CHECKLIST + DEMO</span>
        <h3>Tell us a little about your lodge.</h3>
        <FlodeskForm />
        <p className="privacy"><LockKeyhole size={13} /> We respect your privacy. No spam.</p>
        <p className="signup-consent">Sign up to receive your free kit and follow-up emails from Khumbu Nuru I.T. Services. You can unsubscribe at any time.</p>
      </div>
    </div>
  </section>;
}
