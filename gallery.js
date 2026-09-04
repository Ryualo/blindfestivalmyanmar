// ========================================
// DYNAMIC GALLERY - COMPLETE OVERHAUL
// Left-to-Right Grid + Bulletproof Fallbacks + Load All + Lightbox
// ========================================

// Configuration
const totalPhotos = 10; // Total number of photos in assets/dedications/
let currentlyShowing = 4; // Start by showing 4 photos
let currentLightboxIndex = 0; // Track current image in lightbox for navigation

// DOM Elements
const gridContainer = document.getElementById('dedications-grid');
const seeMoreBtn = document.getElementById('see-more-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxOverlay = document.querySelector('.lightbox-overlay');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// ========================================
// RENDER GALLERY WITH WRAPPER STRUCTURE
// ========================================
function renderGallery(startIndex, endIndex) {
    for (let i = startIndex; i <= endIndex && i <= totalPhotos; i++) {
        // Create wrapper: <div class="dedication-item">
        const wrapper = document.createElement('div');
        wrapper.className = 'dedication-item';
        
        // Create fallback text (always present, shows if image fails)
        const fallbackText = document.createElement('div');
        fallbackText.className = 'fallback-text';
        fallbackText.textContent = 'Coming soon';
        
        // Create image element (overlays fallback with z-index: 2)
        const img = document.createElement('img');
        img.src = `${i}.jpg`;
        img.alt = `Student Dedication ${i}`;
        img.className = 'dedication-img';
        img.loading = 'lazy'; // Performance optimization
        
        // Error handling: If image fails to load, hide it (fallback becomes visible)
        img.onerror = function() {
            this.style.display = 'none'; // Hide broken image, fallback text shows through
        };
        
        // Add click listener to open lightbox (only if image loaded successfully)
        img.addEventListener('click', function() {
            if (this.style.display !== 'none') {
                openLightbox(this.src, this.alt);
            }
        });
        
        // Success handler: Add cursor pointer when image loads
        img.addEventListener('load', function() {
            this.style.cursor = 'pointer';
        });
        
        // Append fallback text first (background layer)
        wrapper.appendChild(fallbackText);
        
        // Append image on top (foreground layer, z-index: 2)
        wrapper.appendChild(img);
        
        // Append wrapper to grid
        gridContainer.appendChild(wrapper);
    }
}

// ========================================
// LOAD ALL REMAINING PHOTOS AT ONCE
// ========================================
function loadAllPhotos() {
    // Calculate remaining photos
    const startIndex = currentlyShowing + 1;
    const endIndex = totalPhotos;
    
    // Load ALL remaining photos at once (5 through 50)
    renderGallery(startIndex, endIndex);
    
    // Update current count
    currentlyShowing = totalPhotos;
    
    // Permanently hide "See More" button
    seeMoreBtn.style.display = 'none';
}

// ========================================
// LIGHTBOX FUNCTIONS
// ========================================
function openLightbox(imageSrc, imageAlt) {
    // Extract image number from src (e.g., "1.jpg" -> 1)
    const matches = imageSrc.match(/(\d+)\.jpg/);
    if (matches) {
        currentLightboxIndex = parseInt(matches[1]);
    }
    
    lightboxImg.src = imageSrc;
    lightboxImg.alt = imageAlt;
    lightbox.classList.remove('lightbox-hidden');
    lightbox.classList.add('lightbox-visible');
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('lightbox-visible');
    lightbox.classList.add('lightbox-hidden');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear image src after animation
    setTimeout(() => {
        lightboxImg.src = '';
    }, 300);
}

// ========================================
// LIGHTBOX NAVIGATION FUNCTIONS
// ========================================
function nextImage() {
    currentLightboxIndex++;
    if (currentLightboxIndex > totalPhotos) {
        currentLightboxIndex = 1; // Loop back to first image
    }
    updateLightboxImage();
}

function prevImage() {
    currentLightboxIndex--;
    if (currentLightboxIndex < 1) {
        currentLightboxIndex = totalPhotos; // Loop to last image
    }
    updateLightboxImage();
}

function updateLightboxImage() {
    lightboxImg.src = `${currentLightboxIndex}.jpg`;
    lightboxImg.alt = `Student Dedication ${currentLightboxIndex}`;
}

// ========================================
// EVENT LISTENERS
// ========================================

// "See More" button click - Load ALL remaining photos
seeMoreBtn.addEventListener('click', loadAllPhotos);

// Lightbox close button
lightboxClose.addEventListener('click', closeLightbox);

// Lightbox overlay click (close on background click)
lightboxOverlay.addEventListener('click', closeLightbox);

// Lightbox navigation buttons
lightboxPrev.addEventListener('click', prevImage);
lightboxNext.addEventListener('click', nextImage);

// Keyboard support: Arrow keys for navigation, Escape to close
document.addEventListener('keydown', function(e) {
    if (lightbox.classList.contains('lightbox-visible')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    }
});

// ========================================
// INITIALIZE GALLERY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Render initial 4 photos
    renderGallery(1, currentlyShowing);
    
    console.log('Gallery initialized: Showing 4 photos. Click "See More" to load all 50.');
});
