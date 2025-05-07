from flask import Flask, render_template, request, jsonify
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

def load_symptoms():
    with open("All Symptoms.txt", "r") as file:
        symptoms = [line.strip() for line in file.readlines()]
    return symptoms

# Load all symptoms for model input
all_symptoms = load_symptoms()

# Categorized symptoms for user-facing display
general_issues = [
    "fatigue", "headache", "high_fever", "mild_fever", "sweating", "dehydration",
    "lethargy", "malaise", "fast_heart_rate", "weight_gain", "weight_loss",
    "restlessness", "cramps", "chills", "shivering", "sunken_eyes"
]

skin_appearance_issues = [
    "itching", "skin_rash", "nodal_skin_eruptions", "pus_filled_pimples", "blackheads",
    "scurring", "skin_peeling", "silver_like_dusting", "small_dents_in_nails", "inflammatory_nails",
    "blister", "red_sore_around_nose", "yellow_crust_ooze", "puffy_face_and_eyes", "brittle_nails",
    "swollen_extremeties", "yellowish_skin"
]

respiratory_issues = [
    "continuous_sneezing", "cough", "breathlessness", "phlegm", "throat_irritation", "redness_of_eyes",
    "sinus_pressure", "runny_nose", "congestion", "chest_pain", "rusty_sputum", "blood_in_sputum",
    "watering_from_eyes", "loss_of_smell", "pain_behind_the_eyes", "yellowing_of_eyes"
]

digestive_issues = [
    "vomiting", "stomach_pain", "indigestion", "nausea", "loss_of_appetite", "diarrhoea", "constipation",
    "abdominal_pain", "yellow_urine", "dark_urine", "acidity", "passage_of_gases", "pain_during_bowel_movements",
    "bloody_stool"
]

neuro_muscular_issues = [
    "dizziness", "loss_of_balance", "unsteadiness", "stiff_neck", "visual_disturbances", "muscle_wasting",
    "muscle_weakness", "joint_pain", "back_pain", "neck_pain", "swollen_legs", "swollen_blood_vessels",
    "muscle_pain", "painful_walking", "pain_in_anal_region", "weakness_in_limbs"
]

urine_hormone_repro_issues = [
    "burning_micturition", "irregular_sugar_level", "polyuria", "bladder_discomfort", "abnormal_menstruation",
    "cold_hands_and_feets", "enlarged_thyroid", "increased_appetite", "excessive_hunger", "obesity", "irritation_in_anus"
]

mental_heart_issues = [
    "anxiety", "mood_swings", "depression", "irritability", "palpitations", "prominent_veins_on_calf", "swelled_lymph_nodes"
]

# Categorize all symptoms into one dictionary
categorized_symptoms = {
    'General Issues': general_issues,
    'Skin Appearance Issues': skin_appearance_issues,
    'Respiratory Issues': respiratory_issues,
    'Digestive Issues': digestive_issues,
    'Neuro-Muscular Issues': neuro_muscular_issues,
    'Urine, Hormonal, and Reproductive Issues': urine_hormone_repro_issues,
    'Mental and Heart Issues': mental_heart_issues
}

# Load your trained model
with open("model_disease.pkl", "rb") as f:
    model = pickle.load(f)

# Load the OneHotEncoder used during training
with open("disease_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

# Load your scaler if used
with open("disease_scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "POST":
        try:
            # Get all form data
            form_data = request.form
            
            # Collect selected symptoms
            selected_symptoms = []
            for category in categorized_symptoms.values():
                for symptom in category:
                    if form_data.get(symptom) == 'on':
                        selected_symptoms.append(symptom)
            
            if len(selected_symptoms) < 3:
                return render_template("predict.html", 
                                    categorized_symptoms=categorized_symptoms,
                                    error="Please select at least 3 symptoms")

            # Create input vector
            input_data = [1 if symptom in selected_symptoms else 0 for symptom in all_symptoms]
            input_array = np.array(input_data).reshape(1, -1)

            # Scale the input
            input_scaled = scaler.transform(input_array)

            # Make prediction
            prediction = model.predict(input_scaled)
            predicted_index = int(prediction[0])
            disease_name = encoder.categories_[0][predicted_index]

            return render_template("predict.html", 
                                categorized_symptoms=categorized_symptoms,
                                prediction=disease_name)
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            return render_template("predict.html", 
                                categorized_symptoms=categorized_symptoms,
                                error="An error occurred during prediction. Please try again.")

    return render_template("predict.html", categorized_symptoms=categorized_symptoms)

@app.route("/about")
def about():
    return render_template("about.html")

if __name__ == "__main__":
    app.run(debug=True) 