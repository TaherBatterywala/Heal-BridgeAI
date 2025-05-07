document.addEventListener('DOMContentLoaded', function() {
    // Setup accordion functionality
    setupAccordion();
    
    // Setup form handling
    setupForm();
    
    // Initialize symptom count
    updateSymptomCount();
});

function setupAccordion() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');
        
        if (header && content) {
            // Set initial state
            content.style.maxHeight = '0px';
            
            header.addEventListener('click', () => {
                const isActive = section.classList.contains('active');
                
                // Close all sections
                sections.forEach(s => {
                    s.classList.remove('active');
                    const c = s.querySelector('.section-content');
                    if (c) {
                        c.style.maxHeight = '0px';
                    }
                });
                
                // Open clicked section if it wasn't active
                if (!isActive) {
                    section.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });
}

function setupForm() {
    const form = document.getElementById('prediction-form');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    if (form) {
        // Add change event listener to all checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSymptomCount();
                
                // Update the visual state of the checkbox
                const wrapper = this.closest('.checkbox-wrapper');
                if (wrapper) {
                    if (this.checked) {
                        wrapper.classList.add('checked');
                    } else {
                        wrapper.classList.remove('checked');
                    }
                }
            });
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            const selectedSymptoms = document.querySelectorAll('input[type="checkbox"]:checked');
            
            if (selectedSymptoms.length < 3) {
                e.preventDefault();
                alert('Please select at least 3 symptoms');
                return;
            }
        });
    }
}

function updateSymptomCount() {
    const countElement = document.getElementById('symptom-count');
    const predictBtn = document.getElementById('predict-btn');
    
    if (countElement && predictBtn) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const count = checkboxes.length;
        
        // Update count display
        countElement.textContent = count;
        
        // Update predict button state
        predictBtn.disabled = count < 3;
        predictBtn.style.opacity = count < 3 ? '0.6' : '1';
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    const sections = document.querySelectorAll('.section.active');
    sections.forEach(section => {
        const content = section.querySelector('.section-content');
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});