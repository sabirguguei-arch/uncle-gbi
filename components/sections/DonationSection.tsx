"use client";

import { FormEvent, useState } from "react";
import { Leaf } from "@/components/ui/Icon";

const minimumAmount = 1;
const maximumAmount = 10_000;
const PAYPAL_DONATION_URL = "";

function validateAmount(value: string) {
  const amount = Number(value);

  if (!value.trim() || !Number.isFinite(amount)) return "Enter a valid contribution amount.";
  if (amount < minimumAmount) return "Enter a positive contribution amount.";
  if (amount > maximumAmount) return "Enter a smaller contribution amount.";
  return "";
}

function HeartIcon() {
  return <svg aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24"><path d="M20.8 8.8c0 5.1-8.8 10.1-8.8 10.1S3.2 13.9 3.2 8.8A4.4 4.4 0 0 1 11 5.9l1 1 1-1a4.4 4.4 0 0 1 7.8 2.9Z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function ShieldIcon() {
  return <svg aria-hidden="true" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24"><path d="M12 3.5 19 6v5.2c0 4.4-2.9 7.7-7 9.3-4.1-1.6-7-4.9-7-9.3V6l7-2.5Z" strokeLinecap="round" strokeLinejoin="round"/><path d="m9.2 12 1.8 1.8 3.8-4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function PayPalMark() {
  return <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24"><path d="M7.1 20.2 9.8 4.8h5.3c2.5 0 4.2 1.4 3.8 3.7-.4 2.4-2.2 3.8-4.8 3.8h-2.4l-.8 4.5H7.1Z" fill="#0070ba"/><path d="m9.6 17.1.6-3.3h2.8c3.6 0 5.8-1.8 6.5-4.7.7.8.9 1.8.7 3-.4 2.5-2.3 4-5 4h-2.5l-.5 3H9.6Z" fill="#003087"/></svg>;
}

export function DonationSection() {
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const updateCustomAmount = (value: string) => {
    setCustomAmount(value);
    setError(validateAmount(value));
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amountError = validateAmount(customAmount);

    setError(amountError);
    if (amountError) {
      setMessage("");
      return;
    }

    if (!PAYPAL_DONATION_URL) {
      setMessage("Online donations are not available yet. Please check back soon.");
      return;
    }

    window.location.assign(PAYPAL_DONATION_URL);
  };

  return (
    <section id="donation" aria-labelledby="donation-heading" className="overflow-hidden bg-[#113e31] px-5 py-20 text-white sm:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-16">
        <div className="relative">
          <div aria-hidden="true" className="gbi-float absolute -left-20 -top-24 h-56 w-56 rounded-full border border-white/10"/>
          <div className="relative">
            <p className="gbi-eyebrow flex items-center gap-3 text-[#f5e6bd]"><span className="h-px w-8 bg-[#d5a53e]"/>MAKE A DIFFERENCE LOCALLY</p>
            <div className="mt-5 flex items-start gap-4">
              <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d5a53e]/60 bg-[#d5a53e]/10 text-[#f5e6bd]"><HeartIcon /></span>
              <h2 id="donation-heading" className="font-display max-w-xl text-4xl leading-[1.06] tracking-[-.035em] text-[#f7f5ee] sm:text-5xl">Help communities build a greener, more resilient South Sudan.</h2>
            </div>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/75">A donation is one practical way to stand with communities working toward a healthier, more resilient future. Your support can help keep locally led environmental conservation, tree planting, sustainable agriculture and community resilience work moving forward.</p>
            <ul className="mt-7 grid max-w-xl gap-3 text-sm text-white/85 sm:grid-cols-2">
              {['Environmental conservation', 'Tree planting', 'Sustainable agriculture', 'Community resilience'].map(item => <li key={item} className="flex items-center gap-2"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#d5a53e]"/>{item}</li>)}
            </ul>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-[#f5e6bd] [&>svg]:h-5 [&>svg]:w-5"><Leaf /><span>Rooted in environmental care</span></div>
          </div>
        </div>

        <form aria-describedby="donation-note" className="rounded-2xl border border-white/15 bg-[#f7f5ee] p-6 text-[#17342a] shadow-[0_18px_50px_rgba(0,0,0,.16)] sm:p-8 lg:p-9" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="text-lg font-bold tracking-[-.01em]">Choose your contribution</legend>
            <p className="mt-1 text-sm leading-6 text-[#536b61]">Enter the contribution you would like to make.</p>
          </fieldset>

          <div className="mt-6">
            <label className="text-sm font-bold" htmlFor="custom-donation-amount">Contribution amount</label>
            <div className="mt-2 flex items-center rounded-lg border border-[#b9c2b8] bg-white focus-within:ring-2 focus-within:ring-[#d5a53e]">
              <input aria-describedby={error ? "donation-amount-error" : undefined} aria-invalid={!!error} className="min-h-12 w-full bg-transparent px-4 text-[#17342a] outline-none" id="custom-donation-amount" inputMode="decimal" min={minimumAmount} max={maximumAmount} onChange={event => updateCustomAmount(event.target.value)} placeholder="Enter a contribution" step="0.01" type="number" value={customAmount}/>
            </div>
            {error && <p className="mt-2 text-sm font-semibold text-red-800" id="donation-amount-error" role="alert">{error}</p>}
          </div>

          <button aria-label="Donate with PayPal" className="mt-7 inline-flex h-12 w-full max-w-[170px] items-center justify-center gap-2 rounded-full bg-[#ffc439] px-5 text-base font-bold text-[#17342a] shadow-sm transition-colors hover:bg-[#ffcf5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17342a]" type="submit"><PayPalMark /><span>Donate</span></button>
          <p aria-live="polite" className="mt-4 flex min-h-6 items-start gap-2 text-sm leading-6 text-[#536b61]" id="donation-note"><ShieldIcon /><span>{message || "Online donations are not available yet. Please check back soon."}</span></p>
        </form>
      </div>
    </section>
  );
}
