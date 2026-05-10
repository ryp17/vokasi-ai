const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make current path available to all views
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('pages/index', { pageTitle: 'Home | Vokasi.ai' });
});

app.get('/about', (req, res) => {
    res.render('pages/about', { pageTitle: 'About Us | Vokasi.ai' });
});

app.get('/contact', (req, res) => {
    res.render('pages/contact', { pageTitle: 'Contact Us | Vokasi.ai' });
});

app.get('/blog', (req, res) => {
    res.render('pages/blog', { pageTitle: 'Blog | Vokasi' });
});

app.get('/jalur-karir', (req, res) => {
    res.render('pages/jalur-karir', { pageTitle: 'Jalur Karir | Vokasi' });
});

app.get('/kursus-online', (req, res) => {
    res.render('pages/kursus-online', { pageTitle: 'Kursus Online | Vokasi' });
});

app.post('/api/apply', (req, res) => {
    console.log('Received application:', req.body);
    res.json({ success: true, message: 'Application received successfully.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Vokasi.ai server running on http://localhost:${PORT}`);
});
