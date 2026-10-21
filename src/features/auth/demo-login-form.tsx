"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { signInToDemoWorkspace } from "@/services/mock-auth-service";

export function DemoLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid work email.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters for the demo password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await signInToDemoWorkspace();
      router.push("/planner/overview");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__intro">
        <span className="demo-label">DEMO WORKSPACE</span>
        <h2>Welcome back</h2>
        <p>Sign in with your factory account.</p>
      </div>
      <TextField
        autoComplete="username"
        error={errors.email}
        label="Work email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="name@factory.com"
        required
        type="email"
        value={email}
      />
      <TextField
        autoComplete="current-password"
        error={errors.password}
        label="Password"
        minLength={8}
        name="password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter your password"
        required
        type="password"
        value={password}
      />
      <p className="login-form__note">Your workspace follows your assigned permissions.</p>
      <Button className="login-form__submit" disabled={submitting} type="submit">
        {submitting ? "Opening demo workspace…" : "Enter demo workspace"}
      </Button>
      <p className="login-form__help">This is a frontend demo. Any valid email and an 8-character password will continue.</p>
    </form>
  );
}