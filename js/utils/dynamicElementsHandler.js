/**
 * Utility for handling dynamic Bootstrap elements
 * Ensures proper styling and functionality for elements created via JavaScript
 */

export class DynamicElementsHandler {
    constructor() {
        this.observeNewElements();
        this.initializeExistingElements();
    }

    /**
     * Initialize existing elements that might not have proper styles
     */
    initializeExistingElements() {
        // Force re-apply Bootstrap classes to existing elements
        this.processBootstrapElements(document.body);
    }

    /**
     * Observe for new elements being added to the DOM
     */
    observeNewElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.processBootstrapElements(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Process Bootstrap elements to ensure proper styling
     */
    processBootstrapElements(element) {
        // Process cards
        const cards = element.querySelectorAll('.card, .document-card');
        cards.forEach(card => {
            if (!card.classList.contains('bootstrap-processed')) {
                this.processCard(card);
                card.classList.add('bootstrap-processed');
            }
        });

        // Process dropdowns
        const dropdowns = element.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.classList.contains('bootstrap-processed')) {
                this.processDropdown(dropdown);
                dropdown.classList.add('bootstrap-processed');
            }
        });

        // Process buttons
        const buttons = element.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (!button.classList.contains('bootstrap-processed')) {
                this.processButton(button);
                button.classList.add('bootstrap-processed');
            }
        });

        // Process forms
        const forms = element.querySelectorAll('.form-control, .form-select, .form-check-input');
        forms.forEach(form => {
            if (!form.classList.contains('bootstrap-processed')) {
                this.processFormElement(form);
                form.classList.add('bootstrap-processed');
            }
        });

        // Process badges
        const badges = element.querySelectorAll('.badge');
        badges.forEach(badge => {
            if (!badge.classList.contains('bootstrap-processed')) {
                this.processBadge(badge);
                badge.classList.add('bootstrap-processed');
            }
        });

        // Process alerts
        const alerts = element.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (!alert.classList.contains('bootstrap-processed')) {
                this.processAlert(alert);
                alert.classList.add('bootstrap-processed');
            }
        });

        // Process modals
        const modals = element.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (!modal.classList.contains('bootstrap-processed')) {
                this.processModal(modal);
                modal.classList.add('bootstrap-processed');
            }
        });
    }

    /**
     * Process card elements
     */
    processCard(card) {
        // Ensure card has proper dark theme styling
        card.style.backgroundColor = 'var(--bg-secondary)';
        card.style.border = '1px solid var(--contrast-low)';
        card.style.borderRadius = '8px';
        card.style.boxShadow = 'var(--shadow-sm)';
        card.style.transition = 'all 0.3s ease';

        // Process card body
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            cardBody.style.color = 'var(--text-primary)';
        }

        // Process card title
        const cardTitle = card.querySelector('.card-title');
        if (cardTitle) {
            cardTitle.style.color = 'var(--text-primary)';
            cardTitle.style.fontWeight = '600';
        }

        // Process card text
        const cardTexts = card.querySelectorAll('.card-text');
        cardTexts.forEach(text => {
            text.style.color = 'var(--text-secondary)';
        });
    }

    /**
     * Process dropdown elements
     */
    processDropdown(dropdown) {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.backgroundColor = 'var(--bg-secondary)';
            dropdownMenu.style.border = '1px solid var(--contrast-low)';
            dropdownMenu.style.borderRadius = '6px';
            dropdownMenu.style.boxShadow = 'var(--shadow-lg)';

            // Process dropdown items
            const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.style.color = 'var(--text-primary)';
                item.style.transition = 'all 0.2s ease';

                // Add hover effects
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = 'var(--bg-tertiary)';
                    item.style.color = 'var(--text-primary)';
                });

                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'transparent';
                    item.style.color = 'var(--text-primary)';
                });
            });
        }
    }

    /**
     * Process button elements
     */
    processButton(button) {
        button.style.borderRadius = '6px';
        button.style.fontWeight = '500';
        button.style.transition = 'all 0.2s ease';

        // Apply specific styling based on button class
        if (button.classList.contains('btn-primary')) {
            button.style.backgroundColor = 'var(--accent-primary)';
            button.style.borderColor = 'var(--accent-primary)';
            button.style.color = 'white';
        } else if (button.classList.contains('btn-secondary')) {
            button.style.backgroundColor = 'var(--text-secondary)';
            button.style.borderColor = 'var(--text-secondary)';
            button.style.color = 'white';
        } else if (button.classList.contains('btn-outline-primary')) {
            button.style.borderColor = 'var(--accent-primary)';
            button.style.color = 'var(--accent-primary)';
            button.style.backgroundColor = 'transparent';
        } else if (button.classList.contains('btn-outline-secondary')) {
            button.style.borderColor = 'var(--contrast-low)';
            button.style.color = 'var(--text-secondary)';
            button.style.backgroundColor = 'transparent';
        }
    }

    /**
     * Process form elements
     */
    processFormElement(element) {
        if (element.classList.contains('form-control') || element.classList.contains('form-select')) {
            element.style.backgroundColor = 'var(--bg-tertiary)';
            element.style.border = '1px solid var(--contrast-low)';
            element.style.color = 'var(--text-primary)';
            element.style.borderRadius = '6px';

            // Add focus handling
            element.addEventListener('focus', () => {
                element.style.borderColor = 'var(--accent-primary)';
                element.style.boxShadow = '0 0 0 0.2rem rgba(13, 110, 253, 0.25)';
            });

            element.addEventListener('blur', () => {
                element.style.borderColor = 'var(--contrast-low)';
                element.style.boxShadow = 'none';
            });
        }

        if (element.classList.contains('form-check-input')) {
            element.style.backgroundColor = 'var(--bg-tertiary)';
            element.style.border = '1px solid var(--contrast-low)';

            element.addEventListener('change', () => {
                if (element.checked) {
                    element.style.backgroundColor = 'var(--accent-primary)';
                    element.style.borderColor = 'var(--accent-primary)';
                } else {
                    element.style.backgroundColor = 'var(--bg-tertiary)';
                    element.style.borderColor = 'var(--contrast-low)';
                }
            });
        }
    }

    /**
     * Process badge elements
     */
    processBadge(badge) {
        badge.style.fontSize = '0.7rem';
        badge.style.fontWeight = '500';
        badge.style.padding = '0.25rem 0.5rem';
        badge.style.borderRadius = '4px';

        if (badge.classList.contains('bg-primary')) {
            badge.style.backgroundColor = 'var(--accent-primary)';
            badge.style.color = 'white';
        } else if (badge.classList.contains('bg-secondary')) {
            badge.style.backgroundColor = 'var(--text-secondary)';
            badge.style.color = 'white';
        }
    }

    /**
     * Process alert elements
     */
    processAlert(alert) {
        alert.style.borderRadius = '6px';
        alert.style.border = '1px solid transparent';

        if (alert.classList.contains('alert-primary')) {
            alert.style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
            alert.style.borderColor = 'rgba(13, 110, 253, 0.3)';
            alert.style.color = 'var(--accent-primary)';
        } else if (alert.classList.contains('alert-success')) {
            alert.style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
            alert.style.borderColor = 'rgba(25, 135, 84, 0.3)';
            alert.style.color = '#198754';
        } else if (alert.classList.contains('alert-danger')) {
            alert.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
            alert.style.borderColor = 'rgba(220, 53, 69, 0.3)';
            alert.style.color = '#dc3545';
        } else if (alert.classList.contains('alert-warning')) {
            alert.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
            alert.style.borderColor = 'rgba(255, 193, 7, 0.3)';
            alert.style.color = '#ffc107';
        }
    }

    /**
     * Process modal elements
     */
    processModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.backgroundColor = 'var(--bg-secondary)';
            modalContent.style.border = '1px solid var(--contrast-low)';
            modalContent.style.borderRadius = '8px';
            modalContent.style.boxShadow = 'var(--shadow-xl)';
        }

        const modalHeader = modal.querySelector('.modal-header');
        if (modalHeader) {
            modalHeader.style.borderBottom = '1px solid var(--contrast-low)';
            modalHeader.style.backgroundColor = 'var(--bg-tertiary)';
        }

        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.style.color = 'var(--text-primary)';
        }

        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.style.color = 'var(--text-primary)';
        }

        const modalFooter = modal.querySelector('.modal-footer');
        if (modalFooter) {
            modalFooter.style.borderTop = '1px solid var(--contrast-low)';
            modalFooter.style.backgroundColor = 'var(--bg-tertiary)';
        }
    }

    /**
     * Force refresh all elements
     */
    refreshAllElements() {
        // Remove all processed flags
        const processedElements = document.querySelectorAll('.bootstrap-processed');
        processedElements.forEach(element => {
            element.classList.remove('bootstrap-processed');
        });

        // Reprocess all elements
        this.processBootstrapElements(document.body);
    }
}

// Export singleton instance
export const dynamicElementsHandler = new DynamicElementsHandler();
