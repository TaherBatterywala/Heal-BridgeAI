import sys
from dataclasses import dataclass
import pickle
import numpy as np 
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder,StandardScaler

from src.exception import CustomException
from src.logger import logging
import os

from src.utils import save_object
print("RUNNING Customer Churn Prediction data_transformation.py")

@dataclass
class DataTransformationConfig:
    preprocessor_obj_file_path=os.path.join('artifacts',"proprocessor_disease.pkl")

class DataTransformation:
    def __init__(self):
        self.data_transformation_config=DataTransformationConfig()

    def get_data_transformer_object(self):
        '''
        This function si responsible for data trnasformation
        
        '''
        try:
            numerical_columns = ["fatigue", "headache", "high_fever", "mild_fever", "sweating", "dehydration","lethargy", "malaise", "swelled_lymph_nodes",
                                "fast_heart_rate", "weight_gain", "weight_loss","restlessness", "cramps", "chills", "shivering", "sunken_eyes",
                                "itching", "skin_rash", "nodal_skin_eruptions", "pus_filled_pimples", "blackheads","scurring", "skin_peeling", 
                                "silver_like_dusting", "small_dents_in_nails", "inflammatory_nails","blister", "red_sore_around_nose", "yellow_crust_ooze", 
                                "puffy_face_and_eyes", "brittle_nails","swollen_extremeties", "yellowish_skin","continuous_sneezing", "cough", "breathlessness", 
                                "phlegm", "throat_irritation", "redness_of_eyes","sinus_pressure", "runny_nose", "congestion", "chest_pain", "rusty_sputum", "blood_in_sputum",
                                "watering_from_eyes", "loss_of_smell", "pain_behind_the_eyes", "yellowing_of_eyes","vomiting", "stomach_pain", "indigestion", "nausea", 
                                "loss_of_appetite", "diarrhoea", "constipation","abdominal_pain", "yellow_urine", "dark_urine", "acidity", "passage_of_gases", 
                                "pain_during_bowel_movements","bloody_stool","dizziness", "loss_of_balance", "unsteadiness", "stiff_neck", "visual_disturbances", 
                                "muscle_wasting","muscle_weakness", "joint_pain", "back_pain", "neck_pain", "swollen_legs", "swollen_blood_vessels","muscle_pain", 
                                "painful_walking", "pain_in_anal_region", "weakness_in_limbs","burning_micturition", "irregular_sugar_level", "polyuria", 
                                "bladder_discomfort", "abnormal_menstruation","cold_hands_and_feets", "enlarged_thyroid", "increased_appetite", "excessive_hunger", 
                                "obesity", "irritation_in_anus","anxiety", "mood_swings", "depression", "irritability", "palpitations", "prominent_veins_on_calf"
    ]
            categorical_columns = []

            num_pipeline= Pipeline(
                steps=[
                ("imputer",SimpleImputer(strategy="median")),
                ("scaler",StandardScaler())

                ]
            )

            cat_pipeline=Pipeline(

                steps=[
                ("imputer",SimpleImputer(strategy="most_frequent")),
                ("one_hot_encoder",OneHotEncoder()),
                ("scaler",StandardScaler(with_mean=False))
                ]

            )

            logging.info(f"Categorical columns: {categorical_columns}")
            logging.info(f"Numerical columns: {numerical_columns}")

            preprocessor=ColumnTransformer(
                [
                ("num_pipeline",num_pipeline,numerical_columns),
                ("cat_pipelines",cat_pipeline,categorical_columns)

                ]


            )
            return preprocessor
        
        except Exception as e:
            raise CustomException(e,sys)
        
    def initiate_data_transformation(self,train_path,test_path):

        try:
            train_df=pd.read_csv(train_path)
            test_df=pd.read_csv(test_path)

            logging.info("Read train and test data completed")

            logging.info("Obtaining preprocessing object")

            preprocessing_obj=self.get_data_transformer_object()
            
            target_column_name="prognosis"
            # Add these lines RIGHT BEFORE dropping columns
            logging.info(f"Train columns: {train_df.columns}")
            if target_column_name not in train_df.columns:
                raise ValueError(f"Target column '{target_column_name}' not found in DataFrame")


            input_feature_train_df=train_df.drop(columns=[target_column_name],axis=1)
            target_feature_train_df=train_df[target_column_name]

            input_feature_test_df=test_df.drop(columns=[target_column_name],axis=1)
            target_feature_test_df=test_df[target_column_name]

            logging.info(
                f"Applying preprocessing object on training dataframe and testing dataframe."
            )

            input_feature_train_arr=preprocessing_obj.fit_transform(input_feature_train_df)
            input_feature_test_arr=preprocessing_obj.transform(input_feature_test_df)
            with open("disease_encoder.pkl", "rb") as f:
                encoder = pickle.load(f)
            target_feature_train_df=encoder.fit_transform(target_feature_train_df.values.reshape(-1,1))
            target_feature_test_df=encoder.transform(target_feature_test_df.values.reshape(-1,1))
            target_feature_train_df = np.argmax(target_feature_train_df, axis=1)  # Convert one-hot to label indices
            target_feature_test_df = np.argmax(target_feature_test_df, axis=1)

            train_arr = np.c_[
                input_feature_train_arr, np.array(target_feature_train_df)
            ]
            test_arr = np.c_[input_feature_test_arr, np.array(target_feature_test_df)]

            logging.info(f"Saved preprocessing object.")

            save_object(

                file_path=self.data_transformation_config.preprocessor_obj_file_path,
                obj=preprocessing_obj

            )

            return (
                train_arr,
                test_arr,
                self.data_transformation_config.preprocessor_obj_file_path,
            )
        except Exception as e:
            raise CustomException(e,sys)
