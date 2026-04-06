import React from "react";
import { Link, useLocation } from "react-router-dom";

const PAGE_CONTENT = {
  "/about": { title: "About Us", body: "QuickMart is built for fast, convenient shopping." },
  "/careers": { title: "Careers", body: "We’re always looking for great people to join us." },
  "/blog": { title: "Blog", body: "Updates, product stories, and announcements." },
  "/press": { title: "Press", body: "Media resources and brand information." },
  "/privacy": { title: "Privacy Policy", body: "Your privacy matters. This page describes how we handle data." },
  "/terms": { title: "Terms of Use", body: "These terms govern use of the QuickMart experience." },
  "/cookies": { title: "Cookie Policy", body: "This page explains cookies and similar technologies." },
};

export default function InfoPage() {
  const { pathname } = useLocation();
  const page = PAGE_CONTENT[pathname];

  if (!page) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📄</div>
        <h3>Page not found</h3>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="info-page">
      <div className="info-card">
        <h2>{page.title}</h2>
        <p className="info-muted">{page.body}</p>
        <div className="info-actions">
          <Link to="/" className="btn-outline">Back to store</Link>
        </div>
      </div>
    </div>
  );
}

