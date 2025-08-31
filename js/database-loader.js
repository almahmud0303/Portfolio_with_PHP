// Database data loader for portfolio
class PortfolioDataLoader {
    constructor() {
        this.baseUrl = window.location.origin + '/portfolio_test2/Mahmud_portfolio/php/';
    }

    // Load skills data with categories
    async loadSkills() {
        try {
            const response = await fetch(this.baseUrl + 'get_skills.php');
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                console.error('Failed to load skills:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error loading skills:', error);
            return [];
        }
    }

    // Load skill categories data
    async loadSkillCategories() {
        try {
            const response = await fetch(this.baseUrl + 'get_skill_categories.php');
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                console.error('Failed to load skill categories:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error loading skill categories:', error);
            return [];
        }
    }

    // Load education data
    async loadEducation() {
        try {
            const response = await fetch(this.baseUrl + 'get_education.php');
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                console.error('Failed to load education:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error loading education:', error);
            return [];
        }
    }

    // Load projects data with filters
    async loadProjects(category = 'all', search = '', limit = 10, offset = 0) {
        try {
            const params = new URLSearchParams({
                category: category,
                search: search,
                limit: limit,
                offset: offset
            });
            
            const response = await fetch(this.baseUrl + 'get_projects.php?' + params);
            const data = await response.json();
            
            if (data.success) {
                return data;
            } else {
                console.error('Failed to load projects:', data.error);
                return { data: [], pagination: { total: 0, has_more: false } };
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            return { data: [], pagination: { total: 0, has_more: false } };
        }
    }

    // Load experience data
    async loadExperience() {
        try {
            const response = await fetch(this.baseUrl + 'get_experience.php');
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                console.error('Failed to load experience:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error loading experience:', error);
            return [];
        }
    }

    // Load about data
    async loadAbout() {
        try {
            const response = await fetch(this.baseUrl + 'get_about.php');
            const data = await response.json();
            
            if (data.success) {
                return data; // Return the full response, not just data.data
            } else {
                console.error('Failed to load about data:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error loading about data:', error);
            return null;
        }
    }

    // Load personal info separately
    async loadPersonalInfo() {
        try {
            const response = await fetch(this.baseUrl + 'get_personal_info.php');
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                console.error('Failed to load personal info:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error loading personal info:', error);
            return null;
        }
    }

    // Load photos data
    async loadPhotos() {
        try {
            const response = await fetch(this.baseUrl + 'get_gallery.php');
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                console.error('Failed to load photos:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error loading photos:', error);
            return [];
        }
    }

    // Render skills on skills page
    async renderSkills() {
        const skillsContainer = document.querySelector('.skill-categories');
        if (!skillsContainer) return;

        const skills = await this.loadSkills();
        
        skillsContainer.innerHTML = skills.map(category => `
            <div class="skill-category fade-in">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <div class="skills-list">
                    ${category.skills.map(skill => `
                        <div class="skill-item">
                            <span class="skill-name">${skill.name}</span>
                            <div class="skill-level">
                                <div class="skill-bar" style="width: ${skill.proficiency_level}%"></div>
                            </div>
                            <span class="skill-percentage">${skill.proficiency_level}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Render education on education page
    async renderEducation() {
        const educationContainer = document.querySelector('.education-timeline');
        if (!educationContainer) return;

        try {
            const education = await this.loadEducation();
            
            if (!education || education.length === 0) {
                educationContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>No Education Data Found</h3>
                        <p>Education data will be loaded from the database. Please ensure your education table is properly set up.</p>
                    </div>
                `;
                return;
            }

            educationContainer.innerHTML = education.map((item, index) => `
                <div class="education-card fade-in" data-education-id="${item.id}">
                    <div class="education-header">
                        <div class="education-info">
                            <h3 class="degree-title">${item.degree}</h3>
                            <h4 class="institution-name">
                                <i class="fas fa-university"></i>
                                ${item.institution}
                            </h4>
                            <p class="education-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${item.location || 'Location not specified'}
                            </p>
                        </div>
                        <div class="education-meta">
                            <span class="education-duration">${item.duration}</span>
                        </div>
                    </div>
                    
                    <div class="education-description">${item.description}</div>
                    
                    ${item.field_of_study ? `
                        <div class="coursework-list">
                            <li>Field of Study: ${item.field_of_study}</li>
                        </div>
                    ` : ''}
                    
                    ${item.gpa ? `
                        <div class="gpa-display">
                            <i class="fas fa-star"></i>
                            GPA: ${item.gpa}
                        </div>
                    ` : ''}
                    
                    ${item.achievements ? `
                        <div class="education-achievements">
                            ${item.achievements.split('\n').map(achievement => 
                                `<span class="achievement-tag">${achievement.trim()}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                    
                    <button class="expand-btn" onclick="toggleEducationDetails(${item.id})">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            `).join('');

            // Add animation delay for staggered entrance
            setTimeout(() => {
                document.querySelectorAll('.education-card').forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.2}s`;
                });
            }, 100);

        } catch (error) {
            console.error('Error rendering education:', error);
            educationContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Education</h3>
                    <p>There was an error loading your education data. Please check the console for details.</p>
                </div>
            `;
        }
    }

    // Render projects on work page
    async renderProjects(category = 'all', search = '') {
        const projectsGrid = document.getElementById('project-grid');
        if (!projectsGrid) return;

        const projectsData = await this.loadProjects(category, search, 6, 0);
        const projects = projectsData.data;
        
        projectsGrid.innerHTML = projects.map(project => `
            <div class="card fade-in" data-category="${project.category}">
                <div class="thumb" style="background-image:url('${project.image_url || 'img/default-project.jpg'}')"></div>
                <div class="content">
                    <h4 class="title">${project.title}</h4>
                    <p class="desc">${project.description}</p>
                    <div class="tags">
                        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Update load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = projectsData.pagination.has_more ? 'block' : 'none';
        }
    }

    // Render experience on experience page
    async renderExperience() {
        const experienceContainer = document.querySelector('.experience-timeline');
        if (!experienceContainer) return;

        try {
            const experience = await this.loadExperience();
            
            if (!experience || experience.length === 0) {
                experienceContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-briefcase"></i>
                        <h3>No Experience Data Found</h3>
                        <p>Experience data will be loaded from the database. Please ensure your experience table is properly set up.</p>
                    </div>
                `;
                return;
            }

            experienceContainer.innerHTML = experience.map((item, index) => `
                <div class="job-card fade-in" data-job-id="${item.id}">
                    <div class="job-header">
                        <div class="job-info">
                            <h3 class="job-title">${item.position}</h3>
                            <h4 class="job-company">
                                <i class="fas fa-building"></i>
                                ${item.company_name}
                            </h4>
                            <p class="job-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${item.location}
                            </p>
                        </div>
                        <div class="job-meta">
                            <span class="job-duration">
                                ${item.start_date} - ${item.current_job ? 'Present' : item.end_date}
                            </span>
                        </div>
                    </div>
                    
                    <div class="job-description">${item.description}</div>
                    
                    ${item.achievements ? `
                        <div class="job-responsibilities">
                            ${item.achievements.split('\n').map(achievement => 
                                `<li>${achievement.trim()}</li>`
                            ).join('')}
                        </div>
                    ` : ''}
                    
                    ${item.technologies_used && item.technologies_used.length > 0 ? `
                        <div class="job-skills">
                            ${item.technologies_used.map(tech => 
                                `<span class="skill-tag">${tech.trim()}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                    
                    <button class="expand-btn" onclick="toggleJobDetails(${item.id})">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            `).join('');

            // Add animation delay for staggered entrance
            setTimeout(() => {
                document.querySelectorAll('.job-card').forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.2}s`;
                });
            }, 100);

        } catch (error) {
            console.error('Error rendering experience:', error);
            experienceContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Experience</h3>
                    <p>There was an error loading your experience data. Please check the console for details.</p>
                </div>
                `;
        }
    }

    // Render about section on home page
    async renderAbout() {
        const aboutContainer = document.querySelector('.about-container');
        if (!aboutContainer) return;

        try {
            const aboutData = await this.loadAbout();
            
            console.log('About data loaded:', aboutData); // Debug log
            
            if (!aboutData) {
                console.log('No about data found, using default content');
                return;
            }

            // Update personal info
            if (aboutData.personal_info) {
                const personalInfoPlaceholder = aboutContainer.querySelector('.personal-info-placeholder');
                if (personalInfoPlaceholder) {
                    personalInfoPlaceholder.innerHTML = `
                        <div class="info-card fade-in">
                            <h3>Personal Information</h3>
                            <div class="info-row"><i class="fas fa-user"></i><span>Age: ${aboutData.personal_info.age || '25'}</span></div>
                            <div class="info-row"><i class="fas fa-location-dot"></i><span>${aboutData.personal_info.location || 'Dhaka, Bangladesh'}</span></div>
                            <div class="info-row"><i class="fas fa-envelope"></i><span>${aboutData.personal_info.email || 'abdullah@example.com'}</span></div>
                        </div>
                    `;
                }
            }

            // Update about-hero stats
            if (aboutData.stats && aboutData.stats.length > 0) {
                const aboutHeroStats = aboutContainer.querySelector('.about-hero .about-stats');
                if (aboutHeroStats) {
                    aboutHeroStats.innerHTML = aboutData.stats.map(stat => `
                        <div class="stat-item">
                            <span class="stat-number">${stat.number}</span>
                            <span class="stat-label">${stat.label}</span>
                        </div>
                    `).join('');
                }
            }

            // Update main stats section
            if (aboutData.stats && aboutData.stats.length > 0) {
                const statsContainer = aboutContainer.querySelector('.stats');
                if (statsContainer) {
                    statsContainer.innerHTML = aboutData.stats.map(stat => `
                        <div class="stat fade-in">
                            <div class="stat-number" data-target="${stat.number}">0</div>
                            <div class="stat-label">${stat.label}</div>
                        </div>
                    `).join('');
                    
                    // Trigger stat animation
                    setTimeout(() => {
                        this.animateStats();
                    }, 500);
                }
            }

            // Update about sections
            if (aboutData.sections && aboutData.sections.length > 0) {
                console.log('Found about sections:', aboutData.sections); // Debug log
                const aboutSectionsPlaceholder = aboutContainer.querySelector('.about-sections-placeholder');
                if (aboutSectionsPlaceholder) {
                    console.log('Found about-sections-placeholder, updating content...'); // Debug log
                    
                    // Create the HTML for each section
                    const sectionsHTML = aboutData.sections.map(section => {
                        console.log('Processing section:', section.title); // Debug each section
                        return `
                            <div class="info-card fade-in">
                                <div class="info-card-header">
                                    <i class="${section.icon || 'fas fa-info-circle'}"></i>
                                    <h3>${section.title}</h3>
                                </div>
                                <div class="info-content">
                                    <p>${section.content}</p>
                                </div>
                            </div>
                        `;
                    }).join('');
                    
                    console.log('Generated HTML:', sectionsHTML); // Debug the generated HTML
                    
                    // Hide loading message and show content
                    const loadingMessage = aboutSectionsPlaceholder.querySelector('.loading-message');
                    if (loadingMessage) {
                        loadingMessage.style.display = 'none';
                    }
                    
                    aboutSectionsPlaceholder.innerHTML = sectionsHTML;
                    console.log('About sections updated successfully'); // Debug log
                } else {
                    console.error('about-sections-placeholder not found in DOM'); // Debug log
                }
            } else {
                console.log('No about sections data found'); // Debug log
                console.log('aboutData:', aboutData); // Show the full data structure
            }

        } catch (error) {
            console.error('Error rendering about section:', error);
        }
    }

    // Load gallery photos
    async loadGallery() {
        try {
            const response = await fetch(this.baseUrl + 'get_gallery.php');
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                console.error('Failed to load gallery:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error loading gallery:', error);
            return [];
        }
    }

    // Render photo gallery
    async renderGallery() {
        const galleryContainer = document.querySelector('.photo-gallery');
        if (!galleryContainer) return;

        try {
            const photos = await this.loadGallery();
            
            if (!photos || photos.length === 0) {
                galleryContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-camera"></i>
                        <h3>No Photos Found</h3>
                        <p>Photos will be loaded from the database. Please ensure your photo_gallery table is properly set up.</p>
                    </div>
                `;
                return;
            }

            // Create category filter buttons
            const categories = [...new Set(photos.map(photo => photo.category))];
            const filterHTML = `
                <div class="gallery-filters">
                    <button class="filter-btn active" data-category="all">All</button>
                    ${categories.map(cat => `<button class="filter-btn" data-category="${cat}">${cat}</button>`).join('')}
                </div>
            `;

            // Create photos grid
            const photosHTML = photos.map((photo, index) => `
                <div class="photo-item" data-category="${photo.category}" style="--i: ${index};">
                    <img src="${photo.drive_link}" alt="${photo.title}" loading="lazy">
                    <div class="photo-overlay">
                        <h3>${photo.title}</h3>
                        <p>${photo.description || ''}</p>
                        <span class="category">${photo.category}</span>
                    </div>
                </div>
            `).join('');

            galleryContainer.innerHTML = filterHTML + photosHTML;
            
            // Initialize gallery events
            this.initializeGalleryEvents();
            
            // Add animation delay for staggered entrance
            setTimeout(() => {
                document.querySelectorAll('.photo-item').forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                });
            }, 100);

        } catch (error) {
            console.error('Error rendering gallery:', error);
            galleryContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Photos</h3>
                    <p>There was an error loading your photos. Please check the console for details.</p>
                </div>
            `;
        }
    }

    // Initialize gallery events (filtering and lightbox)
    initializeGalleryEvents() {
        // Category filtering
        const filterBtns = document.querySelectorAll('.filter-btn');
        const photoItems = document.querySelectorAll('.photo-item');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter photos
                photoItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Lightbox functionality
        photoItems.forEach(item => {
            const img = item.querySelector('img');
            img.addEventListener('click', () => {
                this.createLightbox(img.src, img.alt);
            });
        });
    }

    // Create lightbox for photo viewing
    createLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-info">
                    <h3>${alt}</h3>
                </div>
            </div>
        `;
        
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 95%;
            max-height: 95%;
            text-align: center;
        `;
        
        const img = lightbox.querySelector('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            height: auto;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            transition: transform 0.3s ease;
        `;
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -50px;
            right: 0;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            font-size: 1.8rem;
            cursor: pointer;
            padding: 12px 16px;
            border-radius: 50%;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        const info = lightbox.querySelector('.lightbox-info');
        info.style.cssText = `
            margin-top: 20px;
            color: white;
        `;
        
        info.querySelector('h3').style.cssText = `
            margin: 0;
            font-size: 1.2rem;
            font-weight: 600;
            color: #ffb347;
        `;
        
        document.body.appendChild(lightbox);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
        
        // Close functionality
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightbox.style.transform = 'scale(0.9)';
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                if (document.body.contains(lightbox)) {
                    document.body.removeChild(lightbox);
                }
            }, 300);
        };
        
        // Close button events
        closeBtn.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.2)';
            closeBtn.style.transform = 'scale(1.1)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.1)';
            closeBtn.style.transform = 'scale(1)';
        });
        
        // Click outside to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Keyboard support
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
        
        // Image hover effect
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.02)';
        });
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    }

    // Initialize data loading based on current page
    async init() {
        const currentPage = window.location.pathname.split('/').pop();
        
        switch (currentPage) {
            case 'skill.html':
                await this.renderSkills();
                break;
            case 'education.html':
                await this.renderEducation();
                break;
            case 'work.html':
                await this.renderProjects();
                break;
            case 'experience.html':
                await this.renderExperience();
                break;
            case 'home.html':
            case '':
            case 'index.html':
                await this.renderAbout();
                await this.renderGallery();
                break;
        }
    }

    // Animate stats numbers
    animateStats() {
        const nums = document.querySelectorAll('.stat-number[data-target]');
        nums.forEach(n => {
            const target = parseInt(n.getAttribute('data-target')) || 0;
            let current = 0;
            const duration = 1600;
            const step = Math.max(1, Math.ceil(target / (duration / 16)));
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                n.textContent = current;
            }, 16);
        });
    }
}
// Note: Initialization is now handled in home.html to avoid conflicts
// The PortfolioDataLoader class is available for manual initialization

