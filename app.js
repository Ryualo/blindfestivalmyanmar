// ==========================================
// GOOGLE SHEETS CSV URL - PASTE YOUR LINK HERE
// ==========================================
// INSTRUCTIONS:
// 1. Create a Google Sheet with supporter names in the first column
// 2. Go to: File > Share > Publish to web
// 3. Select "Comma-separated values (.csv)" format
// 4. Copy the published CSV URL
// 5. Paste it below replacing "PASTE_YOUR_CSV_LINK_HERE"
// ==========================================

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRLbwTQX7owuVDR7709op7T1Ev6nZiy-ADjzjFtT7v0lvMCxvAeCr60Pmj5aQ1t1F9iyGXdVfVP-9up/pub?gid=0&single=true&output=csv";

// ==========================================
// MODAL DATA - STATS, COLORS, IMAGES
// ==========================================

const modalData = {
    standard: {
        title: "KID EDITION",
        hook: "Perfect for young collectors — toys, surprises, and a chance at limited edition gear",
        stats: [
            { name: "Big Blind Boxes", rate: "35.5%" },
            { name: "Small Blind Boxes", rate: "37.6%" },
            { name: "Toy Balloon", rate: "13.4%" },
            { name: "Anime Cards", rate: "8.06%" },
            { name: "JACKPOT: Limited Edition Shirt", rate: "5.4%", jackpot: true }
        ],
        colors: [
            { name: "Khaki", code: "khaki" },
            { name: "Olive Green", code: "olive" },
            { name: "Dark Charcoal Green", code: "charcoal" },
            { name: "Navy Blue", code: "navy" },
            { name: "Electric Blue", code: "electric" },
            { name: "Lime Green", code: "lime" },
            { name: "Joy Yellow", code: "yellow" },
            { name: "Orange", code: "orange" }
        ],
        defaultColor: "khaki"
    },
    premium: {
        title: "PREMIUM EDITION",
        hook: "Elevated rewards for the bold — premium prizes and an exclusive jackpot bundle",
        stats: [
            { name: "Premium Perfume", rate: "54.8%" },
            { name: "Whole Package of Snacks", rate: "8.22%" },
            { name: "Colourful Candy Bag", rate: "6.9%" },
            { name: "JACKPOT: Shirt + Mastercard + Accessories", rate: "30.1%", jackpot: true }
        ],
        colors: [
            { name: "Khaki", code: "khaki" },
            { name: "Olive Green", code: "olive" },
            { name: "Dark Charcoal Green", code: "charcoal" },
            { name: "Navy Blue", code: "navy" },
            { name: "Electric Blue", code: "electric" },
            { name: "Lime Green", code: "lime" },
            { name: "Joy Yellow", code: "yellow" },
            { name: "Orange", code: "orange" }
        ],
        defaultColor: "khaki"
    }
};

// Color meanings data for dynamic display
const colorMeanings = [
    { 
        code: "khaki", 
        title: "KHAKI – GROUNDED IN PEACE", 
        description: "Khaki represents calm, stability, and quiet strength." 
    },
    { 
        code: "olive", 
        title: "OLIVE GREEN – WALK WITH PURPOSE", 
        description: "Olive green stands for growth, harmony, and resilience." 
    },
    { 
        code: "charcoal", 
        title: "DARK CHARCOAL GREEN – WALK WITH INTEGRITY", 
        description: "Dark charcoal green reflects depth, balance, and inner strength." 
    },
    { 
        code: "navy", 
        title: "NAVY BLUE – WALK WITH CONFIDENCE", 
        description: "Navy blue symbolizes trust, wisdom, and reliability." 
    },
    { 
        code: "electric", 
        title: "ELECTRIC BLUE – WALK WITH CLARITY", 
        description: "Electric blue reflects clarity, communication, and bold ideas." 
    },
    { 
        code: "lime", 
        title: "LIME GREEN – WALK WITH ENERGY", 
        description: "Lime green stands for freshness, energy, and new beginnings." 
    },
    { 
        code: "yellow", 
        title: "JOY YELLOW – WALK WITH JOY", 
        description: "Joy yellow brings happiness, optimism, and positivity." 
    },
    { 
        code: "orange", 
        title: "ORANGE – WALK WITH COURAGE", 
        description: "Orange represents enthusiasm, courage, and determination." 
    }
];

// File name mapping for images (matches actual file names)
function getImageFileName(colorCode) {
    // Return colorCode as-is since files use short names
    // (shirt-charcoal.jpg, shirt-navy.jpg, etc.)
    return colorCode;
}

// ==========================================
// GOOGLE SHEETS - FETCH AND DISPLAY SUPPORTERS
// ==========================================

async function loadSupporters() {
    const loadingElement = document.getElementById('contributors-loading');
    const gridElement = document.getElementById('contributors-grid');
    
    if (GOOGLE_SHEET_CSV_URL === "PASTE_YOUR_CSV_LINK_HERE") {
        loadingElement.textContent = "CONFIGURE GOOGLE SHEETS URL IN APP.JS";
        loadingElement.style.color = "#999999";
        return;
    }
    
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        
        const names = rows.slice(1).map(row => {
            const columns = row.split(',');
            return columns[0].trim().replace(/^["']|["']$/g, '');
        }).filter(name => name !== '');
        
        loadingElement.style.display = 'none';
        
        if (names.length === 0) {
            gridElement.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #999999;">NO SUPPORTERS FOUND</p>';
        } else {
            names.forEach(name => {
                const item = document.createElement('div');
                item.className = 'contributor-item';
                item.textContent = name;
                gridElement.appendChild(item);
            });
        }
        
    } catch (error) {
        console.error('Error loading supporters:', error);
        loadingElement.textContent = 'FAILED TO LOAD SUPPORTERS';
        loadingElement.style.color = "#999999";
    }
}

// ==========================================
// MODAL FUNCTIONALITY
// ==========================================

function openModal(boxType) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    // Get box data
    const data = modalData[boxType];
    if (!data) return;
    
    // Build the 2-column layout HTML
    const leftColumn = `
        <div class="modal-left">
            <h3 class="modal-title">${data.title}</h2>
            
            <ul class="modal-stats">
                ${data.stats.map(stat => `
                    <li${stat.jackpot ? ' class="jackpot"' : ''}>
                        <span>${stat.name}</span>
                        <span>${stat.rate}</span>
                    </li>
                `).join('')}
            </ul>
            
            <div class="color-meaning-dynamic">
                <h3 id="dynamic-color-title" class="dynamic-color-title">${colorMeanings.find(m => m.code === data.defaultColor)?.title || ''}</h3>
                <p id="dynamic-color-description" class="dynamic-color-description">${colorMeanings.find(m => m.code === data.defaultColor)?.description || ''}</p>
            </div>
            
            <div class="shirt-display">
                <div class="dynamic-shirt-container">
                    <img id="shirt-image-base" class="shirt-base" src="shirt-${getImageFileName(data.defaultColor)}.jpg" alt="Unfolded ${data.title}">
                    <img id="shirt-image-overlay" class="shirt-overlay" src="shirt-${getImageFileName(data.defaultColor)}1.jpg" alt="Folded ${data.title}">
                </div>
            </div>
            
            <div class="color-swatches">
                ${data.colors.map(color => `
                    <div class="color-swatch${color.code === data.defaultColor ? ' active' : ''}" 
                         data-color="${color.code}" 
                         data-box="${boxType}"
                         title="${color.name}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Build right column with on-model lookbook image (Premium Edition only)
    const rightColumn = boxType === 'premium' ? `
        <div class="modal-right">
            <img id="model-image" class="model-image" src="model-${getImageFileName(data.defaultColor)}.jpg" alt="model-${getImageFileName(data.defaultColor)}.jpg">
        </div>
    ` : '';
    
    // Inject content
    modalBody.innerHTML = leftColumn + rightColumn;
    
    // Add single-column class for Kid Edition (no model lookbook)
    if (boxType === 'standard') {
        modalBody.classList.add('single-column');
    } else {
        modalBody.classList.remove('single-column');
    }
    
    // Add click handlers to color swatches
    const swatches = modalBody.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const colorCode = this.getAttribute('data-color');
            const boxType = this.getAttribute('data-box');
            changeColor(boxType, colorCode);
            
            // Update active state for swatches
            swatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // Update dynamic text in left column with smooth fade
            const meaning = colorMeanings.find(m => m.code === colorCode);
            if (meaning) {
                const titleElement = document.getElementById('dynamic-color-title');
                const descElement = document.getElementById('dynamic-color-description');
                const container = document.querySelector('.color-meaning-dynamic');
                
                if (container && titleElement && descElement) {
                    // Fade out
                    container.style.transition = 'opacity 0.15s ease';
                    container.style.opacity = '0';
                    
                    // Wait for fade out, then update and fade in
                    setTimeout(() => {
                        titleElement.textContent = meaning.title;
                        descElement.textContent = meaning.description;
                        container.style.opacity = '1';
                    }, 150);
                }
            }
        });
    });
    
    // Open modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
}

function changeColor(boxType, colorCode) {
    const shirtImageBase = document.getElementById('shirt-image-base');
    const shirtImageOverlay = document.getElementById('shirt-image-overlay');
    const modelImage = document.getElementById('model-image');
    
    // Preload new images to prevent white flash during transition
    const baseFilename = `shirt-${getImageFileName(colorCode)}.jpg`;
    const overlayFilename = `shirt-${getImageFileName(colorCode)}1.jpg`;
    const modelFilename = modelImage ? `model-${boxType}-${colorCode}.jpg` : null;
    
    const newBaseImg = new Image();
    const newOverlayImg = new Image();
    const newModelImg = modelFilename ? new Image() : null;
    
    newBaseImg.src = baseFilename;
    newOverlayImg.src = overlayFilename;
    if (newModelImg) {
        newModelImg.src = modelFilename;
    }
    
    // Wait for all images to preload
    const imagePromises = [
        new Promise((resolve) => { newBaseImg.onload = resolve; newBaseImg.onerror = resolve; }),
        new Promise((resolve) => { newOverlayImg.onload = resolve; newOverlayImg.onerror = resolve; })
    ];
    
    if (newModelImg) {
        imagePromises.push(new Promise((resolve) => { newModelImg.onload = resolve; newModelImg.onerror = resolve; }));
    }
    
    Promise.all(imagePromises).then(() => {
        // Now that images are preloaded, start fade-out animation
        if (shirtImageBase) {
            shirtImageBase.classList.add('fade-out');
        }
        if (shirtImageOverlay) {
            shirtImageOverlay.classList.add('fade-out');
        }
        if (modelImage) {
            modelImage.classList.add('fade-out');
        }
        
        // Wait for fade-out animation to complete (300ms)
        setTimeout(() => {
            // Change image sources - they load instantly because they're preloaded
            if (shirtImageBase) {
                shirtImageBase.src = baseFilename;
                shirtImageBase.alt = `Unfolded shirt in ${colorCode}`;
                shirtImageBase.classList.remove('fade-out');
                shirtImageBase.classList.add('fade-in');
                
                // Remove fade-in class after animation completes to restore crossfade
                setTimeout(() => {
                    shirtImageBase.classList.remove('fade-in');
                }, 300);
            }
            
            if (shirtImageOverlay) {
                shirtImageOverlay.src = overlayFilename;
                shirtImageOverlay.alt = `Folded shirt in ${colorCode}`;
                shirtImageOverlay.classList.remove('fade-out');
                shirtImageOverlay.classList.add('fade-in');
                
                // Remove fade-in class after animation completes to restore crossfade
                setTimeout(() => {
                    shirtImageOverlay.classList.remove('fade-in');
                }, 300);
            }
            
            if (modelImage && modelFilename) {
                modelImage.src = modelFilename;
                modelImage.alt = `Model wearing ${colorCode}`;
                modelImage.classList.remove('fade-out');
                modelImage.classList.add('fade-in');
                
                // Remove fade-in class after animation completes
                setTimeout(() => {
                    modelImage.classList.remove('fade-in');
                }, 300);
            }
        }, 300);
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 400);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Load supporters from Google Sheets
    loadSupporters();
    
    // Product box click handlers
    const productBoxes = document.querySelectorAll('.product-box');
    productBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const boxType = this.getAttribute('data-box');
            openModal(boxType);
        });
    });
    
    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside content
    const modal = document.getElementById('modal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Contact form submission with mailto trigger
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Grab the form input values
            const userName = document.querySelector('input[name="name"]').value;
            const userEmail = document.querySelector('input[name="email"]').value;
            const userMessage = document.querySelector('textarea[name="message"]').value;
            
            // Construct the mailto URL with proper encoding
            const recipient = 'blindfestival67@gmail.com';
            const subject = encodeURIComponent(`Blind Festival Contact - ${userName}`);
            const body = encodeURIComponent(`${userMessage}\n\nFrom: ${userName}\nEmail: ${userEmail}`);
            const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
            
            // Trigger the email client
            window.location.href = mailtoLink;
            
            // Reset form after opening email client
            contactForm.reset();
        });
    }
    
    // ==========================================
    // DRAGGABLE HERO CONTENT BOX
    // ==========================================
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        // Make it look draggable
        heroContent.style.cursor = 'move';
        heroContent.style.position = 'absolute';
        heroContent.style.left = '50%';
        heroContent.style.top = '50%';
        heroContent.style.transform = 'translate(-50%, -50%)';
        
        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            
            if (e.target === heroContent || heroContent.contains(e.target)) {
                isDragging = true;
                heroContent.style.transition = 'none';
            }
        }
        
        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
        
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }
                
                xOffset = currentX;
                yOffset = currentY;
                
                setTranslate(currentX, currentY, heroContent);
            }
        }
        
        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate(calc(-50% + ${xPos}px), calc(-50% + ${yPos}px))`;
        }
        
        heroContent.addEventListener("mousedown", dragStart, false);
        heroContent.addEventListener("mouseup", dragEnd, false);
        heroContent.addEventListener("mousemove", drag, false);
        
        heroContent.addEventListener("touchstart", dragStart, false);
        heroContent.addEventListener("touchend", dragEnd, false);
        heroContent.addEventListener("touchmove", drag, false);
    }
    
    // ==========================================
    // FIXED SIZE FLOATING IMAGES (ZOOM-RESISTANT)
    // ==========================================
    
    function maintainFloatingImageSize() {
        const floatImages = document.querySelectorAll('.float-img');
        
        // Detect zoom level using window.devicePixelRatio
        // Note: This detects device pixel ratio, which changes with zoom in most browsers
        const zoom = Math.round(window.devicePixelRatio * 100) / 100;
        
        // If zoom is detected (not exactly 1), apply compensation
        if (zoom !== 1) {
            const inverseScale = 1 / zoom;
            
            floatImages.forEach(img => {
                // Apply inverse scale while preserving animation transforms
                // We set the scale as a CSS variable that animations can use
                img.style.setProperty('--zoom-compensation', inverseScale);
            });
        } else {
            floatImages.forEach(img => {
                img.style.setProperty('--zoom-compensation', 1);
            });
        }
    }
    
    // Run on load
    maintainFloatingImageSize();
    
    // Run on resize/zoom
    window.addEventListener('resize', maintainFloatingImageSize);
    
    // Monitor for zoom changes
    let lastZoom = window.devicePixelRatio;
    setInterval(() => {
        if (Math.abs(window.devicePixelRatio - lastZoom) > 0.01) {
            lastZoom = window.devicePixelRatio;
            maintainFloatingImageSize();
        }
    }, 100);
    
    // ==========================================
    // HERO CTA BUTTONS - SMOOTH SCROLL
    // ==========================================
    
    // View Your Box button - scroll to boxes section
    const viewBoxBtn = document.querySelector('.btn-primary');
    if (viewBoxBtn) {
        viewBoxBtn.addEventListener('click', function() {
            const boxesSection = document.getElementById('the-boxes');
            if (boxesSection) {
                boxesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Explore button - scroll to features section
    const exploreBtn = document.querySelector('.btn-outline');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

});
