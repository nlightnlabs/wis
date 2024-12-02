import sys
import os
import pandas as pd
import numpy as np


try:
    import xgboost as xgb
    print(xgb.__version__)
except Exception:
    print(Exception)



# Predict Person APH
def predict_person_aph(person_json, model_files): 

    model = model_files['model']
    label_encoders = model_files['label_encoders']
    feature_params = model_files['feature_params']

    try:
        person_df = pd.DataFrame([person_json])
        categorical_columns = feature_params['person_categorical_features'] + feature_params['event_categorical_features']

        for col in categorical_columns:
            if col in person_df.columns:
                try:
                    person_df[col] = label_encoders[col].transform(person_df[col])
                except ValueError as e:
                    print(f"Error transforming column '{col}': {e}")

        # Predict APH using the model
        pred_aph = np.round(model.predict(xgb.DMatrix(person_df)), 1)[0]
        print("pred_aph",pred_aph)
        return pred_aph

    except Exception as e:
        print(f"Error running predict_person_APH: {e}")
        return None

    