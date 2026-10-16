/**
 * ==============================================================================
 * PORTFOLIO CLIENT JAVASCRIPT
 * Creative & Professional Portfolio Website
 * Handles animations, theme toggling, interactive filters, accessible modals,
 * form validation, and ambient canvas particle effects.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. DATA REPOSITORIES (Projects & Certificates Details for Dynamic Modals)
  // ----------------------------------------------------------------------------
  const projectDatabase = {
    'project-1': {
      title: 'Heart Disease Prediction System Using Ensemble Classifiers',
      category: 'Machine Learning & AI',
      status: 'Patented & Published',
      image: 'assets/images/research paper patent 02.jpeg',
      problem: 'Cardiovascular disease remains the leading cause of global mortality. Conventional single-classifier clinical diagnosis often struggles with heterogeneous biomarker data, missing parameters, and high false-negative rates in early screening.',
      objective: 'Invent, patent, and clinically deploy an ensemble machine learning decision-support framework that combines multi-attribute clinical parameters with automated hyperparameter optimization to achieve high diagnostic sensitivity.',
      solution: 'Engineered an ensemble pipeline combining 5 algorithms: Random Forest, Support Vector Machine (SVM), Logistic Regression, Decision Tree, and K-Nearest Neighbors (KNN). Developed on 11 patient biomarkers with Grid Search & Randomized Search tuning, reaching 86.95% accuracy and deployed with an interactive Streamlit clinical interface.',
      keyFeatures: [
        'Official Government Patent Published: Indian Patent Office Journal No. 12/2026 (Application No. 202621011074 A)',
        'Lead Inventor: Shantanu Jumale with academic co-inventors under Symbiosis International (Deemed University)',
        'Evaluates 11 clinical biomarkers including resting blood pressure, cholesterol, ECG, max heart rate, and ST slope',
        'Optimized Random Forest Classifier achieving 86.95% verified prediction accuracy',
        'Interactive Streamlit deployment interface supporting both single-patient risk evaluation and bulk diagnostic batches'
      ],
      technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Streamlit', 'Random Forest', 'Ensemble ML', 'GridSearchCV'],
      contributions: 'Conceived invention architecture, built complete data preprocessing and KNN imputation pipeline, performed model benchmark optimization, and authored patent disclosures.',
      demoUrl: 'assets/images/research paper patent 02.jpeg',
      githubUrl: 'assets/images/research paper patent 01.jpeg'
    },
    'project-2': {
      title: 'AI-Based Early Warning System for Crop Diseases',
      category: 'Machine Learning & AI',
      status: 'PBL Flagship Project',
      image: 'assets/images/IOT presentation.jpeg',
      problem: 'Agricultural communities face critical food security and financial losses from undetected crop blights and fungal pathogens, compounded by delays in manual field diagnosis.',
      objective: 'Build an end-to-end Project-Based Learning (PBL) warning platform integrating field sensor telemetry and predictive modeling for early crop disease hazard detection.',
      solution: 'Developed an automated data ingestion and predictive pipeline utilizing environmental indicators and symptom classification models. Validated through physical hardware demonstrations with IoT microcontrollers and agricultural sensors.',
      keyFeatures: [
        'Flagship Project-Based Learning (PBL) initiative at Symbiosis Institute of Technology (SIT), Nagpur',
        'Early symptom detection pipeline analyzing microclimate risk variables (temperature, humidity, soil moisture)',
        'Hardware-integrated demonstration presented to university faculty and technical review boards',
        'Actionable preventative advisories for optimized agricultural intervention and pesticide scheduling'
      ],
      technologies: ['Python', 'Machine Learning', 'Data Preprocessing', 'IoT Sensors', 'Pandas', 'Matplotlib'],
      contributions: 'Spearheaded ML pipeline development, integrated sensor telemetry thresholds, engineered data cleaning workflows, and co-led the hardware-software presentation.',
      demoUrl: 'assets/images/IOT presentation.jpeg',
      githubUrl: '#'
    },
    'project-3': {
      title: 'Student Academic Performance Prediction System',
      category: 'Data Science & Analytics',
      status: 'Completed',
      image: 'assets/images/image 5.jpeg',
      problem: 'Higher education institutions lack early-stage warning mechanisms to detect declining student comprehension and performance trends before critical semester examinations.',
      objective: 'Construct an empirical student performance predictive model utilizing multi-attribute academic, engagement, and socio-demographic features to forecast semester outcomes.',
      solution: 'Engineered a machine learning pipeline featuring systematic missing value treatment, outlier detection, multi-factor correlation matrices, and comparative model evaluation across regression and classification paradigms.',
      keyFeatures: [
        'Multi-attribute dataset preprocessing with robust normalization and imputation techniques',
        'Comprehensive exploratory data analysis (EDA) mapping high-correlation performance drivers',
        'Algorithm benchmark comparison optimizing classification accuracy and recall for at-risk cohorts',
        'Visual evaluation dashboards for student counselors and department advisors'
      ],
      technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Seaborn', 'Data Preprocessing', 'Statistical Modeling'],
      contributions: 'Engineered the feature extraction pipeline, implemented outlier detection algorithms, tuned classification models, and presented analytics insights.',
      demoUrl: 'assets/images/image 5.jpeg',
      githubUrl: '#'
    }
  };

  const certificateDatabase = {
    'cert-1': {
      title: 'Certificate Course in DSA with Python (Grade A+)',
      issuer: 'All India Professional Skills Certification Council (AIPSCC) & ICE Computers',
      date: 'December 2024 (Exam: Feb 23, 2026)',
      credentialId: '2510124 (APC MH40220001)',
      image: 'assets/certificates/Certificate 01.jpeg',
      pdf: 'assets/certificates/Certificate-01-DSA-Python.pdf',
      skills: ['Data Structures', 'Algorithms', 'Python', 'A+ Grade Distinction', 'Time & Space Complexity', 'Problem Solving']
    },
    'cert-2': {
      title: 'Data Structures and Algorithms using Python - Part 1',
      issuer: 'Infosys Springboard (Infosys Limited)',
      date: 'October 14, 2025 (Issued: Oct 27, 2025)',
      credentialId: 'Infosys-DSA-PY-1 (verify.onwingspan.com)',
      image: 'assets/certificates/certificate 03.jpeg',
      pdf: 'assets/certificates/Certificate-03-Infosys-DSA.pdf',
      skills: ['Python', 'Algorithm Design', 'Lists, Stacks, Trees', 'Computational Efficiency', 'Data Structures']
    },
    'cert-3': {
      title: 'Red Hat System Administration I (RH124 - RHA) - Ver. 10',
      issuer: 'Red Hat (Credly Verified)',
      date: 'March 23, 2026',
      credentialId: 'Credit Hours: 40 | Credly Badge',
      image: 'assets/certificates/redhat certificate 01.jpeg',
      pdf: 'assets/certificates/Certificate-RedHat-RH124.pdf',
      skills: ['Linux OS', 'System Administration', 'Shell Automation', 'Process Control', 'Security & Permissions']
    },
    'cert-4': {
      title: 'AI & Machine Learning Internship Certificate',
      issuer: 'Maincrafts Technology (MSME Govt. of India)',
      date: '20 May 2026 – 20 June 2026',
      credentialId: 'Intern ID: MT4061 (UDYAM-UP-75-0096043)',
      image: 'assets/certificates/maincraft certificate 01.jpeg',
      pdf: 'assets/certificates/Certificate-Maincrafts-AIML.pdf',
      skills: ['Machine Learning (AI/ML)', 'Data Pipelines', 'Model Training', 'Python', 'Industry Project Delivery']
    },
    'cert-5': {
      title: '3-Hours SQL Using AI Workshop Certification',
      issuer: 'AI For Techies',
      date: 'September 21, 2025',
      credentialId: 'AIFT-SQL-AI-VERIFIED',
      image: 'assets/certificates/certificate 02.jpeg',
      pdf: 'assets/certificates/Certificate-02-SQL-AI.pdf',
      skills: ['SQL', 'AI Query Optimization', 'Database Schema', 'Data Preprocessing', 'Workflow Automation']
    },
    'cert-6': {
      title: 'Leadership Entrepreneurial Bootcamp & Internship',
      issuer: 'E-Cell Symbiosis Institute of Technology (SIT), Nagpur',
      date: '1st June – 30th June 2026',
      credentialId: 'SIT-ECELL-BOOTCAMP-2026',
      image: 'assets/certificates/Ecell certificate.jpeg',
      pdf: 'assets/certificates/Certificate-ECell-SIT-Nagpur.pdf',
      skills: ['Entrepreneurship', 'Venture Pitching', 'Cross-Functional Leadership', 'Business Operations']
    },
    'cert-7': {
      title: 'XXXVII Senior National Taekwondo Championship — Merit Certificate',
      issuer: 'Taekwondo Association of India (Affiliated to Taekwondo Federation of India | Recognised by Ministry of Youth Affairs & Sports, Govt. of India)',
      date: 'May 15th – May 19th, 2024',
      credentialId: 'CF No. 12 (Bhandara District | Indira Gandhi Stadium, New Delhi)',
      image: 'assets/certificates/National-Taekwondo-Certificate.jpeg',
      pdf: 'assets/certificates/Certificate-National-Taekwondo.pdf',
      skills: ['National Level Athlete', 'Taekwondo Championship', 'National Selection Trials', 'Indira Gandhi Stadium, New Delhi', 'High-Stakes Focus', 'Discipline & Resilience']
    },
    'hackathon-1': {
      title: 'Genathon 3.0 at Tantrafiesta 2025 – Dark Matter Eclipse',
      issuer: 'Indian Institute of Information Technology, Nagpur (IIIT Nagpur)',
      date: '10th–11th October 2025',
      credentialId: 'Team: Initial Commit',
      image: 'assets/Hackthon/Hackthon certificate.jpeg',
      pdf: 'assets/Hackthon/Certificate-Genathon-IIIT-Nagpur.pdf',
      skills: ['36-Hour National Hackathon', 'Rapid Prototyping', 'Team Initial Commit', 'Competitive Engineering']
    },
    'hackathon-2': {
      title: 'SITNovate 2.0 (Enthusia 5.0) Innovation Hackathon',
      issuer: 'Symbiosis Institute of Technology (SIT), Nagpur',
      date: 'February 26th–28th, 2026',
      credentialId: 'SITNovate-2.0-SIT',
      image: 'assets/Hackthon/hackton 01.jpeg',
      pdf: 'assets/Hackthon/Certificate-SITNovate-SIT-Nagpur.pdf',
      skills: ['Innovation Sprint', 'Participant / Volunteer', 'Hardware & Software', 'Collaborative Development']
    }
  };

  // ----------------------------------------------------------------------------
  // 2. THEME CONTROLLER (Dark / Light Mode Toggle)
  // ----------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    if (themeIconSun && themeIconMoon) {
      if (theme === 'light') {
        themeIconSun.style.display = 'none';
        themeIconMoon.style.display = 'block';
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      } else {
        themeIconSun.style.display = 'block';
        themeIconMoon.style.display = 'none';
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      }
    }
  }

  // Initialize theme from storage or system preference (Default to light for redesign)
  const savedTheme = localStorage.getItem('portfolio-theme');
  const initialTheme = savedTheme || 'light';
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // ----------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION MENU
  // ----------------------------------------------------------------------------
  const navHamburger = document.getElementById('nav-hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!navMenu || !navHamburger) return;

    const isOpen = forceClose ? false : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    navHamburger.classList.toggle('active', isOpen);
    navHamburger.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  if (navHamburger) {
    navHamburger.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      toggleMobileMenu(true);
    }
  });

  // ----------------------------------------------------------------------------
  // 4. NAVBAR ELEVATION ON SCROLL
  // ----------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');

  function handleNavbarElevation() {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarElevation, { passive: true });
  handleNavbarElevation();

  // ----------------------------------------------------------------------------
  // 5. ACTIVE NAVIGATION LINK SPYING (IntersectionObserver)
  // ----------------------------------------------------------------------------
  const trackedSections = document.querySelectorAll('section[id]');

  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  trackedSections.forEach(section => sectionObserver.observe(section));

  // ----------------------------------------------------------------------------
  // 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ----------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-init');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible', 'reveal-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.05,
    rootMargin: '50px 0px 0px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-visible', 'reveal-in');
    revealObserver.observe(el);
  });

  // ----------------------------------------------------------------------------
  // 7. BACK-TO-TOP BUTTON WITH CIRCULAR SCROLL PROGRESS
  // ----------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  const progressRingCircle = document.querySelector('.progress-ring-circle');

  function updateScrollProgress() {
    if (!backToTopBtn) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) : 0;

    // Toggle button visibility
    if (scrollTop > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Update progress ring (circumference is 2 * PI * 22 ≈ 138.2)
    if (progressRingCircle) {
      const circumference = 138.2;
      const offset = circumference - (scrollPercentage * circumference);
      progressRingCircle.style.strokeDashoffset = offset;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 8. SKILLS CATEGORY FILTERING & SEARCH
  // ----------------------------------------------------------------------------
  const skillCategoryTabs = document.querySelectorAll('[data-skill-filter]');
  const skillCards = document.querySelectorAll('.skill-card');
  const skillSearchInput = document.getElementById('skill-search-input');

  function filterSkills() {
    const activeTab = document.querySelector('[data-skill-filter].active');
    const category = activeTab ? activeTab.getAttribute('data-skill-filter') : 'all';
    const query = skillSearchInput ? skillSearchInput.value.trim().toLowerCase() : '';

    skillCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardName = card.querySelector('.skill-name')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.skill-description')?.textContent.toLowerCase() || '';

      const matchesCategory = (category === 'all' || cardCategory === category);
      const matchesSearch = query === '' || cardName.includes(query) || cardDesc.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  skillCategoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillCategoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterSkills();
    });
  });

  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', filterSkills);
  }

  // ----------------------------------------------------------------------------
  // 9. PROJECTS CATEGORY FILTERING
  // ----------------------------------------------------------------------------
  const projectCategoryTabs = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectCategoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectCategoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-project-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ----------------------------------------------------------------------------
  // 10. PROJECT DETAILS MODAL
  // ----------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-content');
  const projectDetailButtons = document.querySelectorAll('[data-project-details]');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  function openProjectModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data || !projectModal || !projectModalContent) return;

    projectModalContent.innerHTML = `
      <div class="project-modal-header" style="margin-bottom: 24px;">
        <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
          <span class="project-category-badge">${data.category}</span>
          <span class="project-status-badge">${data.status}</span>
        </div>
        <h2 id="project-modal-title" style="font-size: 1.85rem; margin-bottom: 8px;">${data.title}</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem;"><strong>Role & Contributions:</strong> ${data.contributions}</p>
      </div>

      <div style="width: 100%; border-radius: var(--border-radius-md); overflow: hidden; margin-bottom: 24px; aspect-ratio: 16/9; background: #0A0B16;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 28px;">
        <div>
          <h4 style="color: var(--color-cyan); margin-bottom: 6px;">Problem Statement</h4>
          <p style="color: var(--text-secondary); line-height: 1.6;">${data.problem}</p>
        </div>

        <div>
          <h4 style="color: var(--color-purple-light); margin-bottom: 6px;">Objective & Solution Architecture</h4>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 8px;">${data.objective}</p>
          <p style="color: var(--text-secondary); line-height: 1.6;">${data.solution}</p>
        </div>

        <div>
          <h4 style="color: var(--color-cyan); margin-bottom: 8px;">Key Technical Highlights</h4>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            ${data.keyFeatures.map(feat => `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: var(--text-secondary);">
                <span style="color: var(--color-cyan); font-weight: bold; margin-top: 2px;">•</span>
                <span>${feat}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <h4 style="margin-bottom: 10px;">Technologies Applied</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 14px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
        <a href="${data.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Launch Live Project
        </a>
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          Source Repository
        </a>
      </div>
    `;

    projectModal.classList.add('active', 'open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  projectDetailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-details');
      openProjectModal(projectId);
    });
  });

  // ----------------------------------------------------------------------------
  // 11. CERTIFICATE LIGHTBOX & MODAL
  // ----------------------------------------------------------------------------
  const certModal = document.getElementById('cert-modal');
  const certModalContent = document.getElementById('cert-modal-content');
  const certDetailButtons = document.querySelectorAll('[data-cert-details]');

  function openCertificateModal(certId) {
    const cert = certificateDatabase[certId];
    if (!cert || !certModal || !certModalContent) return;

    certModalContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="section-tag" style="margin-bottom: 8px;">Verified Credential</span>
        <h2 id="cert-modal-title" style="font-size: 1.6rem; margin-bottom: 6px;">${cert.title}</h2>
        <p style="color: var(--color-cyan); font-weight: 600;">Issued by: ${cert.issuer}</p>
        <p style="color: var(--text-muted); font-size: 0.88rem;">Date: ${cert.date} | Credential ID: ${cert.credentialId}</p>
      </div>

      <div class="cert-modal-viewer">
        <img src="${cert.image}" alt="${cert.title}" class="cert-modal-img">
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 1rem; margin-bottom: 8px;">Associated Competencies:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${cert.skills.map(s => `<span class="tech-tag">${s}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 14px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
        <a href="${cert.pdf}" target="_blank" download="Certificate-${cert.credentialId}.pdf" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Certificate PDF
        </a>
        <a href="${cert.image}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          View Full Image
        </a>
      </div>
    `;

    certModal.classList.add('active', 'open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  certDetailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const certId = btn.getAttribute('data-cert-details');
      openCertificateModal(certId);
    });
  });

  // ----------------------------------------------------------------------------
  // 12. PHOTO GALLERY LIGHTBOX WITH PREV / NEXT NAVIGATION
  // ----------------------------------------------------------------------------
  const galleryModal = document.getElementById('gallery-modal');
  const galleryLightboxImg = document.getElementById('gallery-lightbox-img');
  const galleryLightboxCaption = document.getElementById('gallery-lightbox-caption');
  const galleryLightboxCounter = document.getElementById('gallery-lightbox-counter');
  const galleryPrevBtn = document.getElementById('gallery-prev-btn');
  const galleryNextBtn = document.getElementById('gallery-next-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentGalleryIndex = 0;
  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-image-src') || item.querySelector('img').getAttribute('src'),
    alt: item.querySelector('img').getAttribute('alt') || 'Gallery Photo',
    caption: item.getAttribute('data-caption') || item.querySelector('.gallery-caption')?.textContent || '',
    tag: item.getAttribute('data-tag') || item.querySelector('.gallery-tag')?.textContent || ''
  }));

  function updateGalleryLightbox(index) {
    if (!galleryLightboxImg || index < 0 || index >= galleryData.length) return;
    currentGalleryIndex = index;
    const item = galleryData[currentGalleryIndex];

    galleryLightboxImg.src = item.src;
    galleryLightboxImg.alt = item.alt;
    if (galleryLightboxCaption) {
      galleryLightboxCaption.innerHTML = `<span style="color: var(--color-cyan); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; display: block; margin-bottom: 4px;">${item.tag}</span>${item.caption}`;
    }
    if (galleryLightboxCounter) {
      galleryLightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;
    }
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (!galleryModal) return;
      updateGalleryLightbox(index);
      galleryModal.classList.add('active', 'open');
      galleryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', () => {
      const nextIdx = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
      updateGalleryLightbox(nextIdx);
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', () => {
      const nextIdx = (currentGalleryIndex + 1) % galleryData.length;
      updateGalleryLightbox(nextIdx);
    });
  }

  // Gallery keyboard arrow navigation
  document.addEventListener('keydown', (e) => {
    if (!galleryModal || !galleryModal.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
      const nextIdx = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
      updateGalleryLightbox(nextIdx);
    } else if (e.key === 'ArrowRight') {
      const nextIdx = (currentGalleryIndex + 1) % galleryData.length;
      updateGalleryLightbox(nextIdx);
    }
  });

  // Generic modal close handlers
  function closeAllModals() {
    const activeModals = document.querySelectorAll('.modal-overlay.active, .modal-overlay.open');
    activeModals.forEach(m => {
      m.classList.remove('active', 'open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // ----------------------------------------------------------------------------
  // 13. CONTACT FORM VALIDATION & DIRECT EMAIL CLIENT DISPATCH
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formNameInput = document.getElementById('form-name');
  const formEmailInput = document.getElementById('form-email');
  const formSubjectInput = document.getElementById('form-subject');
  const formMessageInput = document.getElementById('form-message');
  const charCounter = document.getElementById('char-counter');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formStatusAlert = document.getElementById('form-status-alert');

  // Character counter for message textarea
  if (formMessageInput && charCounter) {
    formMessageInput.addEventListener('input', () => {
      const count = formMessageInput.value.length;
      charCounter.textContent = `${count} / 500`;
      if (count > 500) {
        charCounter.style.color = '#EF4444';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).trim().toLowerCase());
  }

  function setFieldError(fieldId, errorMsg) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) {
      if (errorMsg) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add('visible');
        if (inputEl) inputEl.style.borderColor = '#EF4444';
      } else {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
        if (inputEl) inputEl.style.borderColor = '';
      }
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasErrors = false;
      const name = formNameInput ? formNameInput.value.trim() : '';
      const email = formEmailInput ? formEmailInput.value.trim() : '';
      const subject = formSubjectInput ? formSubjectInput.value.trim() : '';
      const message = formMessageInput ? formMessageInput.value.trim() : '';

      // Reset errors
      setFieldError('form-name', '');
      setFieldError('form-email', '');
      setFieldError('form-subject', '');
      setFieldError('form-message', '');

      // Validation checks
      if (!name || name.length < 2) {
        setFieldError('form-name', 'Please provide your full name (at least 2 characters).');
        hasErrors = true;
      }

      if (!email || !validateEmail(email)) {
        setFieldError('form-email', 'Please enter a valid email address.');
        hasErrors = true;
      }

      if (!subject || subject.length < 3) {
        setFieldError('form-subject', 'Please enter a message subject.');
        hasErrors = true;
      }

      if (!message || message.length < 10) {
        setFieldError('form-message', 'Please write a message with at least 10 characters.');
        hasErrors = true;
      }

      if (hasErrors) {
        if (formStatusAlert) {
          formStatusAlert.className = 'form-status-alert error';
          formStatusAlert.textContent = 'Please correct the highlighted fields above.';
        }
        return;
      }

      // Valid form - Inform user and trigger mailto fallback or configured endpoint
      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          Preparing Email...
        `;
      }

      setTimeout(() => {
        // Construct mailto link with encoded content
        const recipientEmail = 'jumaleshantanu@gmail.com';
        const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
        const encodedBody = encodeURIComponent(`Hello,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n--- Sent via Portfolio Contact Form ---`);
        const mailtoUri = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;

        if (formStatusAlert) {
          formStatusAlert.className = 'form-status-alert success';
          formStatusAlert.innerHTML = `
            <strong>Draft Prepared!</strong> Your email client is opening with your pre-filled inquiry. 
            <br><small style="opacity: 0.9;">To send messages silently in background, configure Formspree or EmailJS as detailed in README.md.</small>
          `;
        }

        // Trigger email client
        window.location.href = mailtoUri;

        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Send Message
          `;
        }

        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';
      }, 700);
    });
  }

  // ----------------------------------------------------------------------------
  // 14. DYNAMIC COPYRIGHT YEAR
  // ----------------------------------------------------------------------------
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ----------------------------------------------------------------------------
  // 15. RESUME DOWNLOAD HANDLER & NOTIFICATION
  // ----------------------------------------------------------------------------
  const resumeDownloadButtons = document.querySelectorAll('.btn-resume-download');
  resumeDownloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Allow default download behavior for assets/resume.pdf
      console.log('Resume download initiated from: ' + btn.getAttribute('href'));
    });
  });

  // ----------------------------------------------------------------------------
  // 16. AMBIENT PARTICLES CANVAS BACKGROUND
  // ----------------------------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1;
        const colors = [
          'rgba(240, 68, 46, 0.45)', // Primary Orange-Red
          'rgba(255, 122, 24, 0.45)', // Deep Orange
          'rgba(255, 200, 61, 0.45)', // Golden Yellow
          'rgba(71, 118, 230, 0.35)'  // Electric Blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(240, 68, 46, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    initParticles();
    animate();
  }

});
