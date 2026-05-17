# Vokasi.ai — Version 3.0 (v3) Release Summary

Version 3.0 of Vokasi.ai marks a major evolutionary step from a static-page informational site (v1 & v2) into a **dynamic, database-driven, and highly-scalable E-learning platform**. Below is the complete technical and architectural overview of all v3 improvements, routes, and layout additions.

---

## 1. Dynamic Routing & Mock Database Architecture (`server.js`)
We transitioned hardcoded routes into scalable, parameter-driven dynamic endpoints. A structured local mock database (`courseData`) was established to store rich course structures.

```javascript
// Example of the v3 dynamic routing patterns in server.js
app.get('/kursus/:slug', (req, res) => {
    const course = courseData[req.params.slug];
    if (!course) {
        return res.status(404).send('<h1>Kursus tidak ditemukan</h1>');
    }
    res.render('pages/course-detail', { pageTitle: `${course.title} | Vokasi.ai`, course: course, slug: req.params.slug });
});
```

### Mock Database Schema (`courseData` in `server.js`)
Every course object is populated with the following fields:
*   `title` (String): Full course name.
*   `isComingSoon` (Boolean): Determines whether to display prices or "Coming Soon" badges.
*   `category` (String): Grouping tag (e.g., Marketing, Technology, Product).
*   `description` (String): Engaging copy describing what the student will learn.
*   `price` / `originalPrice` (String): For active courses.
*   `syllabus` (Array of Objects): Detailed structured syllabus blocks with `title` and `desc`.

---

## 2. Brand New Pages & Dynamic Templates

### 🌟 A. Dynamic Course Detail Page (`views/pages/course-detail.ejs`)
*   **Hero Grid:** Elegant, containerized grid displaying the category badge, title, course description, price structure, and a premium "Register Now" card.
*   **Interactive Syllabus Accordion:** Fully responsive list displaying the curriculum module-by-module.
*   **Floating Mobile Action Bar:** On small viewports, a sticky checkout/register bar floats at the bottom, so users can buy/enroll instantly without scrolling up.

### 🌟 B. Dynamic Blog Detail Page (`views/pages/blog-detail.ejs`)
*   **Slug-based Routing:** `/blog/:slug` matches articles seamlessly.
*   **Article Layout:** Standardized margins, high-quality feature image wrappers, structured author profiles, and readable typography (Outfit / Inter) optimized for content digestion.

### 🌟 C. Cara Kerja (How It Works) Page (`views/pages/cara-kerja.ejs`)
*   **Timeline Layout:** A beautiful, responsive step-by-step visual timeline showing the student's journey:
    1. Pilih Program ➔ 2. Belajar Bersama Mentor ➔ 3. Selesaikan Proyek Nyata ➔ 4. Akselerasi Karir.
*   **Micro-animations:** Hover transitions on card steps.

### 🌟 D. Onboarding & Registration (`views/pages/daftar.ejs`)
*   **Registration Portal:** Clean onboarding template featuring split layouts (vibrant accent block on the left with trust markers, clean credentials form on the right).
*   **Validation States:** Styling patterns for form control focus and error displays.

---

## 3. Dynamic Lead Storage & Backend Logic
We enhanced forms across the platform to be fully functional rather than static placeholders.
*   **Data Persistence:** Form submissions (e.g. from `/contact` or `/daftar`) target the `/api/apply` endpoint.
*   **Local File DB:** Submissions are written dynamically to a local JSON file (`leads.json`) in the workspace, ensuring no lead is lost even without an external database configured.

```javascript
const fs = require('fs');
app.post('/api/apply', (req, res) => {
    const dbPath = path.join(__dirname, 'leads.json');
    let leads = [];
    if (fs.existsSync(dbPath)) {
        leads = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    const newLead = { ...req.body, timestamp: new Date().toISOString() };
    leads.push(newLead);
    fs.writeFileSync(dbPath, JSON.stringify(leads, null, 2));
    res.json({ success: true, message: 'Application received successfully.' });
});
```

---

## 4. Frontend Spacing, Scope Protection, and Cleanups
*   **Scope Isolation (Footer Scripts):** All global scripts (Accordin, mobile nav toggle, toast systems, and AJAX handlers) were enclosed inside an **IIFE (Immediately Invoked Function Expression)** to prevent variable collision and memory leaks.
*   **Global Styling (`style.css`):**
    *   Added styles for accordion headers, timeline vectors, dynamic tags, and mobile action bars.
    *   Tighter grid alignments and clean spacing definitions.
*   **Active Nav & Footer Consistency:** Universal branding aligned to `"Vokasi.ai"`.

---

## 🚀 How to Run and Explore v3 Features
1. Run `npm install` to ensure EJS, Express, and any core dependencies are ready.
2. Launch with `npm start` (or `node server.js`).
3. Visit the new pages locally:
   *   Home: `http://localhost:3000/`
   *   How It Works: `http://localhost:3000/cara-kerja`
   *   Registration: `http://localhost:3000/daftar`
   *   Online Marketing Fundamental: `http://localhost:3000/kursus/online-marketing-fundamental`
   *   Social Media Fundamental: `http://localhost:3000/kursus/social-media-fundamental`
   *   Blog Detail: `http://localhost:3000/blog/panduan-memilih-bootcamp` (Dynamic slug layout)
