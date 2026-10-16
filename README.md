# 🚀 Creative & Professional Engineering Portfolio Website

A modern, responsive, visually stunning personal portfolio website built with **HTML5, CSS3, and Vanilla JavaScript**. Designed for engineering students, developers, and tech professionals to showcase academic performance, projects, technical proficiencies, certificates, achievements, and professional interests.

![Portfolio Preview Banner](assets/images/project-1.jpg)

---

## 🌟 Key Highlights & Design Identity

- **Design System**: Rich dark theme base (`#101126`), modern gradients (purple-to-blue, cyan-to-blue, pink-to-purple), subtle glassmorphism (`backdrop-filter: blur`), floating ambient particle canvas, and interactive hover glow effects.
- **Light & Dark Mode**: One-click theme switcher with smooth variable transitions and `localStorage` persistence.
- **Modular Sections**:
  1. **Sticky Glass Navigation Bar** with smooth scrolling, active section tracking, theme switcher, and mobile hamburger drawer.
  2. **Hero / Introduction** with availability beacon, dynamic headline, floating skill badges, CTA buttons, social channels, and responsive profile avatar.
  3. **About Me** with personal narrative, quick metadata facts, and 4 focus highlight cards.
  4. **Educational Details** with glowing vertical timeline distinguishing ongoing vs. completed qualifications.
  5. **Academic Performance & Marks** with GPA/percentage cards and a responsive semester breakdown table.
  6. **Technical Skills** with interactive search filter, category tabs (Languages, Web, Frameworks, Databases, Tools, ML/AI, Soft Skills), and verified proficiency badges.
  7. **Achievements & Awards** with honors cards for hackathons, academic merit, coding contests, and symposiums.
  8. **Verified Certificates** with card preview grid, accessible Lightbox modal, and PDF download actions.
  9. **Professional & Career Focus** with target job roles, preferred industries, internship window, and work modality preferences.
  10. **Projects Showcase** with category filters, detailed feature breakdowns, technology pills, code/demo links, and full Deep Dive modals.
  11. **Contributions & Participation** highlighting extracurriculars, tech clubs, hackathon squads, and peer mentoring.
  12. **Photo Gallery** with masonry grid, category tags, and full-screen Lightbox with Next/Previous keyboard navigation.
  13. **Contact Section** with direct communication cards and an interactive form with real-time field validation, character counter, and email dispatch.
  14. **Footer** with navigation columns, dynamic JavaScript copyright year, and back-to-top button with circular scroll progress ring.
- **Accessibility & SEO**: WCAG 2.1 AA contrast, semantic HTML5 landmarks, keyboard navigation (`Escape`, `ArrowLeft`/`ArrowRight`), `prefers-reduced-motion` compliance, OpenGraph metadata, and zero external runtime dependencies.

---

## 📁 Project Architecture

```text
portfolio-website/
├── index.html                   # Core semantic HTML structure and content
├── css/
│   └── style.css                # CSS variables, theme tokens, glassmorphism & responsive styles
├── js/
│   └── script.js                # Interactive logic, theme toggle, filters, modals, canvas particles
├── assets/
│   ├── images/
│   │   ├── profile.jpg          # Profile avatar / headshot
│   │   ├── project-1.jpg        # Project 1 thumbnail
│   │   ├── project-2.jpg        # Project 2 thumbnail
│   │   ├── project-3.jpg        # Project 3 thumbnail
│   │   ├── certificate-1.jpg    # Certificate preview image
│   │   ├── gallery-1.jpg        # Gallery event photo 1
│   │   ├── gallery-2.jpg        # Gallery event photo 2
│   │   └── gallery-3.jpg        # Gallery event photo 3
│   ├── certificates/
│   │   └── sample-certificate.pdf # Sample downloadable certificate PDF
│   └── resume.pdf               # Downloadable resume document
└── README.md                    # Setup, customization, and deployment guide
```

---

## 🖥️ How to Run Locally

You do not need any build tools, compilers, or complex frameworks to run this site.

### Method 1: Direct File Opening
Double-click `index.html` in your file explorer, or right-click and choose **Open with > Chrome / Edge / Firefox**.

### Method 2: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The website will launch automatically at `http://127.0.0.1:5500/`. Any edits you make will reload instantly in real-time.

### Method 3: Lightweight Python or Node HTTP Server
If you prefer running a command from your terminal:

**Using Python:**
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

**Using Node / npx:**
```bash
npx serve .
```

---

## ✏️ Step-by-Step Customization Guide

All personal placeholders are clearly marked with bracketed tags like `[YOUR FULL NAME]` so you can easily locate and personalize them.

### 1. Update Personal Name, Headline & Metadata
Open [`index.html`](index.html) and search for:
- `[YOUR FULL NAME]`: Replace with your actual name (in `<title>`, Hero `<h1>`, Brand Logo, and Footer).
- `[YOUR PROFESSIONAL TITLE]`: Update with your title, e.g. *“Computer Science & Engineering Student | Aspiring Software Engineer”*.
- `[YOUR DEGREE / BRANCH]`: Update with your degree, e.g. *“B.Tech in Computer Science & Engineering”*.
- `[YOUR COLLEGE NAME]`: Insert your university / institution.
- `[YOUR CITY, STATE]`: Update with your current location.

### 2. Replace Your Profile Photo
1. Select a high-resolution professional headshot or portrait.
2. Save your photo as `profile.jpg`.
3. Place it inside [`assets/images/profile.jpg`](assets/images/profile.jpg) (overwriting the existing placeholder).
4. The glowing morphing border and responsive styling will adapt automatically!

### 3. Add Your Resume PDF
1. Export your resume from your document editor or LaTeX as a PDF named `resume.pdf`.
2. Place the file inside [`assets/resume.pdf`](assets/resume.pdf).
3. All three download buttons (Navbar, Hero section, and Footer) will now open or download your real PDF document.

### 4. Customizing Education & Academic Marks
- **Education Timeline** ([`index.html#L210`](index.html)):
  - Edit institution names, starting & ending years, degree names, and relevant coursework pills.
  - To mark a degree as finished or ongoing, change `<span class="status-badge ongoing">` to `<span class="status-badge completed">`.
- **Academic Performance Table & Cards** ([`index.html#L310`](index.html)):
  - Replace `[YOUR CGPA]` with your current semester or cumulative GPA (e.g. `8.85 / 10.0`).
  - Update percentage scores for Class 10th and 12th.
  - In the table below the cards, update semester scores, exam years, and board verifications.

### 5. Modifying or Adding Technical Skills
1. Open [`index.html`](index.html) under the `#skills` section.
2. Each skill is encapsulated in a `.skill-card` with a `data-category` attribute (`languages`, `web`, `frameworks`, `databases`, `tools`, `aiml`, `soft`).
3. You can change proficiency badges between `level-advanced`, `level-intermediate`, or `level-beginner`.
4. To add a new skill, simply duplicate an existing card and edit the SVG icon, skill name, and description.

### 6. Adding & Editing Projects
Projects are configured in two places:
1. **HTML Overview Card** ([`index.html#L600`](index.html)): Contains the thumbnail image, title, summary, key highlights, tech badges, and GitHub/Demo links.
2. **JavaScript Modal Repository** ([`js/script.js#L14`](js/script.js)): Contains the deep-dive problem statement, architecture objective, solution details, and feature bullets shown when the user clicks **"Project Deep Dive"**.

**To customize an existing project:**
1. Save your project screenshot in [`assets/images/project-1.jpg`](assets/images/project-1.jpg).
2. Edit the title and links in [`index.html`](index.html).
3. Open [`js/script.js`](js/script.js), locate `projectDatabase['project-1']`, and customize the `problem`, `objective`, `solution`, and `technologies`.

### 7. Adding Certificates & Lightbox Previews
1. Place your certificate image in [`assets/images/certificate-1.jpg`](assets/images/certificate-1.jpg) and PDF in [`assets/certificates/sample-certificate.pdf`](assets/certificates/sample-certificate.pdf).
2. Update the certificate title, issuing organization, and credential ID in [`index.html`](index.html) and [`js/script.js#L80`](js/script.js).
3. The preview lightbox and download buttons automatically connect to the updated assets!

### 8. Customizing Color Palette & Fonts
All design tokens are defined using CSS custom variables in [`css/style.css`](css/style.css):

```css
:root {
  --color-deep-navy: #101126;  /* Primary background base */
  --color-purple:    #7C3AED;  /* Accent purple */
  --color-blue:      #3B82F6;  /* Electric blue */
  --color-pink:      #EC4899;  /* Vibrant pink */
  --color-cyan:      #22D3EE;  /* High-contrast cyan */
  --color-soft-bg:   #F7F7FF;  /* Light mode background */
}
```
Modify these hex values to customize your entire site theme globally in seconds.

---

## ✉️ Configuring a Real Contact Form

Because static websites (hosted on GitHub Pages or Vercel) have no backend server, vanilla JavaScript uses the built-in `mailto:` protocol by default to open the user's email client with pre-filled inputs.

To receive direct form submissions silently in your inbox without opening the user's email client, choose one of these free, 2-minute setup options:

### Option A: Formspree (Free & Most Popular)
1. Sign up at [formspree.io](https://formspree.io/).
2. Create a new form and copy your Form ID (e.g., `https://formspree.io/f/mqkvonpq`).
3. Open [`index.html`](index.html), find `<form id="contact-form">`, and add:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Submissions will be sent directly to your email inbox!

### Option B: Web3Forms (No Registration Required)
1. Visit [web3forms.com](https://web3forms.com/) and enter your email to get an Access Key.
2. Add a hidden input inside your `<form>` in [`index.html`](index.html):
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```

---

## 🌐 Deployment Instructions

### 1. Deploying to GitHub Pages (100% Free)

1. Create a new repository on [GitHub](https://github.com/) (e.g. `portfolio`).
2. Open your terminal in this project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of personal portfolio website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```
3. On GitHub, navigate to **Settings > Pages** (in the left sidebar).
4. Under **Build and deployment > Branch**:
   - Select **Branch**: `main`
   - Select **Folder**: `/ (root)`
   - Click **Save**.
5. Wait 1–2 minutes. Your website will be live at:
   `https://YOUR_USERNAME.github.io/portfolio/`

### 2. Deploying to Vercel

1. Push your code to GitHub (following the steps above).
2. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
3. Click **"Add New Project"** and select your `portfolio` repository.
4. Leave **Framework Preset** as **Other** (since it is standard HTML/CSS/JS).
5. Click **Deploy**.
6. Vercel will instantly generate a global SSL URL (e.g., `https://your-portfolio.vercel.app`).

---

## 📋 Pre-Publication Checklist

Before sharing your portfolio with college faculty, recruiters, or internship managers:

- [ ] Replaced all instances of `[YOUR FULL NAME]` in `index.html` and `README.md`.
- [ ] Updated professional title, degree, college name, and location in Hero & About sections.
- [ ] Replaced [`assets/images/profile.jpg`](assets/images/profile.jpg) with your real headshot.
- [ ] Replaced [`assets/resume.pdf`](assets/resume.pdf) with your actual PDF resume.
- [ ] Updated social profile links (GitHub, LinkedIn, Email) in Hero, Contact, and Footer.
- [ ] Verified educational timeline entries and coursework lists.
- [ ] Updated semester CGPA and school marks with genuine verified scores.
- [ ] Reviewed skill proficiencies and removed technologies you haven't worked with.
- [ ] Replaced placeholder project repositories and demo URLs with your active links.
- [ ] Tested responsive behavior on mobile (Chrome DevTools Device Toolbar: `Ctrl + Shift + M`).
- [ ] Tested theme switcher (Dark / Light) to ensure text contrast remains sharp.

---

## 🔒 Owner Portal & Real-Time Visitor Telemetry Dashboard

The portfolio comes equipped with a **Private Owner Access Portal & Telemetry Dashboard** located at the bottom of the website:

### Features
1. **Automatic Visitor Telemetry**:
   - **IP & Geolocation**: City, Region, Country (with flag), and ISP organization (via secure, free IP geolocation).
   - **Operating System Detection**: Windows 11/10, macOS, iOS (iPhone/iPad), Android, Linux.
   - **Device Categorization**: Desktop, Mobile, Tablet, plus Screen Resolution.
   - **Network Profile**: Connection type (`4G`, `5G`, `WiFi / Broadband`), downlink bandwidth speed, and latency.
   - **Activity & Dwell Time**: Sections explored (`#certificates`, `#projects`, `#achievements`, `#resume`) and total duration.
2. **Owner Authentication**:
   - Master Password protected (Default: `shantanu2026`).
   - Change master password directly within the Dashboard settings.
   - Session persistence option ("Remember on this device").
3. **Live Visitor Stream & Demographics**:
   - Filterable, searchable live visitor table.
   - Raw JSON telemetry inspector.
   - Visual percentage charts for Operating Systems, Devices, and Top Geographies.
4. **Push Alerts to Your Phone / Discord**:
   - Enter your Discord Webhook URL or HTTP Webhook in **Settings** to receive instant push alerts whenever someone opens your website.
5. **Data Export**:
   - One-click export of visitor logs to **CSV** or **JSON**.

---

## 📄 License & Credits

Built with standard HTML5, CSS3, and modern JavaScript (ES6+). Feel free to adapt, customize, and deploy this portfolio for academic and professional applications!
