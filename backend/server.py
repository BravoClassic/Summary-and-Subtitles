import base64
from flask import Flask, request
from flask_cors import CORS
import google.generativeai as genai

import os
import io

genai.configure(api_key="AIzaSyATzPs8WMdtZlI1F4PzWrfdB_qiM5125m4")

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')   
    response = model.generate_content(["Give me a short essay on the following topic: The importance of education in today's society."])
    return {"message": "Server working!"}


@app.route("/summary", methods=["POST"])
def generate_summary():
    if "file" not in request.files: # Here we return an error if no file is uploaded
        return {"error": "No file uploaded!"}
    
    data = request.files['file'] # Here we get the file from the POST request
 
    if data.filename == '': # Here we return an error if the file has no name
        return {'error': 'No selected file'}

    audio_file = data.stream.read() # Here we read the audio file
    # I am try to get the audio file from the request and sending it to gemini model but the model is not able to read the audio file
    # I am getting the following error: "TypeError: expected str, bytes or os.PathLike object, not _io.BytesIO"
    # I am not able to convert the audio file to the required format
    # I am also getting the following  error: "Typeerror: expected a blob object, got a BytesIO object"
    # if I use the following code:
    # audio_file = data.read()
    # in_model = io.BytesIO(audio_file) and pasaing in_model to the model as an argument after the prompt in the generate_content method

    try: # Here we try to generate a summary from the audio file
        prompt = "Listen carefully to the following audio file. Provide a brief summary."
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        response = model.generate_content([prompt, audio_file]) # Here we generate the summary using the model and the audio file
        return {"summary": response.text}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    app.run(debug=True)