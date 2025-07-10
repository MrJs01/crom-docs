/**
 * MobileManager - Gerencia funcionalidades específicas para mobile
 * Responsável por adaptar a interface para dispositivos móveis
 */

class MobileManager {
    constructor() {
        this.isMobile = window.innerWidth <= 991.98;
        this.isTablet = window.innerWidth > 767.98 && window.innerWidth <= 991.98;
        this.isDesktop = window.innerWidth > 991.98;
        
        this.elements = {
            mobileNavbar: document.getElementById('mobile-navbar'),
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            mobileActionsToggle: document.getElementById('mobile-actions-toggle'),
            mobileActionsDropdown: document.getElementById('mobile-actions-dropdown'),
            mobileSidebarOverlay: document.getElementById('mobile-sidebar-overlay'),
            bottomNav: document.getElementById('bottom-nav'),
            sidebar: document.getElementById('sidebar'),
            mainContent: document.querySelector('.main-content'),
            toolbarMobileMore: document.getElementById('toolbar-mobile-more'),
            toolbarMobileExpanded: document.querySelector('.toolbar-mobile-expanded')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupBottomNavigation();
        this.setupMobileToolbar();
        this.setupResponsiveLayout();
        this.syncMobileControls();
        
        // Listen for window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileSidebar();
            });
        }
        
        // Mobile actions toggle
        if (this.elements.mobileActionsToggle) {
            this.elements.mobileActionsToggle.addEventListener('click', () => {
                this.toggleMobileActions();
            });
        }
        
        // Mobile sidebar overlay
        if (this.elements.mobileSidebarOverlay) {
            this.elements.mobileSidebarOverlay.addEventListener('click', () => {
                this.closeMobileSidebar();
            });
        }
        
        // Mobile toolbar more button
        if (this.elements.toolbarMobileMore) {
            this.elements.toolbarMobileMore.addEventListener('click', () => {
                this.toggleMobileToolbarExpanded();
            });
        }
        
        // Sync mobile actions with main actions
        this.syncMobileActions();
    }
    
    setupBottomNavigation() {
        if (!this.elements.bottomNav) return;
        
        const navItems = this.elements.bottomNav.querySelectorAll('.bottom-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const view = item.dataset.view;
                const action = item.dataset.action;
                
                if (view) {
                    this.switchView(view);
                    this.updateBottomNavActive(item);
                } else if (action) {
                    this.executeAction(action);
                }
            });
        });
    }
    
    setupMobileToolbar() {
        // Sync mobile format selector with desktop
        const mobileFormatSelect = document.getElementById('formatBlockSelectMobile');
        const desktopFormatSelect = document.getElementById('formatBlockSelect');
        
        if (mobileFormatSelect && desktopFormatSelect) {
            mobileFormatSelect.addEventListener('change', (e) => {
                desktopFormatSelect.value = e.target.value;
                // Trigger change event on desktop selector
                desktopFormatSelect.dispatchEvent(new Event('change'));
            });
        }
    }
    
    setupResponsiveLayout() {
        this.updateLayoutForDevice();
    }
    
    syncMobileControls() {
        // Sync auto-save toggles
        const mobileAutoSave = document.getElementById('mobile-auto-save-toggle');
        const desktopAutoSave = document.getElementById('auto-save-toggle');
        
        if (mobileAutoSave && desktopAutoSave) {
            mobileAutoSave.addEventListener('change', (e) => {
                desktopAutoSave.checked = e.target.checked;
                desktopAutoSave.dispatchEvent(new Event('change'));
            });
            
            desktopAutoSave.addEventListener('change', (e) => {
                mobileAutoSave.checked = e.target.checked;
            });
        }
    }
    
    syncMobileActions() {
        // Sync mobile menu actions with desktop actions
        const mobileActions = [
            { mobile: 'mobile-menu-view-json', desktop: 'menu-view-json' },
            { mobile: 'mobile-menu-tutorial', desktop: 'menu-tutorial' },
            { mobile: 'mobile-menu-export', desktop: 'menu-export' },
            { mobile: 'mobile-save-button', desktop: 'save-button' }
        ];
        
        mobileActions.forEach(({ mobile, desktop }) => {
            const mobileEl = document.getElementById(mobile);
            const desktopEl = document.getElementById(desktop);
            
            if (mobileEl && desktopEl) {
                mobileEl.addEventListener('click', (e) => {
                    e.preventDefault();
                    desktopEl.click();
                });
            }
        });
    }
    
    toggleMobileSidebar() {
        if (!this.elements.sidebar) return;
        
        const isActive = this.elements.sidebar.classList.contains('active');
        
        if (isActive) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }
    
    openMobileSidebar() {
        if (this.elements.sidebar) {
            this.elements.sidebar.classList.add('active');
        }
        if (this.elements.mobileSidebarOverlay) {
            this.elements.mobileSidebarOverlay.classList.add('active');
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileSidebar() {
        if (this.elements.sidebar) {
            this.elements.sidebar.classList.remove('active');
        }
        if (this.elements.mobileSidebarOverlay) {
            this.elements.mobileSidebarOverlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    toggleMobileActions() {
        if (!this.elements.mobileActionsDropdown) return;
        
        const isVisible = !this.elements.mobileActionsDropdown.classList.contains('d-none');
        
        if (isVisible) {
            this.elements.mobileActionsDropdown.classList.add('d-none');
        } else {
            this.elements.mobileActionsDropdown.classList.remove('d-none');
        }
    }
    
    toggleMobileToolbarExpanded() {
        if (!this.elements.toolbarMobileExpanded) return;
        
        const isExpanded = !this.elements.toolbarMobileExpanded.classList.contains('d-none');
        
        if (isExpanded) {
            this.elements.toolbarMobileExpanded.classList.add('d-none');
            this.elements.toolbarMobileMore.innerHTML = '<i class="bi bi-three-dots"></i>';
        } else {
            this.elements.toolbarMobileExpanded.classList.remove('d-none');
            this.elements.toolbarMobileMore.innerHTML = '<i class="bi bi-chevron-up"></i>';
        }
    }
    
    switchView(viewName) {
        // Hide all views
        const views = ['dashboard-view', 'editor-view', 'import-document-view', 'export-document-view', 'settings-view'];
        
        views.forEach(view => {
            const element = document.getElementById(view);
            if (element) {
                element.classList.add('d-none');
            }
        });
        
        // Show requested view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.remove('d-none');
        }
        
        // Update body class for view-specific styles
        document.body.className = document.body.className.replace(/\b\w+-view\b/g, '');
        document.body.classList.add(`${viewName}-view`);
        
        // Close mobile sidebar if open
        this.closeMobileSidebar();
        
        // Hide mobile actions dropdown
        if (this.elements.mobileActionsDropdown) {
            this.elements.mobileActionsDropdown.classList.add('d-none');
        }
    }
    
    updateBottomNavActive(activeItem) {
        const navItems = this.elements.bottomNav.querySelectorAll('.bottom-nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        activeItem.classList.add('active');
    }
    
    executeAction(actionName) {
        switch (actionName) {
            case 'new-document':
                const newDocButton = document.getElementById('new-document-link');
                if (newDocButton) {
                    newDocButton.click();
                }
                break;
            default:
                console.warn(`Unknown action: ${actionName}`);
        }
    }
    
    updateLayoutForDevice() {
        const currentWidth = window.innerWidth;
        
        this.isMobile = currentWidth <= 991.98;
        this.isTablet = currentWidth > 767.98 && currentWidth <= 991.98;
        this.isDesktop = currentWidth > 991.98;
        
        // Update body classes
        document.body.classList.toggle('mobile-device', this.isMobile);
        document.body.classList.toggle('tablet-device', this.isTablet);
        document.body.classList.toggle('desktop-device', this.isDesktop);
    }
    
    handleResize() {
        this.updateLayoutForDevice();
        
        // Close mobile sidebar on resize to desktop
        if (this.isDesktop) {
            this.closeMobileSidebar();
            if (this.elements.mobileActionsDropdown) {
                this.elements.mobileActionsDropdown.classList.add('d-none');
            }
        }
    }
    
    // Public methods for external use
    getCurrentDevice() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop
        };
    }
    
    adaptForMobile() {
        if (!this.isMobile) return;
        
        // Add mobile-specific adaptations
        this.optimizeForTouch();
        this.setupSwipeGestures();
    }
    
    optimizeForTouch() {
        // Increase touch targets
        const buttons = document.querySelectorAll('.btn-sm');
        buttons.forEach(btn => {
            if (this.isMobile) {
                btn.style.minHeight = '44px';
                btn.style.minWidth = '44px';
            }
        });
    }
    
    setupSwipeGestures() {
        // Basic swipe gesture detection
        let startX = 0;
        let startY = 0;
        
        if (this.elements.mainContent) {
            this.elements.mainContent.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            this.elements.mainContent.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                // Swipe right to open sidebar
                if (diffX < -50 && Math.abs(diffY) < 100) {
                    this.openMobileSidebar();
                }
                
                // Swipe left to close sidebar
                if (diffX > 50 && Math.abs(diffY) < 100) {
                    this.closeMobileSidebar();
                }
            });
        }
    }
}

export { MobileManager };
