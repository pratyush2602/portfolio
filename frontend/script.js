// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const closeChat = document.querySelector('.close-chat');
const chatInput = document.querySelector('.chat-input input');
const chatSend = document.querySelector('.chat-input button');
const chatMessages = document.querySelector('.chat-messages');
const contactForm = document.getElementById('contact-form');

// Project Data
const projects = [
    {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform with real-time inventory management.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Redux'],
        image: 'assets/images/project1.jpg',
        link: 'https://github.com/yourusername/project1'
    },
    {
        title: 'AI Chat Application',
        description: 'Real-time chat application with AI-powered responses.',
        technologies: ['Python', 'Flask', 'TensorFlow', 'WebSocket'],
        image: 'assets/images/project2.jpg',
        link: 'https://github.com/yourusername/project2'
    },
    {
        title: 'Portfolio Website',
        description: 'Personal portfolio website with dark mode and chatbot integration.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'API Integration'],
        image: 'assets/images/project3.jpg',
        link: 'https://github.com/yourusername/project3'
    }
];

// Skills Data
const skills = [
    { name: 'JavaScript', level: 90 },
    { name: 'Python', level: 85 },
    { name: 'React', level: 88 },
    { name: 'Node.js', level: 82 },
    { name: 'HTML/CSS', level: 95 },
    { name: 'SQL', level: 80 },
    { name: 'Git', level: 85 },
    { name: 'Docker', level: 75 }
];

// Theme Toggle Functionality
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    // Save preference to localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
});

// Mobile Menu Toggle
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking
            navLinks.classList.remove('active');
        }
    });
});

// Render Projects
function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-aos="fade-up">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <a href="${project.link}" target="_blank" class="cta-button">View Project</a>
            </div>
        </div>
    `).join('');
}

// Render Skills
function renderSkills() {
    const skillsGrid = document.querySelector('.skills-grid');
    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card" data-aos="fade-up">
            <h3>${skill.name}</h3>
            <div class="skill-bar-container">
                <div class="skill-bar" style="width: ${skill.level}%">
                    <span class="skill-level">${skill.level}%</span>
                </div>
            </div>
        </div>
    `).join('');
}


// Chatbot Functionality
chatbotToggle.addEventListener('click', async () => {
    chatbotContainer.style.display = 'block';
    chatbotToggle.style.display = 'none';

    // Start a new chat session
    try {
        const response = await fetch('/api/chat/start', { // Match FastAPI endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Failed to start session');

        const data = await response.json();
        sessionId = data.session_id; // Store session ID for future use
        console.log('Session ID:', sessionId); 
    } catch (error) {
        console.error('Error starting session:', error);
        addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot');
    }
});

closeChat.addEventListener('click', () => {
    chatbotContainer.style.display = 'none';
    chatbotToggle.style.display = 'block';
});

// Add message to chat
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle chat input
async function handleChatSubmit(message) {
    if (!message.trim()) return;

    addMessage(message, 'user');
    chatInput.value = '';

    // Show the typing indicator
    const typingIndicator = document.querySelector('.typing-indicator');
    typingIndicator.style.display = 'flex';

    try {
        console.log('Session ID:', sessionId); // Debug log
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                messages: [{ role: 'user', content: message }]
            })
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            throw new Error('Failed to get response');
        }

        const data = await response.json();
        addMessage(data.response, 'bot');
    } catch (error) {
        console.error('Chat error:', error);
        addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot');
    } finally {
        // Hide the typing indicator once the response is received
        typingIndicator.style.display = 'none';
    }
}

// Chat input handlers
chatSend.addEventListener('click', () => handleChatSubmit(chatInput.value));
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSubmit(chatInput.value);
});
