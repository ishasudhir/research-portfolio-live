// Load posts from localStorage
window.addEventListener("DOMContentLoaded", () => {
  loadPosts();
  setupFilters();
});

const form = document.getElementById("submission-form");
const entry = document.getElementById("entry");
const author = document.getElementById("author");
const category = document.getElementById("category");
const postsContainer = document.getElementById("posts");
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-category");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = entry.value.trim();
  const authorName = author.value.trim();
  const tag = category.value;
  if (content && authorName) {
    const post = {
      author: authorName,
      content: content,
      timestamp: new Date().toISOString(),
      category: tag
    };
    addPost(post);
    savePost(post);
    entry.value = "";
    author.value = "";
    category.value = "";
  }
});

function addPost(post, toStart = true) {
  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.setAttribute("data-category", post.category);

  const date = new Date(post.timestamp);
  const formattedDate = date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });

  postDiv.innerHTML = `
    <div class="post-meta">
      <strong>${post.author}</strong> <span class="post-date">— ${formattedDate}</span>
      <span class="post-tag">${post.category}</span>
    </div>
    <div class="post-content collapsed">${convertMarkdown(post.content)}</div>
    <button class="toggle-btn">Read More</button>
  `;

  postDiv.querySelector(".toggle-btn").addEventListener("click", () => {
    postDiv.querySelector(".post-content").classList.toggle("collapsed");
    postDiv.querySelector(".toggle-btn").textContent = postDiv.querySelector(".post-content").classList.contains("collapsed") ? "Read More" : "Show Less";
  });

  toStart ? postsContainer.prepend(postDiv) : postsContainer.appendChild(postDiv);
}

function savePost(post) {
  let posts = JSON.parse(localStorage.getItem("psychPosts")) || [];
  posts.push(post);
  localStorage.setItem("psychPosts", JSON.stringify(posts));
}

function loadPosts() {
  let posts = JSON.parse(localStorage.getItem("psychPosts")) || [];
  posts.reverse().forEach(post => addPost(post, false));
}

function convertMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/#+\s?(.*)/g, '<h3>$1</h3>');
}

function setupFilters() {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".post").forEach(post => {
      const text = post.querySelector(".post-content").textContent.toLowerCase();
      post.style.display = text.includes(query) ? "block" : "none";
    });
  });

  filterSelect.addEventListener("change", () => {
    const selected = filterSelect.value;
    document.querySelectorAll(".post").forEach(post => {
      const category = post.getAttribute("data-category");
      post.style.display = selected === "all" || selected === category ? "block" : "none";
    });
  });
}

// Calendar logic
const calendar = document.getElementById("calendar");
const eventDetails = document.getElementById("event-details");

const events = {
  "2025-06-25": "Podcast with Dr. Balliett",
  "2025-06-30": "Submission Deadline: Summer Research Proposals"
};

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendar.appendChild(blank);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.innerText = day;

    if (events[dateStr]) {
      dayDiv.classList.add("event-day");
    }

    dayDiv.addEventListener("click", () => {
      const event = events[dateStr];
      eventDetails.innerText = event ? `📌 ${event}` : "No events for this date.";
    });

    calendar.appendChild(dayDiv);
  }
}

renderCalendar();