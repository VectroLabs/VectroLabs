// VectroLabs Website JavaScript
// Handles dynamic content loading, animations, and form submissions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather Icons
    feather.replace();
    
    // Initialize all functionality
    initMobileMenu();
    initScrollAnimations();
    initSmoothScrolling();
    loadTeamData();
    loadProjectsData();
    initWelcomeMessage();
    // initContactForm(); // Temporarily disabled
});

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 80; // Account for fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Load and display team member data from JSON
 */
async function loadTeamData() {
    const container = document.getElementById('team-container');
    
    try {
        const response = await fetch('team/team-data.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load team data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.team || !Array.isArray(data.team)) {
            throw new Error('Invalid team data format');
        }
        
        // Clear loading state
        container.innerHTML = '';
        
        if (data.team.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No team members available at this time.</p>
                </div>
            `;
            return;
        }
        
        // Generate team member cards (limit to 4 for homepage preview)
        const teamToShow = window.location.pathname.includes('team') ? data.team : data.team.slice(0, 4);
        teamToShow.forEach((member, index) => {
            const memberCard = createTeamMemberCard(member, index);
            container.appendChild(memberCard);
        });
        
        // Re-initialize animations for new elements
        const newFadeElements = container.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        newFadeElements.forEach(el => observer.observe(el));
        
    } catch (error) {
        console.error('Error loading team data:', error);
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-red-500 mb-4">
                    <i data-feather="alert-circle" class="w-8 h-8 mx-auto mb-2"></i>
                </div>
                <p class="text-gray-600 text-lg">Unable to load team information.</p>
                <p class="text-sm text-gray-500 mt-2">Error: ${error.message}</p>
            </div>
        `;
        feather.replace();
    }
}

/**
 * Create a team member card element
 */
function createTeamMemberCard(member, index) {
    const card = document.createElement('div');
    card.className = 'group card-hover bg-white rounded-2xl p-8 text-center shadow-lg border border-neutral/20 fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Validate required fields
    const name = member.name || 'Unknown';
    const role = member.role || 'Team Member';
    const bio = member.bio || 'No bio available.';
    const avatar = member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4C6EF5&color=ffffff&size=128`;
    
    card.innerHTML = `
        <div class="relative mb-6">
            <div class="w-32 h-32 rounded-2xl mx-auto overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-1">
                <img src="${avatar}" 
                     alt="${name}" 
                     class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4C6EF5&color=ffffff&size=128'">
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full border-4 border-white flex items-center justify-center">
                <i data-feather="check" class="w-4 h-4 text-white"></i>
            </div>
        </div>
        <h3 class="text-2xl font-bold mb-2 text-text-main">${escapeHtml(name)}</h3>
        <p class="text-primary font-semibold mb-4">${escapeHtml(role)}</p>
        <p class="text-text-secondary text-sm leading-relaxed mb-6">${escapeHtml(bio)}</p>
        ${member.social ? createSocialLinks(member.social) : ''}
    `;
    
    return card;
}

/**
 * Create social media links for team members
 */
function createSocialLinks(social) {
    const links = [];
    
    if (social.github) {
        links.push(`<a href="${escapeHtml(social.github)}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-primary transition-colors"><i data-feather="github" class="w-4 h-4"></i></a>`);
    }
    if (social.linkedin) {
        links.push(`<a href="${escapeHtml(social.linkedin)}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-primary transition-colors"><i data-feather="linkedin" class="w-4 h-4"></i></a>`);
    }
    if (social.twitter) {
        links.push(`<a href="${escapeHtml(social.twitter)}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-primary transition-colors"><i data-feather="twitter" class="w-4 h-4"></i></a>`);
    }
    
    if (links.length > 0) {
        return `
            <div class="flex justify-center space-x-3 mt-4">
                ${links.join('')}
            </div>
        `;
    }
    
    return '';
}

/**
 * Load and display project data from JSON
 */
async function loadProjectsData() {
    const container = document.getElementById('projects-container');
    
    try {
        const response = await fetch('projects/projects-data.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load projects data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.projects || !Array.isArray(data.projects)) {
            throw new Error('Invalid projects data format');
        }
        
        // Clear loading state
        container.innerHTML = '';
        
        if (data.projects.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No projects available at this time.</p>
                </div>
            `;
            return;
        }
        
        // Generate project cards (limit to 6 for homepage preview)
        const projectsToShow = window.location.pathname.includes('projects') ? data.projects : data.projects.slice(0, 6);
        projectsToShow.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            container.appendChild(projectCard);
        });
        
        // Re-initialize animations for new elements
        const newFadeElements = container.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        newFadeElements.forEach(el => observer.observe(el));
        
        // Re-initialize Feather Icons for any new icons
        feather.replace();
        
    } catch (error) {
        console.error('Error loading projects data:', error);
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-red-500 mb-4">
                    <i data-feather="alert-circle" class="w-8 h-8 mx-auto mb-2"></i>
                </div>
                <p class="text-gray-600 text-lg">Unable to load project information.</p>
                <p class="text-sm text-gray-500 mt-2">Error: ${error.message}</p>
            </div>
        `;
        feather.replace();
    }
}

/**
 * Create a project card element
 */
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'group card-hover bg-white rounded-2xl overflow-hidden shadow-lg border border-neutral/20 fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Validate required fields
    const title = project.title || 'Untitled Project';
    const description = project.description || 'No description available.';
    const image = project.image || 'https://via.placeholder.com/400x200/4C6EF5/ffffff?text=VectroLabs+Project';
    const technologies = project.technologies || [];
    const status = project.status || 'active';
    
    // Create technology tags with new design
    const techTags = technologies.slice(0, 3).map(tech => 
        `<span class="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">${escapeHtml(tech)}</span>`
    ).join(' ');
    
    // Create action buttons
    const actions = createProjectActions(project);
    
    // Status badge with new design
    const statusBadge = createStatusBadge(status);
    
    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img src="${image}" 
                 alt="${escapeHtml(title)}" 
                 class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                 onerror="this.src='https://via.placeholder.com/400x200/4C6EF5/ffffff?text=VectroLabs+Project'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            ${statusBadge}
        </div>
        <div class="p-8">
            <h3 class="text-2xl font-bold mb-3 text-text-main group-hover:text-primary transition-colors duration-300">${escapeHtml(title)}</h3>
            <p class="text-text-secondary mb-6 leading-relaxed">${escapeHtml(description)}</p>
            ${techTags ? `<div class="flex flex-wrap gap-2 mb-6">${techTags}</div>` : ''}
            ${actions}
        </div>
    `;
    
    return card;
}

/**
 * Create project action buttons
 */
function createProjectActions(project) {
    const actions = [];
    
    if (project.demo_url) {
        actions.push(`
            <a href="${escapeHtml(project.demo_url)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm">
                <i data-feather="external-link" class="w-4 h-4 mr-2"></i>
                Live Demo
            </a>
        `);
    }
    
    if (project.github_url) {
        actions.push(`
            <a href="${escapeHtml(project.github_url)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="inline-flex items-center px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-semibold transition-all duration-300 text-sm">
                <i data-feather="github" class="w-4 h-4 mr-2"></i>
                View Code
            </a>
        `);
    }
    
    if (actions.length > 0) {
        return `<div class="flex flex-wrap gap-3">${actions.join('')}</div>`;
    }
    
    return '';
}

/**
 * Create status badge for projects
 */
function createStatusBadge(status) {
    const statusConfig = {
        active: { color: 'bg-accent', text: 'Active', icon: 'play-circle' },
        completed: { color: 'bg-primary', text: 'Completed', icon: 'check-circle' },
        development: { color: 'bg-secondary', text: 'In Development', icon: 'code' },
        archived: { color: 'bg-orange-500', text: 'Archived', icon: 'archive' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return `
        <div class="absolute top-4 right-4">
            <span class="inline-flex items-center ${config.color} text-white text-xs px-3 py-2 rounded-full font-semibold shadow-lg backdrop-blur-sm">
                <i data-feather="${config.icon}" class="w-3 h-3 mr-1"></i>
                ${config.text}
            </span>
        </div>
    `;
}

/* Contact Form Functions - Currently Disabled */
/*
/**
 * Initialize contact form functionality
 */
/*
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageDiv = document.getElementById('form-message');
    
    if (!form || !submitBtn || !messageDiv) {
        console.error('Contact form elements not found');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company') || 'Not specified',
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Set loading state
        setFormLoading(true);
        
        try {
            // Get Discord webhook URL from environment or use default
            const webhookUrl = getDiscordWebhookUrl();
            
            if (!webhookUrl) {
                showMessage('Thank you for your message! We have received your contact information and will get back to you soon via email.', 'success');
                form.reset();
                return;
            }
            
            // Prepare Discord message
            const discordPayload = {
                embeds: [{
                    title: "New Contact Form Submission",
                    color: 0x1E40AF, // Primary blue color
                    fields: [
                        { name: "Name", value: data.name, inline: true },
                        { name: "Email", value: data.email, inline: true },
                        { name: "Company", value: data.company, inline: true },
                        { name: "Subject", value: data.subject, inline: false },
                        { name: "Message", value: data.message, inline: false }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: { text: "VectroLabs Contact Form" }
                }]
            };
            
            // Send to Discord webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordPayload)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
            }
            
            // Success
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Error sending contact form:', error);
            showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
        } finally {
            setFormLoading(false);
        }
    });
}

/**
 * Get Discord webhook URL from environment or default
 */
/*
function getDiscordWebhookUrl() {
    // Check for Discord webhook URL from environment variables
    const webhookUrl = window?.DISCORD_WEBHOOK_URL || 
                      (typeof process !== 'undefined' && process?.env?.DISCORD_WEBHOOK_URL);
    
    // Return null if not configured
    if (!webhookUrl || webhookUrl.includes('YOUR_WEBHOOK')) {
        console.info('Discord webhook URL not configured. Contact form will show success message without sending to Discord.');
        return null;
    }
    
    return webhookUrl;
}

/**
 * Set form loading state
 */
/*
function setFormLoading(loading) {
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('contact-form');
    
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="flex items-center justify-center">
                <div class="loading-spinner w-5 h-5 mr-2"></div>
                Sending...
            </div>
        `;
        form.classList.add('pointer-events-none', 'opacity-50');
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
        form.classList.remove('pointer-events-none', 'opacity-50');
    }
}

/**
 * Show form message
 */
/*
function showMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    
    messageDiv.className = `mt-4 text-center p-4 rounded-lg ${
        type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
    }`;
    
    messageDiv.textContent = message;
    messageDiv.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}
*/

/**
 * Initialize welcome message for first-time visitors
 */
function initWelcomeMessage() {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('vectorlabs_visited');
    
    if (!hasVisited) {
        // Mark as visited
        localStorage.setItem('vectorlabs_visited', 'true');
        
        // Show welcome message after a short delay
        setTimeout(() => {
            showWelcomeModal();
        }, 1500);
    }
}

/**
 * Show welcome modal for first-time visitors
 */
function showWelcomeModal() {
    // Create modal HTML
    const modalHTML = `
        <div id="welcome-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 opacity-0">
                <div class="p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-feather="heart" class="w-8 h-8 text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-text-main mb-3">Welcome to VectroLabs!</h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        We're excited to have you here! Discover our innovative digital products, cutting-edge frameworks, and open source contributions that are shaping the future of technology.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="explore-btn" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold">
                            Explore Our Work
                        </button>
                        <button id="close-welcome" class="text-gray-500 hover:text-gray-700 px-6 py-3 transition-colors">
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize Feather Icons for the modal
    feather.replace();
    
    // Animate modal in
    const modal = document.getElementById('welcome-modal');
    const modalContent = modal.querySelector('div > div');
    
    requestAnimationFrame(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    });
    
    // Add event listeners
    const exploreBtn = document.getElementById('explore-btn');
    const closeBtn = document.getElementById('close-welcome');
    
    exploreBtn.addEventListener('click', () => {
        closeWelcomeModal();
        // Scroll to projects section
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    closeBtn.addEventListener('click', closeWelcomeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeWelcomeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeWelcomeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

/**
 * Close welcome modal with animation
 */
function closeWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        const modalContent = modal.querySelector('div > div');
        
        modalContent.classList.add('scale-95', 'opacity-0');
        modalContent.classList.remove('scale-100', 'opacity-100');
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

/**
 * Utility function to escape HTML
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Handle page visibility changes to pause/resume animations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});
