import sys
import os
import pandas as pd
import numpy as np
import pickle

try:
    import xgboost as xgb
    print(xgb.__version__)
except Exception:
    print(Exception)

file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app_files.pkl")

pd.set_option('display.max_columns', None)

# Optionally, you can also adjust other settings for better visibility
pd.set_option('display.max_rows', None)           # Show all rows if needed
pd.set_option('display.max_colwidth', None)       # Show full column width for each cell
pd.set_option('display.width', None)   


# Predict APH at person level
def predict_person_APH(model, label_encoders, feature_params, person_json):

    person_df = pd.DataFrame([person_json])
    categorical_columns = feature_params['person_categorical_features'] +  feature_params['event_categorical_features'] # Replace with your actual categorical columns

    for col in categorical_columns:
        if col in person_df.columns:  # Ensure the column exists in the sample dataframe
            try:
                # Wrap in a try-except to handle potential errors gracefully
                person_df[col] = label_encoders[col].transform(person_df[col])
            except ValueError as e:
                print(f"Error transforming column '{col}': {e}")
                # Handle the error appropriately, e.g., skip the column, impute a value, etc.

    # Now use the updated sample_df for prediction:
    pred_aph = np.round(model.predict(xgb.DMatrix(person_df)), 1)[0]

    return pred_aph
    

# Predict Person APH
def predict_person_aph(person_json):

    print(100*"=")
    print(f"person_json: {person_json}")
    print(100*"=")

    try:
        with open(file_path, "rb") as file:
            app_files = pickle.load(file)
    
        model              = app_files['model']
        label_encoders     = app_files['label_encoders']
        feature_params     = app_files['feature_params']
    except Exception as e:
        print(f"Error importing app_files: {e}")


    try:
        result = predict_person_APH(model, label_encoders, feature_params, person_json)
        print("result of predict_person_APH: ",result)
        return result
    except Exception as e:
        print(f"Error running predict_APH: {e}")

    