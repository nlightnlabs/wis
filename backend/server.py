from flask import Flask, jsonify, request, render_template
from flask_cors import CORS  # Import CORS


import psycopg2
from psycopg2.extras import RealDictCursor
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
import openai
import importlib
import pandas as pd


# Initialize the Flask application
app = Flask(__name__)
CORS(app)
app.json.sort_keys = False

PORT = os.getenv('PORT')
NODE_ENV = os.getenv('NODE_ENV')

PGHOST = os.getenv('PGHOST')
PGUSER = os.getenv('PGUSER')
PGPASSWORD = os.getenv('PGPASSWORD')
PGDATABASE = os.getenv('PGDATABASE')
PGPORT = os.getenv('PGPORT')


PROJECT_ID = os.getenv('PROJECT_ID')
OPEN_AI_API_KEY = os.getenv('OPEN_AI_API_KEY')
openai.api_key = os.getenv("OPENAI_API_KEY", OPEN_AI_API_KEY)

PROJECT_ID = os.getenv('AWS_S3_SECRET_KEY')
OPEN_AI_API_KEY = os.getenv('OPEN_AI_API_KEY')

# Access to AWS s3 bucket
AWS_S3_SECRET_KEY = os.getenv('AWS_S3_SECRET_KEY')
AWS_S3_ACCESS_KEY = os.getenv('AWS_S3_ACCESS_KEY')
AWS_SESSION_TOKEN = os.getenv('AWS_SESSION_TOKEN')


#google maps:
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
GOOGLE_MAPS_SECRET = os.getenv('GOOGLE_MAPS_SECRET')

#huggingface
HUGGING_FACE_TOKEN = os.getenv('HUGGING_FACE_TOKEN')

# langchain
LANGCHAIN_API_KEY = os.getenv('LANGCHAIN_API_KEY')


#Bitbucket app password:
BITBUCKET_USERNAME = os.getenv('BITBUCKET_USERNAME')
BITBUCKET_TOKEN = os.getenv('BITBUCKET_TOKEN')



# Define a route for the home page
@app.route('/')
def home():
    return render_template('index.html')

# Define a route for a simple API
@app.route('/api/test', methods=['GET'])
def get_data():
    sample_data = {
        'name': 'Flask Web Server',
        'version': '1.0',
        'status': 'running'
    }
    return jsonify(sample_data)


def get_db_connection(dbname="main"):
    conn = psycopg2.connect(
        dbname=dbname,
        user=PGUSER,
        password=PGPASSWORD,
        host=PGHOST,
        port=PGPORT
    )
    return conn



# General Query
@app.route('/db/query', methods=['POST'])
def dbQuery():
    # Get the JSON data from the request
    data = request.json
    query = data.get('query')  # Get the SQL query

    # Get the database name, default to PGDATABASE if not provided
    dbName = data.get('dbName') if data.get('dbName') is not None else PGDATABASE

    # Check if a query is provided
    if not query:
        return jsonify({'error': 'A Query is required'}), 400

    conn = None
    cursor = None

    try:
        # Connect to the specified database
        conn = get_db_connection(dbName)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Execute the query
        cursor.execute(query)
        response = cursor.fetchall()  # Fetch all results

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Ensure resources are released only if they were created
        if cursor:
            cursor.close()
        if conn:
            conn.close()




@app.route('/db/table', methods=['POST'])
def getTable():
    # Get username and password from request
    data = request.json
    tableName = data.get("tableName")
    dbName = data.get('dbName') if data.get('dbName') is not None else PGDATABASE
    query = f'SELECT * FROM {tableName};'
    
    print( query)
    if not query:
        return jsonify({'error': 'A Query is required'}), 400

    try:
        # Connect to the database
        conn = get_db_connection(dbName)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Query the user by username
        cursor.execute(query)
        response = cursor.fetchall()

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify(response)


# Allternate get table using parameter argument and "GET"
@app.route('/db/getTable/<tableName>', methods=['GET'])
def getTableRecords(tableName):

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # Use RealDictCursor to get the results as a dictionary

    try:
        cursor.execute(f"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
        allowable_tables = cursor.fetchall()
        allowable_tables = [table['table_name'] for table in allowable_tables]
    except Exception as e:
        return jsonify({'error': str(e)}), 500
  
    if tableName not in allowable_tables:
        return jsonify({'error': 'Invalid table name'}), 400

    try:
        cursor.execute(f'SELECT * FROM {tableName};')  # Query the table safely by using an allowed list
        response = cursor.fetchall()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify(response)


#Open ai chatgpt
@app.route('/openai/chatgpt', methods=['POST'])
def chatgpt():
    data = request.json  # Get the data from the request body

    # Ensure prompt is provided in the request
    prompt = data.get('prompt')
    data = data.get('data')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    try:
        # Make the call to the OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": data},  # Define system-level behavior
                {"role": "user", "content": prompt}
            ],
            max_tokens=16000  # Adjust max tokens for response length
        )

        # Extract the reply from the API response
        reply = response['choices'][0]['message']['content']

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Return the GPT-4 response to the client
    return jsonify({'response': reply})



@app.route('/runApp', methods=['POST'])
def runApp():
    data = request.json
    app_name = data.get('app_name')  # Python file/app name without .py
    function = data.get('main_function')  # Function to call within the module
    parameters = data.get('parameters', {})  # Parameters to pass to the function

    filepath = "apps"  # Directory where your apps are stored

    if not app_name or not function:
        return jsonify({'error': 'Module name and function name are required'}), 400

    try:
        # Dynamically import the module and call the function
        result = importApp(filepath, app_name, function, parameters)
        print(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    if result is not None:

        if isinstance(result, dict):
            print("Result is a JSON-like dictionary.")
        elif isinstance(result, list):
            print("Result is a JSON-like list.")
        elif isinstance(result, pd.DataFrame):
            print("Result is a Pandas DataFrame.")
        else:
            print(f"Result is of type: {type(result)}")
    
        return result
    else:
        return jsonify({'error': 'No data found'}), 404



def importApp(filepath, app_name, function, parameters):
    # Construct the full path to the app file
    app_file = os.path.join(filepath, f"{app_name}.py")
    print("app_file:  ",app_file)
    
    # Check if the file exists
    if not os.path.isfile(app_file):
        raise FileNotFoundError(f"App '{app_name}' not found in '{filepath}'")

    # Load the module
    spec = importlib.util.spec_from_file_location(app_name, app_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    # Check if the function exists in the module
    if not hasattr(module, function):
        raise AttributeError(f"Function '{function}' not found in module '{app_name}'")

    # Call the function with parameters and return the result
    func = getattr(module, function)
    return func(parameters)

# Run the Flask application
if __name__ == '__main__':
    app.run(host='localhost', port=8001, debug=True)



