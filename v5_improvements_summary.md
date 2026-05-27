# Vokasi.ai — Version 5.0 (v5) Release Summary

Version 5.0 of Vokasi.ai focuses on enhancing user education, transparent pricing architectures, and conversion-focused multi-page interactive sections. Below is the complete technical and architectural overview of the v5 updates.

---

## 1. Unified "Cara Kerja" (How It Works) Page Upgrades
To address student decision-making paths between self-paced courses and career tracks:
*   **Rearranged Content Order**: Restructured the layout to place the learning path comparison in the optimal conversion position: directly following *"Kurikulum yang Terus Berkembang"* and before *"Pilih Jalur Belajarmu"*.
*   **Interactive Pathways Comparison**: Blended Kursus Online and Jalur Karir information side-by-side using high-contrast, responsive flex designs.
*   **Closure Contact Section**: Appended a soft-blue colored call-out box (`rgba(59, 130, 246, 0.03)`) at the page bottom. It acts as a friendly consultation handoff, prompting undecided users to contact support via a high-visibility CTA linking to `/contact`.

---

## 2. Homepage Scholarship CTA Overhaul
To match Vokasi's newly introduced scholarship model:
*   **Emerald Theme Accents**: Replaced general orange styling with the premium emerald green accent (`#10B981`) to align with the Founder Tier visual branding.
*   **Urgency & Value Copy**: Overhauled the promo banner to highlight the **$1 (Rp 16.000) Founder Tier** pricing and the automatic price increase mechanism.
*   **Slot Counter Sync**: Implemented a progress bar matching the pathway registration numbers, reading `"2 kursi terambil / 998 kursi tersisa"`.
*   **Direct Pathing**: Configured the primary button to route visitors to the specific checkout target: `/jalur-karir#klaim`.

---

## 3. Online Courses Self-Paced Showcase
*   **Three-Step Checklist Grid**: Built a responsive step breakdown on `kursus-online.ejs` to detail the self-study loop:
    1.  **Akses Instan Modul**: Unlocking standard video lessons and project files immediately.
    2.  **AI Tutor 24/7**: Direct interactive code and theory support inside the learning dashboard.
    3.  **Kuis & Sertifikat**: Formal verification checklists at the end of each module.

---

## 4. Career Pathways Hybrid Schedule Timetable
To clearly explain the hybrid model of Jalur Karir (independent study + 3x/week online mentoring):
*   **Interactive Timetable Grid**: Created a 6-day responsive grid (Monday–Saturday) showing "Mentoring" vs "Mandiri" days.
*   **Dynamic Schedule Details Card**: Interactive JavaScript handlers dynamically display tasks and Zoom details for the selected day with smooth opacity animation transitions.
*   **Mobile Columns Responsive Override**: Programmed media queries that scale the day grids from a `6-column` layout down to a clean `3-column` layout on mobile screens (< 600px).

---

## 5. Gamified Scholarship Pricing Dashboard
Redesigned the scholarship pricing tier section into a premium, interactive checkout helper:
*   **Split Layout Screen**: Replaced the dry 10-box grid with a 1.1fr / 0.9fr dashboard layout.
*   **Dynamic Offer Hero (Left)**: Showcases the current active tier ($1 / Rp 16.000), real-world value saving calculations (compared to standard Rp 8.000.000+ bootcamps), and an active claimed slots indicator.
*   **Timeline Progress Grid (Right)**: Packs all 10 pricing steps in a clean 2-column grid. Active tiers glow emerald green, while locked tiers are styled with padlocks.
*   **Interactive Event Mapping**: Tapping any locked tier card updates an notification toast displaying its corresponding price in Rupiah and clarifying how to unlock it.
