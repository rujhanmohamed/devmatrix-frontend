import { DemoLoginForm } from "@/features/auth/demo-login-form";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-brand" aria-label="DevMatrix production planning">
        <a className="login-brand__wordmark" href="/login">
          <span className="brand-lockup__mark" aria-hidden="true">▦</span> DevMatrix
        </a>
        <div className="login-brand__message">
          <h1>Bring clarity<br />to every shift.</h1>
          <p>Plan with confidence. Explore the alternatives.<br className="desktop-break" /> Keep everyone working from one approved plan.</p>
        </div>
        <div className="schedule-motif" aria-label="Example production schedule">
          <p className="schedule-motif__eyebrow">THE NEXT SHIFT, IN VIEW</p>
          <div className="schedule-motif__track schedule-motif__track--cut">Cutting <span>08:00</span></div>
          <div className="schedule-motif__track schedule-motif__track--assembly">Assembly <span>10:00</span></div>
          <div className="schedule-motif__track schedule-motif__track--finish">Finishing <span>14:00</span></div>
          <div className="schedule-motif__axis" aria-hidden="true"><span>08</span><span>10</span><span>12</span><span>14</span><span>16</span></div>
        </div>
        <p className="login-brand__footnote">SMART PRODUCTION PLANNING</p>
      </section>
      <section className="login-panel" aria-label="Sign in">
        <DemoLoginForm />
      </section>
    </main>
  );
}