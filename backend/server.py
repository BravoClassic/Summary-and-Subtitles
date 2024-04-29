import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from werkzeug.utils import secure_filename  # for secure file handling
# from config import GOOGLE_API_KEY
import os

genai.configure(api_key="AIzaSyATzPs8WMdtZlI1F4PzWrfdB_qiM5125m4")
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY") )
UPLOAD_FOLDER = '/audio/uploads'

# Create the upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')   
    response = model.generate_content(["Give me a short essay on the following topic: The importance of education in today's society."])
    return {"message": "Server working!"}
    # return {"message": response.text}


@app.route("/summary", methods=["POST"])
def generate_summary():
    if "file" not in request.files:
        return {"error": "No file uploaded!"}
    
    data = request.files['file']

    if data.filename == '':
        return {'error': 'No selected file'}

    filename = secure_filename(data.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    # Encode the audio data (replace with your specific encoding logic)
    try:
        data.save(filepath)
    except Exception as e:
        return jsonify({'error': f'Error saving file: {e}'}), 500

    audio_data = genai.upload_file(filepath)

    prompt = "Listen carefully to the following audio file. Provide a brief summary."
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    response = model.generate_content([prompt, audio_data])
    return {"summary": response.text}


if __name__ == "__main__":
    app.run(debug=True)