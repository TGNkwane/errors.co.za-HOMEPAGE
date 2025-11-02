// Blog functionality
const blogPostsContainer = document.getElementById('blog-posts');
const yearSpan = document.getElementById('year');

// Set current year in footer
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Fallback mock data for when JSON file doesn't exist
const mockBlogPosts = [
    {
        id: 1,
        title: "Mastering Java Generics in JDK 25",
        date: "2024-11-02",
        excerpt: "A comprehensive guide to Java Generics, covering type parameters, bounded types, wildcards, and best practices for writing type-safe code in modern Java.",
        image: "images/background_blue_sky.jpg",
        tags: ["java", "generics", "jdk25"],
        url: "#blog"
    },
    {
        id: 2,
        title: "Java Comparator: Sorting Made Simple",
        date: "2024-10-28",
        excerpt: "Deep dive into the Comparator interface in Java. Learn how to create custom sorting logic, use lambda expressions, and leverage method references for cleaner code.",
        tags: ["java", "comparator", "collections"],
        url: "#blog"
    },
    {
        id: 3,
        title: "Java Streams API: Power of Functional Programming",
        date: "2024-10-15",
        excerpt: "Unlock the full potential of Java Streams in JDK 25. Explore filtering, mapping, reducing, and parallel processing for efficient data manipulation.",
        tags: ["java", "streams", "jdk25"],
        url: "#blog"
    }
];

// Load blog posts from JSON file or use fallback data
async function loadBlogPosts() {
    try {
        const response = await fetch('data/blog-posts.json');
        if (!response.ok) {
            throw new Error('Using fallback data');
        }
        const posts = await response.json();
        displayBlogPosts(posts);
    } catch (error) {
        console.log('Using mock blog posts data');
        // Use mock data instead of showing error
        displayBlogPosts(mockBlogPosts);
    }
}

// Display blog posts on the page
function displayBlogPosts(posts) {
    if (!posts || posts.length === 0) {
        blogPostsContainer.innerHTML = `
            <div class="no-posts">
                <p>No blog posts available yet. Check back soon!</p>
            </div>
        `;
        return;
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create HTML for each post
    const postsHTML = posts.map(post => `
        <article class="blog-card">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-image">` : '<div class="blog-image"></div>'}
            <div class="blog-content">
                <div class="blog-date">${formatDate(post.date)}</div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <span class="read-more">Coming soon</span>
            </div>
        </article>
    `).join('');

    blogPostsContainer.innerHTML = postsHTML;
}

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Offset for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.style.color = '';
            });
            navLink.style.color = 'var(--primary-color)';
        }
    });
});

// Initialize
loadBlogPosts();