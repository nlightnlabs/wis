# data_processor.py
import pandas as pd
import numpy as np
import os
from sqlalchemy import create_engine
import pandasql as psql

# Environment Variables
PGHOST = os.getenv('PGHOST')
PGUSER = os.getenv('PGUSER')
PGPASSWORD = os.getenv('PGPASSWORD')
PGDATABASE = os.getenv('PGDATABASE')
PGPORT = os.getenv('PGPORT')

def get_data_from_db():
    table_name = "assets"
    db_name = "main"
    query = f'SELECT * FROM {table_name};'
    
    try:
        engine = create_engine(f'postgresql://{PGUSER}:{PGPASSWORD}@{PGHOST}:{PGPORT}/{db_name}')
        df = pd.read_sql(query, engine)
        return df
    except Exception as e:
        print(f"Error while fetching data: {e}")
        return None

def prepare_data(df, time_interval="month"):

    for feature in df.columns:
        if "date" in str(feature):
            df[feature] = pd.to_datetime(df[feature], errors='coerce')

    # Ensure 'purchase_date' is in datetime format
    df['purchase_date'] = pd.to_datetime(df['purchase_date'])

    # Define mapping of time intervals to strftime formats and labels
    time_format_map = {
        "day": {"label_format": '%Y-%m-%d', "label": "Day"},
        "week": {"label_format": '%Y-%W', "label": "Week"},
        "month": {"label_format": '%Y-%m', "label": "Month"},
        "year": {"label_format": '%Y', "label": "Year"}
    }

    # Get the format and label for the selected time_interval
    time_config = time_format_map.get(time_interval, time_format_map["month"])
    label_format = time_config["label_format"]
    label = time_config["label"]

    # Dynamically build the SQL query
    sql = f""" 
    SELECT 
        strftime('{label_format}', purchase_date) AS {label},
        COUNT(DISTINCT id) AS "Number of Assets",
        SUM(original_purchase_price) AS "Spend",
        COUNT(DISTINCT assigned_to_id) AS "Number of Users",
        ROUND(
            COUNT(DISTINCT CASE 
                WHEN LENGTH(assigned_to_id) > 0 THEN assigned_to_id 
                ELSE NULL 
            END) * 1.0 / COUNT(DISTINCT id), 2) * 100 AS "Percent of Assets Assigned",
        COUNT(DISTINCT commodity_type) AS "Number of Commodities",
        COUNT(DISTINCT supplier) AS "Number of Suppliers",
        ROUND(AVG((julianday('now') - julianday(purchase_date)) / 365.25), 2) AS "Average Age In Years",
        MIN(ROUND((julianday('now') - julianday(purchase_date)) / 365.25 * annual_depreciation_rate * 100, 2), 100) AS "Depreciation Percentage",
        ROUND(SUM(1 - (((julianday('now') - julianday(purchase_date)) / 365.25) * annual_depreciation_rate) + original_purchase_price), 2) AS "Depreciated USD Value",
        ROUND(AVG((julianday('purchase_date') - julianday(purchase_date))), 2) as "Average Provision Cycle Time"
    FROM df
    GROUP BY {label}
    ORDER BY {label};
    """

    count_data = psql.sqldf(sql, locals())
    return count_data


def get_correlations():

    count_data = run_analysis()

    numeric_data = count_data.select_dtypes(include=['number'])

    correlation_matrix = numeric_data.corr()
    correlation_maxtrix_df = pd.DataFrame(correlation_matrix)

    # Flatten the dataframe
    correlation_data_flattened = correlation_matrix.stack().reset_index()
    correlation_data_flattened.columns = ['Feature 1', 'Feature 2', 'Correlation']

    # Remove the diagonals and duplicate feature combinations
    correlation_data_flattened = correlation_data_flattened[correlation_data_flattened['Feature 1'] != correlation_data_flattened['Feature 2']]
    correlation_data_flattened['features'] = correlation_data_flattened.apply(
        lambda row: tuple(sorted([row['Feature 1'], row['Feature 2']])), axis=1
    )
    correlation_data_flattened = correlation_data_flattened.drop_duplicates(subset='features')

    # Sort by correlation value
    correlation_data_flattened.sort_values(by='Correlation', ascending=False, inplace=True)
    correlation_data_flattened["Features"] = correlation_data_flattened["Feature 1"] + " & " + correlation_data_flattened["Feature 2"]

    # Drop the 'features' column as it was only needed for deduplication
    correlation_data_flattened = correlation_data_flattened.drop(columns='features')
    correlation_data_flattened.reset_index(drop=True, inplace=True)

    analysis_summary = {
        "correlation_maxtrix": correlation_maxtrix_df,
        "correlation_data_flattened": correlation_data_flattened
    }

    return correlation_data_flattened


def run_analysis(time_interval="month"):
    df = get_data_from_db()
    if df is not None:
        return prepare_data(df, time_interval)
    return None

if __name__ == '__main__':
    result = run_analysis(time_interval="month")
    print(result)