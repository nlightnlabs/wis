import sys
import os

# Add current folder to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pandas as pd
import numpy as np
import requests

import pandasql as psql
from datetime import date, timedelta, time
from geopy.distance import geodesic
from dotenv import load_dotenv
from flask import jsonify
from io import StringIO
import random
from datetime import datetime

from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, DateTime, inspect, text, inspect
from sqlalchemy.types import Boolean, Numeric, BigInteger, Date
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.dialects.postgresql import insert


from predict_person_aph import predict_person_aph


# Get Staff Data from Database
def getStaffData(parameters):
  
    district = parameters.get("district")

    district_condition = "" if district == "All" else f"WHERE most_common_district = '{district}'"

    query = f"""
        SELECT 
        person_id AS "Employee ID",
        most_common_district AS "Most Common District",
        round(median_aph,0) AS "Historical APH",
        round(median_wage_rate,2) AS "Wage Rate",
        most_common_role AS "Role",
        most_common_performance_rating AS "Performance Rating",
        most_common_pay_basis AS "Pay Basis", 
        most_common_employee_postal_code AS "Employee Postal Code",
        date_of_hire AS "Date of Hire",
        date_of_birth AS "Date of Birth",
        gender AS "Gender"

        FROM staff_data
        {district_condition}
        ORDER BY "Historical APH" DESC;
    """

    url = "https://nlightnlabs.net/nlightn/db/query"
    body = {
        "query": query,
        "dbName": "wis"
    }

    # Send the POST request
    try:
        response = requests.post(url, json=body)
    except Exception as e:
        print(f"Error with database query: {e}")

    # Check if the request was successful
    try:
        if response.status_code == 200:
            # Parse JSON response data into a DataFrame
            data = response.json()
            df = pd.DataFrame(data)
            return df
        else:
            print("Request failed with status code:", response.status_code)
            print(response.text)  # Print error message from the server, if any
    except Exception as e:
            print(f"Error converting data to df. {e}")



def defineDataTypes(df):

    print(df.info())

    df["Employee Postal Code"] = df["Employee Postal Code"].apply(
        lambda x: str(int(float(x))) if pd.notnull(x) and x.replace('.', '', 1).isdigit() else ""
    )

    stringfields = [
        'Employee ID',
        'Most Common District',
        'Role',
        'Performance Rating',
        'Pay Basis',
        'Wage Rate',
        'Employee Postal Code',
        'Gender',
    ]

    datetimefields = [
        'Date of Hire',
        'Date of Birth',
    ]

    intfields = [

    ]

    floatfields = [
        'Historical APH',
        'Wage Rate',
    ]

    #Convert fields to strings
    for field in stringfields:
        df[field] = df[field].astype(str)

    #Convert fields to datetime
    for field in datetimefields:
        df[field] = pd.to_datetime(df[field], errors='coerce')

    #Convert fields to integers
    for field in intfields:
        df[field] = df[field].astype(int)

    #Convert fields to floats
    for field in floatfields:
        df[field] = df[field].astype(float)

    print(df.info())

    return df


# Set Event Date
def setEventDate(parameters):
    event_date = parameters.get("event_date")
    try:
        event_date = event_date if event_date is not None else date.today() + timedelta(days=7)
        event_date = pd.to_datetime(event_date)
        return event_date
    except:
        errorMessage = "Error processing event date"
        print(errorMessage)
        return {"message":errorMessage}


# Calculate Tenture
def calculateTenure(df, event_date):
 
    df["Years Employed"] = df["Date of Hire"].apply(lambda doh: event_date.year - doh.year - ((event_date.month, event_date.day) < (doh.month, doh.day)) if pd.notnull(doh) else None)
    return df

        
# Calculate Age
def calculateAge(df, event_date):

    df["Age"] = df["Date of Birth"].apply(lambda dob: event_date.year - dob.year - ((event_date.month, event_date.day) < (dob.month, dob.day)) if pd.notnull(dob) else None)
    return df



# Get distances
def getDistance(df, parameters):

    def calculate_distance(df, address1, address2):

        GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

    
        def getCoordinates(address):
            url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GOOGLE_MAPS_API_KEY}"
            response = requests.get(url)
            data = response.json()

            if response.status_code == 200 and data['status'] == 'OK':
                location = data['results'][0]['geometry']['location']
                return location['lat'], location['lng']
            else:
                return None, None

        coordinates1 = getCoordinates(address1)
        coordinates2 = getCoordinates(address2)

        if coordinates1 and coordinates2:
            distance = geodesic(coordinates1, coordinates2).miles
            return distance
        else:
            return None

    site_location = parameters.get("location")
    df["Miles From Site"] = df.apply(lambda row: calculate_distance(row, site_location, row["Employee Postal Code"]) if pd.notnull(row["Employee Postal Code"]) else None, axis=1)
    return df



# Define Variable Types
def defineVariableTypes(df):
    numerical_features = df.select_dtypes(include=[np.number])

    date_features = df.select_dtypes(include=[np.datetime64])
    date_features.fillna("", inplace=True)

    categorical_features = df.drop(list(numerical_features.columns), axis=1)
    categorical_features = categorical_features.drop(list(date_features.columns), axis=1)

    return numerical_features, date_features, categorical_features

    
# Tread Null Values 
def treatNullValues(df, numerical_features, date_features, categorical_features):

    for feature in numerical_features.columns:
        df[feature] = df[feature].fillna(df[feature].median())

    for feature in categorical_features.columns:
        df[feature] = df[feature].replace("None", None)
        df[feature] = df[feature].fillna(df[feature].mode()[0] if not df[feature].mode().empty else "")

    null_values = pd.DataFrame({
        "Null Values": df.isnull().sum(),
        "Percentage Null": df.isnull().sum()/df.shape[0]*100
    }).sort_values(by="Percentage Null", ascending=False)

    null_values.reset_index(inplace=True)
    null_values.rename(columns={"index": "feature"}, inplace=True)

    null_values.columns = ["Feature", "Null Values", "Percentage Null"]

    df["Pay Basis"].value_counts(1)

    df["Gender"].value_counts(1)

    return null_values, df
  


# Initialtize Precited APH, Estimated LOI, and Cost Fields
def initializeFields(df):
    df["Probability of No Show"] = 0.00
    df["Predicted APH"] = 0.00
    df["Estimated Piece Count"] = 0.00
    df["Estimated LOI"] = 0.00
    df["Estimated Cost"] = 0.00
    return df


# Sort by descending by historical aph and ascending by distance from site
def sortData(df):
  df = df.sort_values(by=["Historical APH"], ascending=[False])
  return df

# Drop Date Fields
def dropDateFields(df):
  staff_data = df.drop(columns=["Date of Birth", "Date of Hire"])
  return staff_data


#initialize selected staffing
def setSelectedStaffing(df, parameters):
  number_of_people = parameters.get("number_of_people")
  selected_staffing = df.head(number_of_people)
  return selected_staffing


#Package up staff data and selected staffing to return back to client
def package(staff_data, selected_staffing):
    staff_data = staff_data.to_dict()
    selected_staffing = selected_staffing.to_dict(orient="records")
    output = {
        "staff_data": staff_data,
        "selected_staffing": selected_staffing
    }
    return output


#analyze aph and loi for selected staffing model
def analyze(parameters):

    staff_data = parameters.get("staff_data")
    selected_staffing = parameters.get("selected_staffing")

    staff_data_df = pd.DataFrame(staff_data)
    selected_staffing_df = pd.DataFrame(selected_staffing)

    stringfields = [
        'Employee ID',
        'Most Common District',
        'Role',
        'Performance Rating',
        'Pay Basis',
        'Employee Postal Code',
        'Gender',
    ]

    floatfields = [
        'Wage Rate',
        'Historical APH',
        "Years Employed",
        "Age",
        "Probability of No Show",
        "Predicted APH",
        "Estimated LOI",
        "Estimated Cost"
    ]

    try:
        #Convert fields to strings
        for field in stringfields:
            staff_data_df[field] = staff_data_df[field].astype(str)
            selected_staffing_df[field] = selected_staffing_df[field].astype(str)

        #Convert fields to floats
        for field in floatfields:
            staff_data_df[field] = np.round(staff_data_df[field].astype(float),2)
            selected_staffing_df[field] = np.round(selected_staffing_df[field].astype(float),2)
    except Exception as e:
        print(f"Error converting datatypes in anlaysis {e}")


    customer_name = parameters.get("customer_name")
    allowable_loi = parameters.get("allowable_loi")
    total_inventory = parameters.get("inventory_count")
    back_room_pct = parameters.get("back_room_pct")
    number_of_people = selected_staffing_df.shape[0]
    
    try:
        pieces_counted_per_person = total_inventory / number_of_people
    except Exception as e:
        print("Error estimating peiced_counted_per)person")

    try:
        staff_data_df["Predicted APH"] = round(staff_data_df["Predicted APH"]*0,0)
        staff_data_df["Estimated LOI"] = round(staff_data_df["Estimated LOI"]*0,0)
        staff_data_df["Estimated Piece Count"] = round(staff_data_df["Estimated Piece Count"]*0,0)
        staff_data_df["Estimated Cost"] = round(staff_data_df["Estimated Cost"]*0,0)
    except Exception as e:
        print(f"Error converting to zero values {e}")
    

    # Estimate role percenteges:
    try:
        role_0_pct = round(len(selected_staffing_df[selected_staffing_df["Role"] == "0"]) / number_of_people * 100,2) if number_of_people >0 else 0
        performance_rating_1_pct = round(len(selected_staffing_df[selected_staffing_df["Performance Rating"] == "1"]) / number_of_people * 100,2) if number_of_people >0 else 0
        performance_rating_2_pct = round(len(selected_staffing_df[selected_staffing_df["Performance Rating"] == "2"]) / number_of_people * 100,2) if number_of_people >0 else 0
        performance_rating_3_pct = round(len(selected_staffing_df[selected_staffing_df["Performance Rating"] == "3"]) / number_of_people * 100,2) if number_of_people >0 else 0
        performance_rating_4_pct = round(len(selected_staffing_df[selected_staffing_df["Performance Rating"] == "4"]) / number_of_people * 100,2) if number_of_people >0 else 0
        performance_rating_other_pct = round(len(selected_staffing_df[~selected_staffing_df["Performance Rating"].isin(["1", "2", "3", "4"])]) / number_of_people * 100,2) if number_of_people >0 else 0

        print("role_0_pct", role_0_pct)

        print("performance_rating_1_pct", performance_rating_1_pct)
        print("performance_rating_2_pct", performance_rating_2_pct)
        print("performance_rating_3_pct", performance_rating_3_pct)
        print("performance_rating_4_pct", performance_rating_4_pct)
        print("performance_rating_other_pct", performance_rating_other_pct)
    
    except Exception as e:
        print(f"Error quantifying precentage role and performane {e}")

   
    try:
        selected_staffing_df["Predicted APH"] = selected_staffing_df.apply(lambda row: round(
            predict_person_aph({
                "PERSON_JOB_ROLE": [int(row["Role"])][0],
                "PERSON_PERFORMANCE_RATING": [str(row["Performance Rating"])][0],
                "PERSON_COMPENSATION_TYPE": [str(row["Pay Basis"])][0],
                "PERSON_GENDER": [str(row["Gender"])][0],
                "EVENT_CUSTOMER_NAME": [str(customer_name)][0],
                "EVENT_DISTRICT": [float(row["Most Common District"])][0],
                "PERSON_TENURE_AT_EVENT": [float(row["Years Employed"])][0],
                "PERSON_AGE_AT_EVENT": [float(row["Age"])][0],
                "EVENT_EST_PIECES": [float(total_inventory)][0],
                "EVENT_BR_PCT": [float(back_room_pct)][0],
                "EVENT_MAX_LOI": [float(allowable_loi)][0],
                "EVENT_PERSON_CNT": [int(number_of_people)][0],
                "EVENT_PCT_COUNTER": [float(role_0_pct)][0],
                "EVENT_PCT_COUNTER_ASET_1": [float(performance_rating_1_pct)][0],
                "EVENT_PCT_COUNTER_ASET_2": [float(performance_rating_2_pct)][0],
                "EVENT_PCT_COUNTER_ASET_3": [float(performance_rating_3_pct)][0],
                "EVENT_PCT_COUNTER_ASET_4": [float(performance_rating_4_pct)][0],
                "EVENT_PCT_COUNTER_ASET_OTHERS": [float(performance_rating_other_pct)][0]
            }),2), axis=1)
        
        selected_staffing_df["Predicted APH"] = round(selected_staffing_df["Predicted APH"].astype("float64"),0)
    except Exception as e:
        print(f"Error predicting person APH {e}")
    
    try:
        # selected_staffing_df["Predicted APH"] = round(selected_staffing_df["Historical APH"]*(1+random.randint(1, 10)/100),0)
        average_APH = selected_staffing_df["Predicted APH"].mean()
        predicted_aph_sum = selected_staffing_df["Predicted APH"].sum()
        
        distribution_method = parameters.get("distribution_method")

        if distribution_method == "Relative Person APH":
            selected_staffing_df["Estimated Piece Count"] = selected_staffing_df.apply(lambda row: round(pieces_counted_per_person*(row["Predicted APH"]/predicted_aph_sum),0), axis=1)
        else: 
            selected_staffing_df["Estimated Piece Count"] = selected_staffing_df.apply(lambda row: round(pieces_counted_per_person,0), axis=1)
        

        selected_staffing_df["Estimated LOI"] = selected_staffing_df.apply(lambda row:  round(row["Estimated Piece Count"] / row["Predicted APH"],2), axis=1)
        selected_staffing_df["Estimated Cost"] = round(selected_staffing_df["Estimated LOI"] * selected_staffing_df["Wage Rate"],2)

        estimated_LOI = selected_staffing_df["Estimated LOI"].max()
        loi_passes = False if estimated_LOI > allowable_loi else True

        overall_APH = total_inventory / estimated_LOI
        totalCost = selected_staffing_df["Estimated Cost"].sum()
        print("totalCost", totalCost)

        revenue = parameters.get("revenue")
        profit = revenue - totalCost

    except Exception as e:
        print(f"Error calcualting summary metrics {e} ")



    staff_data_df = staff_data_df[[
        'Employee ID',
        'Historical APH',
        'Predicted APH',
        'Estimated Piece Count',
        'Estimated LOI',
        'Role',
        'Performance Rating',
        'Probability of No Show',
        'Wage Rate',
        'Estimated Cost',
        'Pay Basis',
        'Most Common District',
        'Employee Postal Code',
        'Years Employed',
        'Age',
        'Gender'
    ]]

    selected_staffing_df = selected_staffing_df[[
        'Employee ID',
        'Historical APH',
        'Predicted APH',
        'Estimated Piece Count',
        'Estimated LOI',
        'Role',
        'Performance Rating',
        'Probability of No Show',
        'Wage Rate',
        'Estimated Cost',
        'Pay Basis',
        'Most Common District',
        'Years Employed',
        'Employee Postal Code',
        'Age',
        'Gender'
    ]]


    #replace rows in staff_data_df by those that are also selected_staffing_df for all columns
    staff_data_df.set_index('Employee ID', inplace=True)
    selected_staffing_df.set_index('Employee ID', inplace=True)
    staff_data_df.update(selected_staffing_df)
    staff_data_df.reset_index(inplace=True)
    selected_staffing_df.reset_index(inplace=True)


    output = {
        "summary": {
            "total_inventory": total_inventory,
            "number_of_people": number_of_people,
            "average_APH": average_APH,
            "total_cost": totalCost,
            "estimated_LOI": estimated_LOI,
            "overall_APH": overall_APH,
            "profit": profit,
            "revenue": revenue,
            "allowable_LOI": allowable_loi,
            "loi_passes": loi_passes
        },
        "staff_data": staff_data_df.to_dict(orient="records"),
        "selected_staffing": selected_staffing_df.to_dict(orient="records")
    }

    return output


def process_staff_data(parameters):
    
    print(parameters)

    # parameters = {
    #     "customer_name": str(parameters.get("customer_name")),
    #     "event_date": datetime.strptime(parameters.get("event_date"), "%Y-%m-%d").date(),
    #     "event_time": datetime.strptime(parameters.get("event_time"), "%I:%M %p").time(),
    #     "revenue": float(parameters.get("revenue")),
    #     "district": str(parameters.get("district")),
    #     "back_room_pct": float(parameters.get("back_room_pct")),
    #     "allowable_loi": float(parameters.get("allowable_loi")),
    #     "location": str(parameters.get("location")),
    #     "number_of_people": int(parameters.get("number_of_people")),
    #     "distribution_method": str(parameters.get("distribution_method"))
    # }
    # print(parameters)

    
    # Ensure parameters are provided
    if parameters is None:
        return {"message": "Parameters are required"}

    # Initialize the DataFrame
    try:
        df = getStaffData(parameters)
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"message": "Error feteching data "}


    # Define data types
    try:
        df = defineDataTypes(df)
    except Exception as e:
        print(f"Error defining data types: {e}")
        return {"message": "Error defining data types"}
    

    # Set the event date
    try:
        event_date = setEventDate(parameters)
    except Exception as e:
        print(f"Error setting event date: {e}")
        return {"message": "Error setting event date"}

    # Calculate tenure
    try:
        df = calculateTenure(df, event_date)
    except Exception as e:
        print(f"Error calculating tenure: {e}")
        return {"message": "Error calculating tenure"}

    # Calculate age
    try:
        df = calculateAge(df, event_date)
    except Exception as e:
        print(f"Error calculating age: {e}")
        return {"message": "Error calculating age"}

    # Get distance (ignored as it takes a long time)
    # try:
    #     df = getDistance(df, parameters)
    # except Exception as e:
    #     print(f"Error calculating distance: {e}")
    #     return {"message": "Error calculating distance"}

    # Define variable types
    try:
        numerical_features, date_features, categorical_features = defineVariableTypes(df)
        print(numerical_features.columns)
        print(date_features.columns)
        print(categorical_features.columns)
    except Exception as e:
        print(f"Error defining variable types: {e}")
        return {"message": "Error defining variable types"}
    
    # Treat Null Values
    try:
        null_values, df = treatNullValues(df,numerical_features, date_features, categorical_features)
        print()
        print(null_values)
    except Exception as e:
        print(f"Error initializing fields: {e}")
        return {"message": "Error initializing fields"}

    # Initialize fields
    try:
        df = initializeFields(df)
    except Exception as e:
        print(f"Error initializing fields: {e}")
        return {"message": "Error initializing fields"}

    # Sort data
    try:
        df = sortData(df)
    except Exception as e:
        print(f"Error sorting data: {e}")
        return {"message": "Error sorting data"}
    

    # Drop date fields and return JSON
    try:
        staff_data = dropDateFields(df)
    except Exception as e:
        print(f"Error finalizing staff data: {e}")
        return {"message": "Error finalizing staff data"}
    

    # Initialize selected staffg
    try:
        selectedStaffing = setSelectedStaffing(staff_data, parameters)
    except Exception as e:
        print(f"Error intializing selected staffing data: {e}")
        return {"message": "Error intializing selected staffing data"}
    

     # Package up staff data and selected staff to send back to client
    try:
        staff_data_processing = package(staff_data, selectedStaffing)
    except Exception as e:
        print(f"Error packaging up staff_data and selected staffing data: {e}")
        return {"message": "Error packaging up staff_data and selected staffing data"}

    try:
        staff_data = staff_data_processing.get("staff_data")
        selected_staffing = staff_data_processing.get("selected_staffing")
        parameters["staff_data"] = staff_data
        parameters["selected_staffing"] = selected_staffing

        results = analyze(parameters)
        return jsonify(results)
       
        # return jsonify(staff_data_processing.to_dict(orient='records'))
    except Exception as e:
        print(f"Error analyzing selected staffing: {e}")
        return {"message": "Error analyzing selected staffing"}


def run_analysis(parameters):
    try:
        results = analyze(parameters)
        return jsonify(results)
    except Exception as e:
        print(f"Error running analysis: {e}")
        return {"message": "Error running analysis staffing"}