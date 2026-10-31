"use client";
import { useEffect, useState } from "react";
import { RECEIPT_KEY } from "./FlodeskForm";

export default function ThankYouStatus() {
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    try {
      const timestamp = Number(sessionStorage.getItem(RECEIPT_KEY));
      const age = Date.now() - timestamp;
      setAccepted(timestamp > 0 && age >= 0 && age < 15 * 60 * 1000);
    } catch { /* Show neutral next steps when storage is unavailable. */ }
  }, []);
  return <>
    <div className="confirmation-banner" role="status">
      <strong>{accepted ? "Your signup was received. Check your email to continue." : "Check your email for your next step."}</strong>
      <span>If you receive a confirmation email, click its link to confirm your subscription. Your free kit and follow-up emails will follow your subscription settings.</span>
      <span>Can’t find it? Check Spam, Junk or Promotions, or message us below.</span>
    </div>
  </>;
}
