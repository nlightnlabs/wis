import sys
import os
import pandas as pd
import numpy as np
import pickle
import boto3
import io

try:
    import xgboost as xgb
    print(xgb.__version__)
except Exception:
    print(Exception)

# AWS S3 bucket and file path
bucket_name = 'nlightnlabs01'
file_key = 'wis/models/app_files.pkl'

# Initialize S3 client
s3_client = boto3.client('s3')

# Load app_files.pkl from S3
def load_app_files_from_s3():
    try:
        # Get the object from S3
        response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        file_content = response['Body'].read()

        # Load the pickle content
        app_files = pickle.load(io.BytesIO(file_content))
        
        return app_files
    except Exception as e:
        print(f"Error loading pickle file from S3: {e}")
        return None

# Predict APH at person level
def predict_person_APH(model, label_encoders, feature_params, person_json):
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
    return pred_aph

# Predict Person APH
def predict_person_aph(person_json):
    print(100 * "=")
    print(f"person_json: {person_json}")
    print(100 * "=")

    app_files = load_app_files_from_s3()
    if app_files is None:
        print("Failed to load model and parameters from S3.")
        return None

    model = app_files['model']
    label_encoders = app_files['label_encoders']
    feature_params = app_files['feature_params']

    try:
        result = predict_person_APH(model, label_encoders, feature_params, person_json)
        print("result of predict_person_APH: ", result)
        return result
    except Exception as e:
        print(f"Error running predict_person_APH: {e}")
        return None

    