# Vokasi.ai — Version 4.0 (v4) Release Summary

Version 4.0 of Vokasi.ai focuses on visual modernization, interactive micro-animations, conversion rate optimization (CRO) triggers, and security hardening. Below is the complete technical and architectural overview of the v4 updates.

---

## 1. Visual Modernization & Premium Styling (`style.css` & `affiliate.css`)
We introduced modern typography, glassmorphism card constructs, and keyframe animations to make the user interface feel premium and responsive.
*   **Plus Jakarta Sans Integration**: Standardized global headers and content blocks to use the modern, highly readable *Plus Jakarta Sans* typeface.
*   **Glassmorphic Container Classes**: Established utility styles utilizing backdrop blur, satura, and translucent borders:
    ```css
    .glass-card {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
    }
    ```
*   **Keyframe Animations**: Added fluid transitions and CSS keyframes for floating cards (`float`), shimmering CTAs (`shimmer`), and glowing status badges (`pulse-glow-purple`).

---

## 2. Reading Experience & Blog Layout Refinement (`blog-detail.ejs`)
To improve reading comfort for detailed article content:
*   **Desktop Column Rebalancing**: Re-portioned the blog grid width from `1fr 320px` to a wider `2.5fr 1fr` ratio, dedicating approx `72%` of the desktop layout space to content.
*   **Sticky Scrolling Progress Bar**: Added an interactive progress bar (`#reading-progress`) pinned to the top of the viewport. Script triggers calculate the visitor's reading offset relative to viewport height:
    ```javascript
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + '%';
    ```
*   **Premium Blockquotes**: Restyled blockquote indicators with translucent indigo backgrounds and soft side accent borders.

---

## 3. Gotong Royong Ambassador Gamification (`affiliate-landing.ejs` & `affiliator-dashboard.ejs`)
To encourage growth relational to Indonesian community values (Gotong Royong):
*   **Gotong Royong Impact Calculator**: Created an interactive estimator slider on the landing page showing commission tiers (Rintisan, Terampil, Ahli, Maestro) and live-calculating how many SMKN/Vocational scholarships are funded by their sales.
*   **Shimmering Goal Progress Bar**: Enhanced the community beasiswa tracker with a fluid spring-width transition, glowing drop-shadows, and a scrolling shimmer light beam animation.
*   **Float Hover Stats**: Applied active floating transformations to summary cards on the ambassador dashboard.

---

## 4. Course Detail Page Conversions (`course-detail.ejs`)
Enhanced registration pages to convert passive visitors into course waitlists and enrollments.
*   **Live Certificate Preview Mockup**: Replaced generic illustrations with a beautiful glassmorphic diploma preview.
*   **Real-time Name Input Event Binding**: Linked checkout name fields to the mockup. As a student types their name, it is immediately uppercase-printed on the certificate preview.
*   **Syllabus Accordions**: Converted static course syllabus rows into collapsible accordions with chevrons that rotate on toggle.

---

## 5. Security Audits & Tracking Hardening (`server.js` & `database.js`)
In addition to UI/UX updates, core system security and tracking accuracy were audited and patched:
*   **Sliding 24h Deduplication**: Clicks are tracked via unique client-side UUIDs combined with server-side 24-hour deduplication sliding windows to prevent page-refresh spamming.
*   **Bot & Crawler Filtering**: Added crawler filtering to skip logging referral hits from web search engines, social crawlers, or scraper scripts.
*   **Middleware Authorization Route-Guards**: Restricted `/admin` pages behind a secure `requireAdmin` validation check using `HttpOnly` and `SameSite: Strict` token cookies, and secured payout requests via authenticated session matches.
