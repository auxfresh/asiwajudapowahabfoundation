const searchInput = document.getElementById("searchInput");
const postsContainer = document.getElementById("posts");

let allPosts = [];

/* Auto truncate based on screen size */
function getLimit() {
  return window.innerWidth < 600 ? 120 : 260;
}

/* Format date/time */
function formatDate(timestamp) {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date.toLocaleDateString(undefined, options)} • ${time}`;
}

/* ===============================
   FIREBASE LISTENER
   =============================== */
db.collection("posts")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    allPosts = [];

    snapshot.forEach(doc => {
      allPosts.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort featured posts first
    allPosts.sort((a, b) => (b.featured === true) - (a.featured === true));

    renderPosts(allPosts);
  });

/* ===============================
   RENDER POSTS FUNCTION
   =============================== */
function renderPosts(posts) {
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    postsContainer.innerHTML = "<p style='text-align:center'>No posts found</p>";
    return;
  }

  posts.forEach(data => {
    const postId = data.id;

    const limit = getLimit();
    const fullText = data.description || "";
    const shortText =
      fullText.length > limit
        ? fullText.substring(0, limit) + "..."
        : fullText;

    let expanded = false;
    let index = 0;

    const post = document.createElement("div");
    post.className = "post";

    /* ===== FEATURED LABEL ===== */
    if (data.featured) {
      post.style.border = "2px solid #ff6b6b";

      const featuredLabel = document.createElement("span");
      featuredLabel.innerHTML = `<i class="fa-solid fa-star"></i> FEATURED`;
      featuredLabel.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: #ff6b6b;
        color: #fff;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: bold;
        border-radius: 12px;
        margin-bottom: 6px;
      `;
      post.appendChild(featuredLabel);
    }

    /* -------- MEDIA CAROUSEL (IMAGE + VIDEO) -------- */
    let mediaHTML = "";

    if (data.media && data.media.length) {
      const first = data.media[0];

      mediaHTML = `
        <div class="carousel">
          ${
            first.type === "video"
              ? `<video class="carousel-media" controls src="${first.url}"></video>`
              : `<img class="carousel-media" src="${first.url}">`
          }
          ${
            data.media.length > 1
              ? `<button class="prev">‹</button>
                 <button class="next">›</button>`
              : ""
          }
        </div>
      `;
    }

    post.innerHTML += `
      ${mediaHTML}

      <span class="tag" style="background:${data.tagColor || "#333"}">
        ${data.tag || ""}
      </span>

      <h3>${data.title || ""}</h3>
      <p class="post-date">${formatDate(data.createdAt)}</p>

      <p class="desc">${shortText}</p>
      ${
        fullText.length > limit
          ? `<span class="read-more">Read more</span>`
          : ""
      }

      <div class="like-btn">
        <i class="fa-solid fa-heart"></i>
        <span class="like-count">${data.likes || 0}</span>
      </div>
    `;

    /* -------- READ MORE -------- */
    if (fullText.length > limit) {
      const btn = post.querySelector(".read-more");
      const desc = post.querySelector(".desc");

      btn.onclick = () => {
        expanded = !expanded;
        desc.textContent = expanded ? fullText : shortText;
        btn.textContent = expanded ? "Read less" : "Read more";
      };
    }

    /* -------- CAROUSEL LOGIC -------- */
    if (data.media && data.media.length > 1) {
      const prev = post.querySelector(".prev");
      const next = post.querySelector(".next");
      const container = post.querySelector(".carousel");

      function renderMedia(i) {
        const m = data.media[i];
        container.querySelector(".carousel-media").remove();

        let el;
        if (m.type === "video") {
          el = document.createElement("video");
          el.src = m.url;
          el.controls = true;
        } else {
          el = document.createElement("img");
          el.src = m.url;
        }

        el.className = "carousel-media";
        container.insertBefore(el, prev);
      }

      prev.onclick = () => {
        index = (index - 1 + data.media.length) % data.media.length;
        renderMedia(index);
      };

      next.onclick = () => {
        index = (index + 1) % data.media.length;
        renderMedia(index);
      };
    }

    /* -------- LIKES -------- */
    const likeBtn = post.querySelector(".like-btn");
    likeBtn.onclick = () => {
      db.collection("posts")
        .doc(postId)
        .update({
          likes: firebase.firestore.FieldValue.increment(1)
        });
    };

    postsContainer.appendChild(post);
  });
}

/* ===============================
   SEARCH WITH SUGGESTIONS
   =============================== */
if (searchInput) {
  // Create suggestions container
  const suggestions = document.createElement("div");
  suggestions.id = "autocompleteList";
  suggestions.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ccc;
    z-index: 9999;
    max-height: 200px;
    overflow-y: auto;
    display: none;
  `;
  searchInput.parentNode.style.position = "relative";
  searchInput.parentNode.appendChild(suggestions);

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase().trim();
    suggestions.innerHTML = "";

    if (!term) {
      renderPosts(allPosts);
      suggestions.style.display = "none";
      return;
    }

    const filtered = allPosts.filter(post =>
      post.title && post.title.toLowerCase().includes(term)
    );

    renderPosts(filtered);

    filtered.forEach(post => {
      const item = document.createElement("div");
      item.textContent = post.title;
      item.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
      `;
      item.addEventListener("click", () => {
        searchInput.value = post.title;
        suggestions.innerHTML = "";
        suggestions.style.display = "none";
        renderPosts([post]);
      });
      suggestions.appendChild(item);
    });

    suggestions.style.display = filtered.length ? "block" : "none";
  });

  document.addEventListener("click", e => {
    if (e.target !== searchInput) suggestions.innerHTML = "";
  });
}

/* ===============================
   BACK TO TOP BUTTON
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;

  window.addEventListener("scroll", () => {
    if (
      document.documentElement.scrollTop > 300 ||
      document.body.scrollTop > 300
    ) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
/* ===============================
   YEAR DROPDOWN FILTER (ADDITION ONLY)
   =============================== */

const yearFilter = document.getElementById("yearFilter");
let selectedYear = "all";

/* Populate years after posts load */
function populateYearDropdown() {
  if (!yearFilter) return;

  const years = new Set();

  allPosts.forEach(post => {
    if (!post.createdAt) return;
    const date = post.createdAt.toDate
      ? post.createdAt.toDate()
      : new Date(post.createdAt);
    years.add(date.getFullYear());
  });

  yearFilter.innerHTML = `<option value="all">All years</option>`;

  [...years]
    .sort((a, b) => b - a)
    .forEach(year => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.textContent = year;
      yearFilter.appendChild(opt);
    });
}

/* Apply year filter WITHOUT touching search */
function filterByYear(posts) {
  if (selectedYear === "all") return posts;

  return posts.filter(post => {
    if (!post.createdAt) return false;
    const date = post.createdAt.toDate
      ? post.createdAt.toDate()
      : new Date(post.createdAt);
    return date.getFullYear().toString() === selectedYear;
  });
}

/* Hook into dropdown */
if (yearFilter) {
  yearFilter.addEventListener("change", () => {
    selectedYear = yearFilter.value;

    const visiblePosts = filterByYear(allPosts);
    renderPosts(visiblePosts);
  });
}

/* Hook into Firebase load WITHOUT altering existing logic */
const originalOnSnapshot = db.collection("posts")
  .orderBy("createdAt", "desc")
  .onSnapshot;

db.collection("posts")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    populateYearDropdown();
  });
