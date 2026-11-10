# 🎯 UniRewards — Earn & Redeem Platform

> A modern, gamified rewards platform where university students earn points through challenges, collect virtual stickers, scratch digital cards, and redeem real rewards like cashback, vouchers, and gadgets.

🌐 **Live Demo:** [https://unirewards.netlify.app/](https://unirewards.netlify.app/)

---

## 🌟 Overview

**UniRewards** is a full-featured, single-page-per-screen web application designed to engage students with gamification. Users sign up, complete challenges (surveys, social media tasks, referrals), unlock achievements, and redeem points for genuine rewards — cashback via UPI, Amazon vouchers, and physical products.

The entire experience is **client-side** — no backend required — using `localStorage` to persist user state (KYC status, claimed rewards, collected stickers, customised profile) across sessions.

---

## ✨ Key Features

### 🎮 Gamified Experience
- **Multi-step registration** with progress bar, interests selection, and phone OTP verification
- **Active challenges carousel** — Easy / Medium / Hard tiers with point values
- **Daily check-in streak** — bonus points for consecutive activity
- **Real-time leaderboard** — top 5 earners with avatar + rank badge

### 🎫 Interactive Scratch Cards
- **Canvas-based scratch mechanic** — drag/hold with mouse or finger to reveal
- Metallic realistic cover with `front_hand` hint, auto-reveals at 55% scratched
- 3 tiers on dashboard (Bronze/Silver/Gold) + 6 tiers on dedicated page (up to Legendary ₹1000)
- Win persistence via `localStorage`

### 🏆 Sticker Album (Physical Style)
- **Paper-textured album sheet** with binder holes — feels like a real sticker book
- Collected stickers are randomly tilted (`-4°` to `+4°`) and pasted with corner stamps
- Empty slots show dashed outlines with `?` placeholders — like a peel-off sheet
- **"Peel & stick" reveal animation** on collect + **sparkle particle burst**
- Live progress bar, milestone counter, and album-completion bonus

### 💰 Real Rewards
- Cashback (UPI transfer), Amazon Pay vouchers, Bluetooth Speaker, Bicycle
- Rewards gated by KYC status
- Claimed rewards history page with `localStorage` persistence

### 🔐 KYC Verification
- **Drag-and-drop document upload** (Aadhaar front/back + PAN)
- Live file preview with remove & replace
- **Progress pill** ("2 of 3 documents uploaded") that turns green when complete
- OTP verification via SMS-style timer
- 3-step success timeline: Submitted → Review → Verified

### 👤 Profile Management
- **Editable profile** — inline pencil icons for name + email
- **Avatar upload** with camera overlay hover effect
- **Gradient profile hero card** with verified badges
- **Danger zone** — Download my data (JSON export) + Delete account

### 🎨 Modern UI/UX
- GSAP scroll-triggered animations (hero fade-in, section reveals, counters)
- Slick carousels for challenges & testimonials with autoplay
- Toast notification system with Material Symbol icons
- Fully responsive (mobile-first)
- Custom Tailwind design tokens + SCSS variables

### 📄 Supporting Pages
- **FAQ** — collapsible Q&A with smooth animations
- **Help Center** — quick links + categorized troubleshooting
- **Contact Us** — form with success feedback
- **Terms & Conditions**, **Privacy Policy**
- **Custom 404** — branded fallback page
- **My Rewards** — history of claimed rewards

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Structure** | HTML5 |
| **Styling** | Tailwind CSS (CDN) + SCSS (compiled to CSS) |
| **Scripting** | Vanilla JavaScript (ES6+) |
| **Animations** | GSAP 3.12 + ScrollTrigger |
| **Slider** | jQuery + Slick Carousel |
| **Icons** | Bootstrap Icons + Google Material Symbols + Font Awesome |
| **Fonts** | Inter (body) + York Grot (headings) |
| **Storage** | `localStorage` (state persistence) |
| **Hosting** | Netlify |

---

## 📁 Project Structure
