import sys
import pandas as pd
from src.exception import CustomException
from src.utils import load_object
import os


class PredictPipeline:
    def __init__(self):
        pass

    def predict(self,features):
        try:
            model_path=os.path.join("artifacts","disease.pkl")
            preprocessor_path=os.path.join('artifacts','proprocessor_disease.pkl')
            model=load_object(file_path=model_path)
            preprocessor=load_object(file_path=preprocessor_path)
            data_scaled=preprocessor.transform(features)
            preds=model.predict(data_scaled)
            return preds
        
        except Exception as e:
            raise CustomException(e,sys)

import numpy as np
import pandas as pd

class CustomData:
    def __init__(self, form, all_symptoms):
        # Set all symptoms to 0 by default, 1 if present in form
        for symptom in all_symptoms:
            setattr(self, symptom, 1 if form.get(symptom) else 0)
        self.all_symptoms = all_symptoms

    def get_data_as_array(self):
        # Return the features as an ordered array
        return [getattr(self, symptom) for symptom in self.all_symptoms]

