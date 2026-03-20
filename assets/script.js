let cart = [];

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});

// Cart Logic
function openCart() {
    document.getElementById('CartDrawer').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCart();
}

function closeCart() {
    document.getElementById('CartDrawer').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function addToCart(name, price, image) {
    cart.push({ name, price, image });
    updateCartCount();
    openCart();
}

function updateCartCount() {
    const btns = document.querySelectorAll('.icon-btn');
    btns.forEach(btn => {
        if (btn.innerText.includes('SHOPPING BAG')) {
            btn.innerText = `SHOPPING BAG (${cart.length})`;
        }
    });
}

function renderCart() {
    const container = document.getElementById('CartContent');
    const totalEl = document.getElementById('CartTotal');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your shopping bag is empty.</p>';
        totalEl.innerText = '0.00 USD';
        return;
    }

    let html = '<ul class="cart-items">';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <li class="cart-item">
                <div class="cart-item__image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item__info">
                    <span class="cart-item__name">${item.name}</span>
                    <span class="cart-item__price">${item.price.toFixed(2)} USD</span>
                    <button onclick="removeFromCart(${index})" class="remove-btn">REMOVE</button>
                </div>
            </li>
        `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
    totalEl.innerText = `${total.toFixed(2)} USD`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

// Search Logic
function openSearch() {
    document.getElementById('SearchModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSearch() {
    document.getElementById('SearchModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Menu Logic
function toggleMenu() {
    const menu = document.getElementById('SideMenu');
    const btn = document.getElementById('MenuToggle');
    menu.classList.toggle('active');
    btn.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close overlays on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        closeSearch();
        closeQuickView();
        document.getElementById('SideMenu').classList.remove('active');
        document.getElementById('MenuToggle').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
// Intersection Observer for Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    // Page Load Entrance
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal slowly
    const revealElements = document.querySelectorAll('.product-card, .black-series-intro__hero-content, .grey-ino-hero__content, .olive-series-intro__hero-content, .product-grid, .reveal-item, .footer-grid__col, .footer-signature');
    revealElements.forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });

    const campaignObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.black-series-intro__item, .olive-series-intro__item, .footer-logo-massive').forEach(item => {
        campaignObserver.observe(item);
    });
});

// QuickView Logic
function openQuickView(title, price, image, description, additional, bgColor, textColor) {
    const qv = document.getElementById('QuickView');
    const qv_modal = qv.querySelector('.quickview');
    const subtitles = qv_modal.querySelectorAll('h4');
    const closeBtn = qv_modal.querySelector('.close-btn');
    const addBtn = document.getElementById('qv-add-btn');
    
    // Set dynamic colors
    if (bgColor) qv_modal.style.backgroundColor = bgColor;
    if (textColor) {
        qv_modal.style.color = textColor;
        closeBtn.style.color = textColor;
        
        // Handle dark/light subtitles
        subtitles.forEach(h4 => {
            h4.style.color = (textColor === '#ffffff') ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
        });

        // Handle dynamic button theme
        if (textColor === '#ffffff') {
            addBtn.style.backgroundColor = '#ffffff';
            addBtn.style.color = '#000000';
        } else {
            addBtn.style.backgroundColor = '#000000';
            addBtn.style.color = '#ffffff';
        }
    }
    
    document.getElementById('qv-title').innerText = title;
    document.getElementById('qv-price').innerText = price;
    const qvImg = document.getElementById('qv-image');
    qvImg.src = image;
    
    // Apply mix-blend-mode ONLY for light backgrounds
    if (textColor === '#000000') {
        qvImg.style.mixBlendMode = 'multiply';
    } else {
        qvImg.style.mixBlendMode = 'normal';
    }

    document.getElementById('qv-description').innerText = description;
    document.getElementById('qv-additional').innerText = additional;
    
    // Update Add to Bag button action
    const numericPrice = parseFloat(price.replace(' USD', ''));
    addBtn.setAttribute('onclick', `addToCart('${title}', ${numericPrice}, '${image}'); closeQuickView();`);

    qv.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    document.getElementById('QuickView').classList.remove('active');
    if (!document.getElementById('SideMenu').classList.contains('active') && 
        !document.getElementById('CartDrawer').classList.contains('active') &&
        !document.getElementById('SearchModal').classList.contains('active')) {
        document.body.style.overflow = 'auto';
    }
}



/* Carousel Logic */
let currentCarouselSlide = 0;
const totalSlides = 3;

function moveCarousel(direction) {
    const carouselContainer = document.getElementById('GreyCarousel');
    const dots = document.querySelectorAll('#CarouselDots .dot');
    
    currentCarouselSlide = (currentCarouselSlide + direction + totalSlides) % totalSlides;
    
    // Update Slider Position
    const offset = -(currentCarouselSlide * (100 / totalSlides));
    carouselContainer.style.transform = "translateX(" + offset + "%)";
    
    // Update Dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCarouselSlide);
    });
}

// Initial positioning on page load
window.addEventListener('load', () => {
    moveCarousel(0); // Set initial state
});

/* Olive Series Horizontal Scroll Logic */
function scrollOlive(direction) {
    const container = document.getElementById('OliveCarousel');
    const scrollAmount = 440; // Approx width of one item + gap
    
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

/* Side Menu Anchor Intercept */
document.querySelectorAll('.main-nav-fest a').forEach(link => {
    link.addEventListener('click', () => {
        // Ensure menu closes and body scroll is restored
        const menu = document.getElementById('SideMenu');
        const btn = document.getElementById('MenuToggle');
        menu.classList.remove('active');
        btn.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

/* Dynamic Global Search Logic */
const STORE_COLLECTION = [
    // Black Series
    { type: 'product', title: 'STRUCTURED WOOL BLAZER', price: '129.00 USD', img: 'img/pro 1.png', section: 'black-campaign', collection: 'Black Series' },
    { type: 'product', title: 'OVERSIZED FELT COAT', price: '259.00 USD', img: 'img/pro 2.png', section: 'black-campaign', collection: 'Black Series' },
    { type: 'product', title: 'CRINKLED LEATHER TRENCH', price: '399.00 USD', img: 'img/pro 3.png', section: 'black-campaign', collection: 'Black Series' },
    // Grey Series
    { type: 'product', title: 'MINIMALIST GREY JACKET', price: '229.00 USD', img: 'img/grey_ino_product_img_1.png', section: 'grey-campaign', collection: 'Grey Series' },
    // Olive Series
    { type: 'product', title: 'OLIVE STRUCTURED BLAZER', price: '149.00 USD', img: 'img/olive brown product img 1.png', section: 'olive-campaign', collection: 'Olive Series' },
    // Page Sections (for 'all' searches)
    { type: 'page', title: 'THE BLACK SERIES', section: 'black-series-section', url: 'index.html#black-series-section' },
    { type: 'page', title: 'THE GREY SERIES', section: 'grey-series-section', url: 'index.html#grey-series-section' },
    { type: 'page', title: 'THE OLIVE SERIES', section: 'olive-series-section', url: 'index.html#olive-series-section' },
    { type: 'page', title: 'BRAND JOURNAL', url: 'journal.html' },
    { type: 'page', title: 'BRAND ATELIER', url: 'atelier.html' },
    { type: 'page', title: 'BOUTIQUES & STORES', url: 'stores.html' }
];

function performSearch(query) {
    const resultsContainer = document.getElementById('SearchResults');
    if (!query || query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }

    const filtered = STORE_COLLECTION.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        (item.collection && item.collection.toLowerCase().includes(query.toLowerCase()))
    );

    if (filtered.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No matches found for "' + query + '"</p>';
        return;
    }

    let html = '';
    filtered.forEach(item => {
        const targetUrl = item.url ? item.url : `index.html#${item.section}`;
        if (item.type === 'product') {
            html += `
                <div class="search-result-item" onclick="closeSearch(); window.location.href='${targetUrl}'">
                    <img src="${item.img}" class="search-result-thumb">
                    <div class="search-result-info">
                        <span class="search-result-tag">${item.collection}</span>
                        <h4>${item.title}</h4>
                        <p>${item.price}</p>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="search-result-item search-result-item--page" onclick="closeSearch(); window.location.href='${targetUrl}'">
                    <div class="search-result-info">
                        <span class="search-result-tag">PAGE SECTION</span>
                        <h4>${item.title}</h4>
                    </div>
                </div>
            `;
        }
    });

    resultsContainer.innerHTML = html;
}
