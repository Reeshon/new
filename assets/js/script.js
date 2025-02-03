// ================================ SHOW NAVBAR ================================ //
const navMenu = document.getElementById("nav-menu");
const navClose = document.getElementById("nav-close");
const navToggle = document.getElementById("nav-toggle");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}
// ================================ SWIPER CATEGORIES ================================ //
let swiperCategories = new Swiper(".categories-container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    350: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 24,
    },
  },
});

// ================================ SWIPER PRODUCTS ================================ //

let swiperProducts = new Swiper(".new-container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    350: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 40,
    },
    1400: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  },
});

// ================================ PRODUCTS TAB ================================ //

const tabs = document.querySelectorAll("[data-target]");
const tabContents = document.querySelectorAll("[content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("active-tab");
    });
    target.classList.add("active-tab");

    tabs.forEach((tab) => {
      tab.classList.remove("active-tab");
    });
    tab.classList.add("active-tab");
  });
});

// ================================ IMAGE GALLERY ================================ //
function imgGallery() {
  const mainImg = document.querySelector(".detials-img"),
    smallImg = document.querySelectorAll(".detials-small-img");

  smallImg.forEach((img) => {
    img.addEventListener("click", function () {
      mainImg.src = this.src;
    });
  });
}
imgGallery();

// ================================ DETAILS TAB ================================ //
const detialTabs = document.querySelectorAll("[data-target]");
const detialContents = document.querySelectorAll("[content]");

detialTabs.forEach((detailTab) => {
  detailTab.addEventListener("click", () => {
    const target = document.querySelector(detailTab.dataset.target);
    detialContents.forEach((detialContent) => {
      detialContent.classList.remove("active-tab");
    });
    target.classList.add("active-tab");

    detialTabs.forEach((detailTab) => {
      detailTab.classList.remove("active-tab");
    });
    detailTab.classList.add("active-tab");
  });
});

// Get actual products from the page
function getProductsFromPage() {
  const productElements = document.querySelectorAll('.product-item');
  return Array.from(productElements).map(product => ({
    title: product.querySelector('.product-title').textContent.trim(),
    price: product.querySelector('.new-price').textContent.trim(),
    url: product.querySelector('.product-images').getAttribute('href'),
    image: {
      default: product.querySelector('.product-img.default').getAttribute('src'),
      hover: product.querySelector('.product-img.hover').getAttribute('src')
    },
    category: product.querySelector('.product-category').textContent.trim()
  }));
}

// Updated search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const suggestionsContainer = document.getElementById('searchSuggestions');
  const products = getProductsFromPage();

  if (!searchInput || !suggestionsContainer) return;

  searchInput.setAttribute('autocomplete', 'off');

  // Prevent default autocomplete behavior
  searchInput.addEventListener('focus', (e) => {
    e.preventDefault();
    e.stopPropagation();
    searchInput.setAttribute('autocomplete', 'off');
  }, true);

  function filterProducts(query) {
    if (!query) return [];
    
    query = query.toLowerCase();
    return products
      .filter(product => 
        product.title.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aStartsWith = a.title.toLowerCase().startsWith(query);
        const bStartsWith = b.title.toLowerCase().startsWith(query);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      })
      .slice(0, 6);
  }

  function renderSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(product => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.innerHTML = `
        <span>${product.title}</span>
      `;
      div.addEventListener('click', () => {
        // Store product details in sessionStorage before redirect
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = product.url;
      });
      suggestionsContainer.appendChild(div);
    });
  }

  let debounceTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const query = searchInput.value.trim();
      if (query.length > 0) {
        const suggestions = filterProducts(query);
        renderSuggestions(suggestions);
        suggestionsContainer.classList.add('active');
      } else {
        suggestionsContainer.classList.remove('active');
      }
    }, 300);
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.classList.remove('active');
      suggestionsContainer.innerHTML = ''; // Clear suggestions
    }
  });

  // Close suggestions on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      suggestionsContainer.classList.remove('active');
    }
  });

  // Add event listeners to cart buttons
  const cartButtons = document.querySelectorAll('.cart-btn');
  cartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      
      // Add visual feedback
      button.classList.add('clicked');
      
      // Remove visual feedback after a short delay
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 300); // 300ms delay, adjust as needed
      
      // Update the OpenCart path
      window.location.href = '../store/opencart/';
    });
  });
});

// Handle product details page
if (window.location.pathname.includes('details.html')) {
  const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct'));
  if (selectedProduct) {
    // Update details page with correct product information
    document.querySelector('.details-title').textContent = selectedProduct.title;
    document.querySelector('.details-price .new-price').textContent = selectedProduct.price;
    document.querySelector('.detials-img').src = selectedProduct.image.default;
    document.querySelectorAll('.detials-small-img').forEach((img, index) => {
      img.src = index === 0 ? selectedProduct.image.hover : selectedProduct.image.default;
    });
  }

  // Add event listener to the "Add to Cart" button on the details page
  const detailsCartButton = document.querySelector('.details-action .btn');
  if (detailsCartButton) {
    detailsCartButton.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      
      // Add visual feedback
      detailsCartButton.classList.add('clicked');
      
      // Remove visual feedback after a short delay
      setTimeout(() => {
        detailsCartButton.classList.remove('clicked');
      }, 300); // 300ms delay, adjust as needed
      
      // Add your cart functionality here
      
      // Optional: Show some feedback that item was added
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.textContent = parseInt(cartCount.textContent || '0') + 1;
      }

      // Optional: Show a temporary "Added to cart" message
      const addedMessage = document.createElement('div');
      addedMessage.textContent = 'Added to cart';
      addedMessage.style.position = 'fixed';
      addedMessage.style.top = '60px'; // Moved down to appear beneath the cart icon
      addedMessage.style.right = '20px';
      addedMessage.style.backgroundColor = 'var(--first-color)';
      addedMessage.style.color = 'var(--body-color)';
      addedMessage.style.padding = '10px';
      addedMessage.style.borderRadius = '5px';
      addedMessage.style.zIndex = '1000';
      document.body.appendChild(addedMessage);

      setTimeout(() => {
        addedMessage.remove();
      }, 1000); // Remove the message after 1 second
    });
  }
}

// Add zoom prevention code
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});
document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
});
document.addEventListener('gestureend', function (e) {
  e.preventDefault();
});