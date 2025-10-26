const criteria = [
  "Scholarship Accessibility",
  "Academic Quality",
  "Employment Opportunities",
  "Innovation & Modern Programs",
  "International Environment",
  "Research Activity",
  "Infrastructure & IT Support",
  "Sports & Campus Life",
  "Food & Dining Facilities",
  "Campus Environment"
];

let userRatings = {};
let schoolsData = [];

/* ============== LOAD CRITERIA ============== */
function loadCriteria() {
  const list = document.getElementById("criteria-list");
  list.innerHTML = "";

  criteria.forEach(name => {
    const row = document.createElement("div");
    row.className = "criteria-item";
    row.innerHTML = `
      <label>${name}</label>
      <div class="stars" data-name="${name}">
        ${[1,2,3,4,5].map(i => `<i class="fas fa-star star" data-value="${i}"></i>`).join("")}
      </div>
    `;
    list.appendChild(row);
  });

  setupStarRating();
}

function setupStarRating() {
  document.querySelectorAll(".stars").forEach(container => {
    const stars = container.querySelectorAll(".star");
    const name = container.dataset.name;

    stars.forEach(star => {
      star.onmouseenter = () => {
        const val = +star.dataset.value;
        fillStars(stars, val, "hovered");
      };
    });

    container.onmouseleave = () => {
      fillStars(stars, 0, "hovered");
    };

    stars.forEach(star => {
      star.onclick = () => {
        const val = +star.dataset.value;
        userRatings[name] = val;
        fillStars(stars, val, "selected");
      };
    });

    if (userRatings[name]) {
      fillStars(stars, userRatings[name], "selected");
    }
  });
}

function fillStars(stars, upTo, className) {
  stars.forEach(s => {
    const val = +s.dataset.value;
    if (val <= upTo) s.classList.add(className);
    else s.classList.remove(className);
  });
}

/* ============== CALCULATE SIMILARITY ============== */
function calculateSimilarity(school) {
  let totalDiff = 0;
  let maxDiff = 0;

  criteria.forEach(c => {
    const user = userRatings[c] || 0;
    const schoolRating = school[c] || 0;
    const diff = Math.abs(user - schoolRating);
    totalDiff += diff;
    maxDiff += 4; // max diff per criterion
  });

  const similarity = Math.round(((maxDiff - totalDiff) / maxDiff) * 100);
  return similarity;
}

/* ============== MENU ============== */
function toggleMenu() {
  document.getElementById("menu-overlay").classList.toggle("active");
}

function closeMenu() {
  document.getElementById("menu-overlay").classList.remove("active");
}

document.getElementById("menu-overlay").addEventListener("click", e => {
  if (e.target === e.currentTarget) closeMenu();
});

/* ============== FIND SCHOOLS ============== */
async function findSchools() {
  if (!schoolsData.length) {
    try {
      const res = await fetch("data/schools.json");
      schoolsData = await res.json();
    } catch (e) {
      alert("Error loading schools.json");
      return;
    }
  }

  const mustBeFive = Object.entries(userRatings)
    .filter(([_, v]) => v === 5)
    .map(([k]) => k);

  let matches = schoolsData.filter(school =>
    mustBeFive.every(c => school[c] === 5)
  );

  // Add similarity score
  matches = matches.map(school => ({
    ...school,
    similarity: calculateSimilarity(school)
  }));

  // Sort by similarity DESC
  matches.sort((a, b) => b.similarity - a.similarity);

  document.getElementById("criteria").style.display = "none";
  const results = document.getElementById("results");
  results.style.display = "block";
  results.scrollIntoView({ behavior: "smooth" });

  const list = document.getElementById("school-list");
  list.innerHTML = "";

  if (matches.length === 0) {
    list.innerHTML = "<p>No schools match your 5-star criteria.</p>";
    return;
  }

  matches.forEach((school, index) => {
    const schoolDiv = document.createElement("div");
    schoolDiv.className = "school-item";
    schoolDiv.innerHTML = `
      <div class="school-header" onclick="toggleSchoolDetails(${index})">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <h3>${school.School}</h3>
          <span class="similarity-badge">${school.similarity}% Match</span>
        </div>
        <i class="fas fa-chevron-down arrow"></i>
      </div>
      <div class="school-details" id="details-${index}">
        <div class="ratings-grid">
          ${criteria.map(c => `
            <div class="rating-row">
              <span>${c}</span>
              <div class="school-stars">
                ${renderStars(school[c])}
              </div>
            </div>
          `).join("")}
        </div>
        <p class="total-score"><strong>Similarity Score:</strong> ${school.similarity}%</p>
      </div>
    `;
    list.appendChild(schoolDiv);
  });
}

/* ============== EXPAND / COLLAPSE ============== */
function toggleSchoolDetails(index) {
  const details = document.getElementById(`details-${index}`);
  const arrow = details.previousElementSibling.querySelector(".arrow");
  details.classList.toggle("open");
  arrow.classList.toggle("rotated");
}

function renderStars(rating) {
  return Array(5).fill(0).map((_, i) => {
    const filled = i < rating;
    return `<i class="fas fa-star ${filled ? 'filled' : ''}"></i>`;
  }).join("");
}

/* ============== NAVIGATION ============== */
function goBack() {
  document.getElementById("results").style.display = "none";
  document.getElementById("criteria").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetAll() {
  userRatings = {};
  schoolsData = [];
  document.getElementById("results").style.display = "none";
  document.getElementById("criteria").style.display = "block";
  loadCriteria();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============== INIT ============== */
document.addEventListener("DOMContentLoaded", () => {
  loadCriteria();
});
