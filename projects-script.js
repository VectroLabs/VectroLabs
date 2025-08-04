// VectroLabs Projects Page JavaScript
// Handles project filtering, dynamic content loading, and animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather Icons
    feather.replace();
    
    // Initialize all functionality
    initMobileMenu();
    initScrollAnimations();
    loadProjectsData();
    initProjectFilters();
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
 * Initialize project filtering functionality
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            const filterValue = this.getAttribute('data-filter');
            filterProjects(filterValue);
        });
    });
}

/**
 * Filter projects based on selected tag
 */
function filterProjects(filterValue) {
    const projectCards = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('no-results');
    let visibleCount = 0;
    
    projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags').split(',');
        
        if (filterValue === 'all' || tags.includes(filterValue)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }
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
        
        // Generate project cards
        data.projects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            container.appendChild(projectCard);
        });
        
        // Update statistics
        updateProjectStats(data.projects);
        
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
 * Update project statistics
 */
function updateProjectStats(projects) {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const developmentProjects = projects.filter(p => p.status === 'development').length;
    
    document.getElementById('total-projects').textContent = totalProjects;
    document.getElementById('active-projects').textContent = activeProjects;
    document.getElementById('completed-projects').textContent = completedProjects;
    document.getElementById('development-projects').textContent = developmentProjects;
}

/**
 * Create a project card element
 */
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card card-hover bg-white rounded-xl overflow-hidden shadow-sm fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Set data attributes for filtering
    card.setAttribute('data-tags', (project.tags || []).join(','));
    card.setAttribute('data-status', project.status || 'active');
    
    // Validate required fields
    const title = project.title || 'Untitled Project';
    const description = project.description || 'No description available.';
    const image = project.image || 'https://via.placeholder.com/400x200/1E40AF/ffffff?text=VectroLabs';
    const technologies = project.technologies || [];
    const tags = project.tags || [];
    const category = project.category || 'Project';
    const status = project.status || 'active';
    
    // Create technology tags
    const techTags = technologies.map(tech => 
        `<span class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">${escapeHtml(tech)}</span>`
    ).join(' ');
    
    // Create project tags
    const projectTags = tags.map(tag => {
        const tagColors = {
            'framework': 'bg-blue-100 text-blue-800',
            'npm package': 'bg-green-100 text-green-800',
            'discord bots': 'bg-purple-100 text-purple-800',
            'websites': 'bg-orange-100 text-orange-800'
        };
        const colorClass = tagColors[tag] || 'bg-gray-100 text-gray-800';
        return `<span class="inline-block ${colorClass} text-xs px-2 py-1 rounded-full font-medium">${escapeHtml(tag)}</span>`;
    }).join(' ');
    
    // Create action buttons
    const actions = createProjectActions(project);
    
    // Status badge
    const statusBadge = createStatusBadge(status);
    
    card.innerHTML = `
        <div class="relative">
            <img src="${image}" 
                 alt="${escapeHtml(title)}" 
                 class="w-full h-48 object-cover"
                 onerror="this.src='https://via.placeholder.com/400x200/1E40AF/ffffff?text=VectroLabs'">
            ${statusBadge}
        </div>
        <div class="p-6">
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-semibold">${escapeHtml(title)}</h3>
                <span class="text-sm font-medium text-gray-500 ml-4">${escapeHtml(category)}</span>
            </div>
            <p class="text-gray-600 mb-4">${escapeHtml(description)}</p>
            ${projectTags ? `<div class="flex flex-wrap gap-2 mb-3">${projectTags}</div>` : ''}
            ${techTags ? `<div class="flex flex-wrap gap-2 mb-4">${techTags}</div>` : ''}
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
               class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors text-sm">
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
               class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
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
        active: { color: 'bg-accent', text: 'Active' },
        completed: { color: 'bg-primary', text: 'Completed' },
        development: { color: 'bg-secondary', text: 'In Development' },
        archived: { color: 'bg-gray-500', text: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return `
        <div class="absolute top-4 right-4">
            <span class="inline-block ${config.color} text-white text-xs px-2 py-1 rounded-full font-medium">
                ${config.text}
            </span>
        </div>
    `;
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