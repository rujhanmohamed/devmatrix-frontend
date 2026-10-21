"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  "Overview",
  "Orders & products",
  "Resources",
  "Import & validation",
  "Schedule",
  "Run history",
  "What-if scenarios",
  "Exceptions",
  "Version history",
];

export function PlannerShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="planner-shell">
      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`planner-sidebar ${menuOpen ? "planner-sidebar--open" : ""}`} aria-label="Planner navigation">
        <Link className="brand-lockup" href="/planner/overview" onClick={() => setMenuOpen(false)}>
          <span className="brand-lockup__mark" aria-hidden="true">▦</span>
          <span>DevMatrix</span>
        </Link>
        <p className="sidebar-caption">PRODUCTION PLANNING</p>
        <div className="factory-switcher">
          <strong>Demo furniture works</strong>
          <span>Single factory · Asia/Colombo</span>
        </div>
        <p className="sidebar-caption sidebar-caption--workspace">PLANNER WORKSPACE</p>
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isOverview = item === "Overview";
            const isOrders = item === "Orders & products";
            const href = isOverview ? "/planner/overview" : "/planner/orders";
            const active = isOverview
              ? pathname === href
              : isOrders && (pathname.startsWith("/planner/orders") || pathname.startsWith("/planner/products"));

            if (isOverview || isOrders) {
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`sidebar-nav__item ${active ? "sidebar-nav__item--active" : ""}`}
                  href={href}
                  key={item}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              );
            }

            return (
              <span className="sidebar-nav__item sidebar-nav__item--disabled" aria-disabled="true" key={item} title="Not included in this implementation phase">
                {item}
              </span>
            );
          })}
        </nav>
        <div className="sidebar-user">
          <span className="sidebar-user__avatar" aria-hidden="true">NP</span>
          <span><strong>Nadeesha P.</strong><small>Planner</small></span>
        </div>
        <Link className="sidebar-signout" href="/login">Sign out</Link>
      </aside>

      <div className="planner-main">
        <header className="planner-header">
          <button className="menu-toggle" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <span /><span /><span />
          </button>
          <p className="planner-breadcrumb">Workspace <span>/</span> Planner</p>
          <div className="planner-header__actions">
            <time className="header-date" dateTime="2026-10-20">20 OCT 2026</time>
            <div className="updates-control">
              <button className="updates-button" aria-expanded={updatesOpen} onClick={() => setUpdatesOpen(!updatesOpen)}>
                <span className="updates-dot" aria-hidden="true" /> Updates <span className="updates-count">3</span>
              </button>
              {updatesOpen && (
                <div className="updates-popover" role="status">
                  <strong>Recent updates</strong>
                  <p>Candidate v12 is ready to review.</p>
                  <p>One material exception needs attention.</p>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="planner-content">{children}</main>
      </div>
    </div>
  );
}