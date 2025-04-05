document.addEventListener('DOMContentLoaded', function() {
    // Animation delay for sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${0.1 + index * 0.1}s`;
    });

    // Setup accordion functionality
    setupAccordion();
    
    // Setup form submission
    setupForm();
    
    // Convert ugly checkbox inputs
    enhanceCheckboxes();
});

// Create accordion effect for symptom sections
function setupAccordion() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        // Create header element
        const title = section.querySelector('h3');
        const content = document.createElement('div');
        content.className = 'section-content';
        
        // Move all elements except the title into content
        Array.from(section.children).forEach(child => {
            if (child !== title) {
                content.appendChild(child);
            }
        });
        
        // Create header wrapper
        const header = document.createElement('div');
        header.className = 'section-header';
        section.insertBefore(header, title);
        header.appendChild(title);
        
        section.appendChild(content);
        
        // Set first section as active by default
        if (section === sections[0]) {
            section.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
        
        // Add click event
        header.addEventListener('click', () => {
            const isActive = section.classList.contains('active');
            
            // Close all sections
            sections.forEach(s => {
                s.classList.remove('active');
                s.querySelector('.section-content').style.maxHeight = null;
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                section.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// Enhance checkboxes with custom styling
function enhanceCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        const originalLabel = checkbox.nextSibling;
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
        label.textContent = formatSymptomName(labelText);
        
        // Replace original elements
        checkbox.parentNode.insertBefore(wrapper, checkbox);
        wrapper.appendChild(checkbox);
        wrapper.appendChild(checkmark);
        wrapper.appendChild(label);
        
        originalLabel.remove();
    });
    
    // Organize checkboxes in grid
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const content = section.querySelector('.section-content');
        const checkboxesContainer = document.createElement('div');
        checkboxesContainer.className = 'checkboxes';
        
        // Move all checkbox wrappers to the grid container
        const wrappers = Array.from(content.querySelectorAll('.checkbox-wrapper'));
        wrappers.forEach(wrapper => {
            checkboxesContainer.appendChild(wrapper);
        });
        
        content.prepend(checkboxesContainer);
    });
}

// Format symptom names for better readability
function formatSymptomName(name) {
    return name
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Setup form submission with animations
function setupForm() {
    const form = document.querySelector('form');
    const resultElement = document.getElementById('result');
    
    // Create loader element
    const loader = document.createElement('div');
    loader.className = 'loader';
    form.appendChild(loader);
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loader
        const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
        submitBtn.style.display = 'none';
        loader.style.display = 'block';
        
        // If this were a real form submission:
        // const formData = new FormData(form);
        // const response = await fetch('/predict', { method: 'POST', body: formData });
        // const data = await response.json();
        
        // Simulate processing
        setTimeout(() => {
            // Hide loader
            loader.style.display = 'none';
            submitBtn.style.display = 'block';
            
            // Show result (in a real app, this would use the actual response)
            if (countCheckedSymptoms() < 3) {
                showResult('Please select at least 3 symptoms for accurate prediction', 'warning');
            } else {
                // This would be replaced with actual prediction from backend
                const diseases = ['Common Cold', 'Influenza', 'Allergic Rhinitis', 'Bronchitis'];
                const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
                
                showResult(`Predicted Disease: ${randomDisease}`, 'normal');
                
                // In the actual app, you would access the prediction from Flask
                // showResult(`Predicted Disease: ${data.prediction}`, getSeverityClass(data.prediction));
            }
        }, 1500);
    });
    
    // Helper to count checked symptoms
    function countCheckedSymptoms() {
        return document.querySelectorAll('input[type="checkbox"]:checked').length;
    }
    
    // Helper to show result with animation
    function showResult(message, type) {
        resultElement.textContent = message;
        resultElement.className = '';
        resultElement.classList.add('result-' + type);
        
        // Force reflow for animation
        void resultElement.offsetWidth;
        
        resultElement.classList.add('show');
    }
    
    // Helper to determine severity class (would use actual disease data)
    function getSeverityClass(disease) {
        const severeConditions = ['Tuberculosis', 'Pneumonia', 'Heart attack', 'Jaundice'];
        const moderateConditions = ['Dengue', 'Typhoid', 'Malaria', 'Gastroenteritis'];
        
        if (severeConditions.includes(disease)) return 'danger';
        if (moderateConditions.includes(disease)) return 'warning';
        return 'normal';
    }
}

// Add progress indicator when many symptoms are selected
function updateSymptomCount() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    
    // Create or update progress indicator
    let progressIndicator = document.querySelector('.progress-indicator');
    
    if (!progressIndicator) {
        progressIndicator = document.createElement('div');
        progressIndicator.className = 'progress-indicator';
        document.querySelector('.container').insertBefore(
            progressIndicator, 
            document.querySelector('form').nextSibling
        );
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
    const submitButton = document.querySelector('input[type="submit"], button[type="submit"]');
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
}

// Add event listeners to all checkboxes to update count
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
        updateSymptomCount();
    }
});

// Initialize symptom count on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateSymptomCount, 500); // Delay to ensure all checkboxes are enhanced
});