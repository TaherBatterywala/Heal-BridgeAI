import os
import sys
import matplotlib 
from dataclasses import dataclass


from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Lasso
from sklearn.linear_model import Ridge
from sklearn.linear_model import ElasticNet
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.ensemble import GradientBoostingClassifier
from xgboost import XGBClassifier

from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix,fbeta_score

from src.exception import CustomException
from src.logger import logging

from src.utils import save_object,evaluate_models

@dataclass
class ModelTrainerConfig:
    trained_model_file_path=os.path.join("artifacts","churn.pkl")

class ModelTrainer:
    def __init__(self):
        self.model_trainer_config=ModelTrainerConfig()


    def initiate_model_trainer(self,train_array,test_array):
        try:
            logging.info("Split training and test input data")
            X_train,y_train,X_test,y_test=(
                train_array[:,:-1],
                train_array[:,-1],
                test_array[:,:-1],
                test_array[:,-1]
            )
            models = {
                #"Linear Regression": LinearRegression(),
                #"Lasso":Lasso(),
                #"ridge":Ridge(),
                #"elasticnet":ElasticNet(),

                "logistic":LogisticRegression(),
                "svc":SVC(),
                "nb":GaussianNB(),
                "knn":KNeighborsClassifier(),
                "Decision Tree": DecisionTreeClassifier(),
                "Random Forest": RandomForestClassifier(),
                "AdaBoost classifier": AdaBoostClassifier(),
                "Gradient Boosting": GradientBoostingClassifier(),
                "XGBClassifier": XGBClassifier(),
            }
           
            params={
                '''"Linear Regression":{},

                "Lasso":{},

                "ridge":{},

                "elasticnet":{},'''
        
        
                "logistic":{
                    'penalty':['l1', 'l2', 'elasticnet'],
                    'C':[100,10,1.0,0.1,0.01],
                    'solver':['newton-cg', 'lbfgs', 'liblinear', 'sag', 'saga']
                },

                "svc":{
                    'C': [0.1, 1, 10, 100, 1000],
                    'gamma': [1, 0.1, 0.01, 0.001, 0.0001],
                    'kernel': ['rbf']
                },

                "nb":{},

                "knn":{},

                "Decision Tree": {
                    'criterion':['squared_error', 'friedman_mse', 'absolute_error', 'poisson','gini','entropy', 'log_loss'],
                     # 'splitter':['best','random'],
                    'max_depth':[1,2,3,4,5],
                    # 'max_features':['auto','sqrt','log2'],
                },

                "Random Forest":{
                    # 'criterion':['squared_error', 'friedman_mse', 'absolute_error', 'poisson'],
                    "max_depth": [5, 8, 15, None, 10],    
                    # 'max_features':['sqrt','log2',None],
                    "min_samples_split": [2, 8, 15, 20],
                    'n_estimators': [8,16,32,64,128,256]
                },

                "AdaBoost classifier":{
                    'learning_rate':[.1,.01,0.5,.001],
                    # 'loss':['linear','square','exponential'],
                    'n_estimators': [8,16,32,64,128,256],
                    "algorithm":['SAMME','SAMME.R']
                },

                "Gradient Boosting":{
                    # 'loss':['squared_error', 'huber', 'absolute_error', 'quantile'],
                    'learning_rate':[.1,.01,.05,.001],
                    'subsample':[0.6,0.7,0.75,0.8,0.85,0.9],
                    # 'criterion':['squared_error', 'friedman_mse'],
                    # 'max_features':['auto','sqrt','log2'],
                    'n_estimators': [8,16,32,64,128,256]
                },
        
                "XGBClassifier":{
                    'learning_rate':[.1,.01,.05,.001],
                    'n_estimators': [8,16,32,64,128,256],
                    "max_depth": [5, 8, 12, 20, 30],
                    "colsample_bytree": [0.5, 0.8, 1, 0.3, 0.4]
                }
            }    
            

            model_report:dict=evaluate_models(X_train=X_train,y_train=y_train,X_test=X_test,y_test=y_test,
                                             models=models)#,param=params)
           
            ## To get best model score from dict
            best_model_score = max(sorted(model_report.values()))

            ## To get best model name from dict

            best_model_name = list(model_report.keys())[
                list(model_report.values()).index(best_model_score)
            ]
            best_model = models[best_model_name]

            
            logging.info(f"Best found model on both training and testing dataset")

            save_object(
                file_path=self.model_trainer_config.trained_model_file_path,
                obj=best_model
            )

            predicted=best_model.predict(X_test)
            classification_repor=confusion_matrix(y_test,predicted)
            accuracy = accuracy_score(y_test, predicted)*100


            

            return accuracy,best_model,classification_repor
            



            
        except Exception as e:
            raise CustomException(e,sys)