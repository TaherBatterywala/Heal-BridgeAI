document.addEventListener('DOMContentLoaded', function() {
    // Setup accordion functionality
    setupAccordion();
    
    // Setup form submission
    setupForm();
    
    // Convert standard checkboxes to enhanced checkboxes
    enhanceCheckboxes();
    
    // Initialize symptom count
    setTimeout(updateSymptomCount, 500);
});

// Create accordion effect for symptom categories
function setupAccordion() {
    // Create sections for each symptom category
    const form = document.querySelector('form');
    const categories = form.querySelectorAll('h3');
    
    categories.forEach((category, index) => {
        // Create a section for each category
        const section = document.createElement('div');
        section.className = 'section';
        section.style.setProperty('--i', index); // For animation delay
        
        // Find all elements until the next h3
        const siblings = [];
        let nextElement = category.nextElementSibling;
        
        while (nextElement && nextElement.tagName !== 'H3' && nextElement.tagName !== 'INPUT') {
            siblings.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }
        
        // Create header element
        const header = document.createElement('div');
        header.className = 'section-header';
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'section-content';
        
        // Move elements to their new containers
        form.insertBefore(section, category);
        header.appendChild(category);
        section.appendChild(header);
        section.appendChild(content);
        
        siblings.forEach(sibling => {
            content.appendChild(sibling);
        });
        
        // Set first section as active by default
        if (index === 0) {
            section.classList.add('active');
            // Calculate actual content height
            setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
            }, 0);
        }
        
        // Add click event
        header.addEventListener('click', () => {
            const isActive = section.classList.contains('active');
            
            // Close all sections
            document.querySelectorAll('.section').forEach(s => {
                s.classList.remove('active');
                s.querySelector('.section-content').style.maxHeight = null;
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                section.classList.add('active');
                // Calculate actual content height - small delay for DOM update
                setTimeout(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }, 0);
            }
        });
    });
    
    // Move the submit button outside sections
    const submitBtn = form.querySelector('input[type="submit"]');
    form.appendChild(submitBtn);
    
    // Add a container for the result if it doesn't exist
    if (!document.getElementById('result')) {
        const resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        form.parentNode.insertBefore(resultDiv, form.nextSibling);
    }
}

// Enhance checkboxes with custom styling
function enhanceCheckboxes() {
    const checkboxContainers = document.querySelectorAll('.section-content');
    
    checkboxContainers.forEach(container => {
        // Create a grid for checkboxes
        const checkboxesGrid = document.createElement('div');
        checkboxesGrid.className = 'checkboxes';
        container.prepend(checkboxesGrid);
        
        // Find all checkbox inputs
        const inputs = container.querySelectorAll('input[type="checkbox"]');
        
        inputs.forEach(input => {
            const originalLabel = input.nextSibling;
            const labelText = originalLabel.textContent.trim();
            
            // Create wrapper
            const wrapper = document.createElement('label');
            wrapper.className = 'checkbox-wrapper';
            
            // Create custom checkmark
            const checkmark = document.createElement('span');
            checkmark.className = 'checkmark';
            
            // Create label text
            const label = document.createElement('span');
            label.className = 'symptom-label';
            label.textContent = labelText;
            
            // Add wrapper to grid
            checkboxesGrid.appendChild(wrapper);
            
            // Add elements to wrapper
            wrapper.appendChild(input);
            wrapper.appendChild(checkmark);
            wrapper.appendChild(label);
            
            // Remove original label
            originalLabel.remove();
            
            // Add event listener to update count when clicked
            input.addEventListener('change', updateSymptomCount);
        });
    });
}

// Setup form submission
function setupForm() {
    const form = document.querySelector('form');
    
    // Change submit button to a nicer button
    const oldSubmit = form.querySelector('input[type="submit"]');
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn';
    submitBtn.textContent = 'Predict Disease'; // Changed button text
    form.replaceChild(submitBtn, oldSubmit);
    
    // Create loader element
    const loader = document.createElement('div');
    loader.className = 'loader';
    form.appendChild(loader);
    
    // Add result container if it doesn't exist
    if (!document.getElementById('result')) {
        const resultElement = document.createElement('div');
        resultElement.id = 'result';
        form.parentNode.insertBefore(resultElement, form.nextSibling);
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        // You can add form validation here if needed
        // Show loader on submit
        loader.style.display = 'block';
        submitBtn.style.display = 'none';
    });
}

// Add progress indicator when symptoms are selected
function updateSymptomCount() {
    const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    
    // Create or update progress indicator
    let progressIndicator = document.querySelector('.progress-indicator');
    
    if (!progressIndicator) {
        progressIndicator = document.createElement('div');
        progressIndicator.className = 'progress-indicator';
        const form = document.querySelector('form');
        form.insertBefore(progressIndicator, form.querySelector('.section:first-child'));
    }
    
    const percentage = Math.min(100, Math.round((checkedCount / 3) * 100));
    progressIndicator.innerHTML = `
        <div class="progress-bar">
            <div class="progress" style="width: ${percentage}%"></div>
        </div>
        <div class="progress-text">${checkedCount} symptom${checkedCount !== 1 ? 's' : ''} selected</div>
    `;
    
    // Add classes based on count
    progressIndicator.className = 'progress-indicator';
    if (checkedCount >= 3) progressIndicator.classList.add('sufficient');
    
    // Update submit button state
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        if (checkedCount < 3) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
            submitButton.title = 'Please select at least 3 symptoms';
        } else {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.title = '';
        }
    }
    
    // Update section content heights for active sections
    document.querySelectorAll('.section.active').forEach(section => {
        const content = section.querySelector('.section-content');
        // Small delay to ensure DOM is updated
        setTimeout(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
        }, 10);
    });
}