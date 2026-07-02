"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";

import { cn } from "@/lib/utils";

type ContactFormCopy = {
  title: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
  success: string;
};

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      className="rounded-[12px] border border-border bg-white/88 px-5 py-5 shadow-[0_18px_46px_rgba(0,0,0,0.09)] backdrop-blur-sm md:px-6 md:py-6"
      onSubmit={onSubmit}
    >
      <h2 className="text-[19px] font-extrabold leading-none text-foreground md:text-[20px]">
        {copy.title}
      </h2>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <ContactInput name="firstName" placeholder={copy.firstName} required />
        <ContactInput name="lastName" placeholder={copy.lastName} required />
      </div>

      <div className="mt-2.5 grid gap-2.5">
        <ContactInput name="company" placeholder={copy.company} />
        <ContactInput
          name="email"
          type="email"
          placeholder={copy.email}
          required
        />
        <ContactInput name="phone" type="tel" placeholder={copy.phone} />
        <textarea
          name="message"
          placeholder={copy.message}
          required
          className="min-h-[88px] resize-y rounded-[7px] border border-input bg-white px-3.5 py-3 text-[13px] font-medium leading-[1.45] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-brand/45 focus:shadow-[0_0_0_3px_rgba(227,6,19,0.08)]"
        />
      </div>

      <button
        type="submit"
        className="mt-3 inline-flex h-[44px] w-full items-center justify-between rounded-[7px] bg-brand px-5 text-[14px] font-extrabold text-white shadow-[0_6px_12px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 [transition-timing-function:var(--ease-smooth)]"
      >
        {copy.submit}
        <ArrowUpRight className="size-4" aria-hidden />
      </button>

      {submitted && (
        <p
          className="mt-3 flex items-center gap-2 text-[12px] font-medium leading-none text-foreground"
          aria-live="polite"
        >
          <LockKeyhole className="size-4 text-brand" aria-hidden />
          {copy.success}
        </p>
      )}
    </form>
  );
}

function ContactInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-[40px] rounded-[7px] border border-input bg-white px-3.5 text-[13px] font-medium text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-brand/45 focus:shadow-[0_0_0_3px_rgba(227,6,19,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
