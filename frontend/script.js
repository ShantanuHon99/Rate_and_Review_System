const apiBase = 'http://localhost:5000/api';
const productList = document.getElementById('product-list');
const reviewModal = document.getElementById('review-modal');
const reviewForm = document.getElementById('review-form');
const productInput = document.getElementById('product_id');
const closeModal = document.getElementById('close-modal');

async function loadProducts() {
  const res = await fetch(`${apiBase}/products`);
  const products = await res.json();

  productList.innerHTML = '';

  for (let product of products) {
    const reviewRes = await fetch(`${apiBase}/products/${product.id}`);
    const productData = await reviewRes.json();
    const reviews = productData.reviews;

    // Reviews 
    let reviewsHTML = '';
    if (reviews.length === 0) {
      reviewsHTML = `<p>No reviews yet.</p>`;
    } else {
      reviewsHTML = reviews.map(r => `
        <div class="review">
          <strong>${r.username}</strong> - ⭐ ${r.rating}<br/>
          <p>${r.review_text || ''}</p>
          ${r.photo_url ? `<img src="http://localhost:5000/uploads/${r.photo_url}" class="review-img"/>` : ''}
        </div>
      `).join('');
    }

    // Product Card
    const reviewSectionId = `reviews-${product.id}`;

        const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}" class="product-image" />
      <h3>${product.name}</h3>
      <p><strong>Price:</strong> ₹${product.price}</p>
      <p>${product.description}</p>
      <p>⭐ ${parseFloat(product.avg_rating || 0).toFixed(1)} (${product.review_count} reviews)</p>
      <button onclick="openReviewForm(${product.id})">Add Review</button>
      <button onclick="toggleReviews('${reviewSectionId}', this)">View Reviews</button>
      <div id="${reviewSectionId}" class="reviews hidden">
        <h4>Reviews:</h4>
        ${reviewsHTML}
      </div>
    `;

    productList.appendChild(card);
  }
}

// Review Form Toggle 
function openReviewForm(productId) {
  productInput.value = productId;
  reviewModal.classList.remove('hidden');
}
closeModal.onclick = () => reviewModal.classList.add('hidden');

reviewForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(reviewForm);
  const res = await fetch(`${apiBase}/reviews`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  alert(data.message || data.error);
  if (res.ok) {
    reviewModal.classList.add('hidden');
    reviewForm.reset();
    loadProducts();
  }
});

loadProducts();


// Reviwes Toggle
function toggleReviews(sectionId, button) {
  const section = document.getElementById(sectionId);
  if (section.classList.contains('hidden')) {
    section.classList.remove('hidden');
    button.textContent = 'Hide Reviews';
  } else {
    section.classList.add('hidden');
    button.textContent = 'View Reviews';
  }
}

// Load Tags
async function loadTags() {
  const res = await fetch(`${apiBase}/reviews/tags`);
  const data = await res.json();
  const tagDiv = document.getElementById('popular-tags');
  tagDiv.innerHTML = `<h4>Popular Tags:</h4> ${data.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}`;
}

loadTags();
