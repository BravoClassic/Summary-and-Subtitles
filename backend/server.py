
from flask import Flask, request
from flask_cors import CORS
import google.generativeai as genai
from werkzeug.utils import secure_filename

import os

# Set the API key for the generative AI

# os.environ.get('GOOGLE_API_KEY')
genai.configure(api_key="AIzaSyATzPs8WMdtZlI1F4PzWrfdB_qiM5125m4")

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = '/Users/geraldakorli/uploads/'

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
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.chdir(app.config['UPLOAD_FOLDER'])
    secure_name = secure_filename(data.filename)
    # os.path.join(app.config['UPLOAD_FOLDER'], secure_name)
    data.save(secure_name) # Here we save the file to the server
    # save file to google cloud storage
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_name)
    audio_file = genai.upload_file(filepath)


    try: # Here we try to generate a summary from the audio file
        prompt = "Listen carefully to the following audio file. Provide a brief summary."
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        response = model.generate_content([prompt, audio_file]) # Here we generate the summary using the model and the audio file
        return {"summary": response.text}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    app.run(debug=True)