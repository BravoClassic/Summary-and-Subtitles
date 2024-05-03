
from flask import Flask, request
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv
from werkzeug.utils import secure_filename

import os

# Set the API key for the generative AI
load_dotenv(os.path.join(os.getcwd(), '.env'))

genai.configure(api_key=os.environ.get('GOOGLE_API_KEY')   )

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = '/Users/geraldakorli/uploads/'


def gemini_upload_file(data):
    
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.chdir(app.config['UPLOAD_FOLDER'])
    secure_name = secure_filename(data.filename)
    data.save(secure_name) # Here we save the file to the server
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_name)
    audio_file = genai.upload_file(filepath)
    return audio_file



@app.route("/")
def hello_world():
    return {"message": "Hello, World!"}



@app.route("/summary", methods=["POST"])
def generate_summary():
    if "file" not in request.files: # Here we return an error if no file is uploaded
        return {"error": "No file uploaded!"}
    
    data = request.files['file'] # Here we get the file from the POST request
 
    if data.filename == '': # Here we return an error if the file has no name
        return {'error': 'No selected file'}
    
    audio = gemini_upload_file(data) # Here we upload the file to the cloud and get the URL of the file


    try: # Here we try to generate a summary from the audio file
        prompt = "Listen carefully to the following audio file. Provide a brief summary."
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        response = model.generate_content([prompt, audio]) # Here we generate the summary using the model and the audio file
        return {"summary": response.text}
    except Exception as e:
        return {"error": str(e)}
    


@app.route("/subtitle", methods=["POST"])
def generate_subtitles():
    if "file" not in request.files: # Here we return an error if no file is uploaded
        return {"error": "No file uploaded!"}
    
    data = request.files['file'] # Here we get the file from the POST request
 
    if data.filename == '': # Here we return an error if the file has no name
        return {'error': 'No selected file'}
    
    audio = gemini_upload_file(data) # Here we upload the file to the cloud and get the URL of the file


    try: # Here we try to generate a summary from the audio file
        prompt = "Listen carefully to the following audio file. Provide the subtitle for the audio."
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        response = model.generate_content([prompt, audio]) # Here we generate the summary using the model and the audio file
        return {"summary": response.text}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    app.run(debug=True)