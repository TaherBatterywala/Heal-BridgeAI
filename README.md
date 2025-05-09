# 🏥 HealBridge AI

An intelligent disease prediction system that helps users identify potential health conditions based on their symptoms.

---

## 📁 Project Structure

```
HealBridge-AI/
│
├── artifacts/           # Model artifacts and saved files
├── logs/               # Log files
├── src/                # Source code
│   ├── components/     # ML pipeline components
│   │   ├── data_ingestion.py
│   │   ├── data_transformation.py
│   │   └── model_trainer.py
│   ├── pipeline/       # Prediction pipeline
│   │   └── predict_pipeline.py
│   ├── exception.py    # Custom exception handling
│   ├── logger.py       # Logging configuration
│   ├── utils.py        # Utility functions
│   └── __init__.py
├── static/            # Static files (CSS, JS, images)
├── templates/         # HTML templates
│   ├── index.html
│   ├── predict.html
│   └── about.html
├── model_disease.pkl  # Trained disease prediction model
├── disease_encoder.pkl # Label encoder for diseases
├── disease_scaler.pkl # Feature scaler
├── model_scaler.pkl   # Additional model scaler
├── All Symptoms.txt   # List of all possible symptoms
├── Training.csv       # Training dataset
├── Testing.csv        # Testing dataset
├── Jupyter.ipynb      # Data analysis and model development
├── app.py            # Flask web application
├── setup.py          # Project setup configuration
├── requirements.txt  # Project dependencies
└── README.md
```

---

## 📝 Key Components

- **model_disease.pkl**: Trained machine learning model for disease prediction
- **disease_encoder.pkl**: Encoder for disease labels
- **disease_scaler.pkl**: Feature scaler for model input
- **All Symptoms.txt**: Comprehensive list of symptoms used for prediction
- **app.py**: Main Flask application with prediction logic
- **templates/**: 
  - `index.html`: Landing page
  - `predict.html`: Symptom selection and prediction interface
  - `about.html`: Project information page
- **static/**: Static assets for the web interface

---

## ⚙️ How It Works

1. **Symptom Selection:** Users select their symptoms from categorized groups
2. **Data Processing:** Selected symptoms are converted into model input format
3. **Prediction:** Machine learning model predicts potential diseases
4. **Result Display:** Results are shown to the user with relevant information

---

## 🌐 Web App Preview


---

## 🌐 Features

- Categorized symptom selection for easy navigation
- Real-time disease prediction
- User-friendly interface
- Comprehensive symptom database
- Accurate machine learning model

---

## 🚦 Quick Start

```bash
git clone https://github.com/yourusername/HealBridge-AI.git
cd HealBridge-AI
pip install -r requirements.txt
python app.py
```
Visit [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## ⚠️ Disclaimer

This tool is designed to provide preliminary health insights and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
