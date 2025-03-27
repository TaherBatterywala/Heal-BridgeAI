// Categorized symptoms
const symptomsByCategory = {
    "Pain Symptoms": ["joint_pain", "stomach_pain", "back_pain", "abdominal_pain", "neck_pain", "knee_pain", "hip_joint_pain", "muscle_weakness"],
    "Skin Symptoms": ["itching", "skin_rash", "nodal_skin_eruptions", "patches_in_throat", "dischromic _patches", "blister", "red_sore_around_nose", "yellow_crust_ooze"],
    "Respiratory Symptoms": ["cough", "breathlessness", "chest_pain", "sinus_pressure", "runny_nose", "congestion", "phlegm", "throat_irritation"],
    "Digestive Symptoms": ["vomiting", "diarrhoea", "nausea", "loss_of_appetite", "indigestion", "constipation", "stomach_bleeding"],
    "Neurological Symptoms": ["headache", "dizziness", "irritability", "lack_of_concentration", "slurred_speech", "spinning_movements"],
    "Advanced Symptoms": ["coma", "fluid_overload", "abnormal_menstruation", "altered_sensorium", "toxic_look_(typhos)"],
};

// Function to create accordion-style symptom categories
window.onload = function() {
    let accordionContainer = document.querySelector('.accordion');

    Object.entries(symptomsByCategory).forEach(([category, symptoms]) => {
        let item = document.createElement("div");
        item.classList.add("accordion-item");

        let header = document.createElement("div");
        header.classList.add("accordion-header");
        header.innerText = category;
        header.onclick = function() {
            let content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
        };

        let content = document.createElement("div");
        content.classList.add("accordion-content");

        symptoms.forEach(symptom => {
            let label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" name="symptom" value="${symptom}"> ${symptom.replace(/_/g, " ")}`;
            content.appendChild(label);
        });

        item.appendChild(header);
        item.appendChild(content);
        accordionContainer.appendChild(item);
    });
};

// Handle form submission
document.getElementById("symptomForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let selectedSymptoms = {};
    document.querySelectorAll('input[name="symptom"]').forEach(checkbox => {
        selectedSymptoms[checkbox.value] = checkbox.checked ? "yes" : "no";
    });

    document.getElementById("result").innerText = "Predicted Disease: Example Disease"; // Placeholder output
});
