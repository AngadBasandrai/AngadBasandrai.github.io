function show(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  if (id === 'blogs') loadBlogs();
  if (window.innerWidth <= 640) toggleSidebar(false);
}

function toggleTheme() {
  const light = document.body.classList.toggle('light');
  document.getElementById('toggle-btn').textContent = light ? '[ dark mode ]' : '[ light mode ]';
}

function toggleSidebar(force) {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen = force !== undefined ? force : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', isOpen);
  overlay.classList.toggle('open', isOpen);
}

const BLOG_INDEX = [
  {
    slug: "tune-ai",
    title: "tune.ai",
    date: "June 2026",
    excerpt: "Using PPO to fine-tune a small LLM to reformat messy restaurant orders. What worked, what didn't, and why the reward model is the whole game."
  }
];

let blogsLoaded = false;

function loadBlogs() {
  if (blogsLoaded) return;
  blogsLoaded = true;

  const container = document.getElementById('blog-list-container');
  container.innerHTML = '';

  if (BLOG_INDEX.length === 0) {
    container.innerHTML = '<div class="blog-loading">no posts yet.</div>';
    return;
  }

  BLOG_INDEX.forEach(post => {
    const item = document.createElement('div');
    item.className = 'blog-list-item';
    item.innerHTML = `
      <div class="entry-title">${post.title}</div>
      <div class="entry-sub">${post.date}</div>
      <div class="blog-excerpt">${post.excerpt}</div>
    `;
    item.addEventListener('click', () => {
      window.location.href = `blogs/${post.slug}.html`;
    });
    container.appendChild(item);
  });
}