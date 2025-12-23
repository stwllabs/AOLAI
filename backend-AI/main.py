from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Load models at startup
try:
    tb_model = joblib.load('tb_risk_model.pkl')
    scaler = joblib.load('scaler.pkl')
    print("✓ TB Risk model and scaler loaded successfully!")
except Exception as e:
    print(f"⚠ Error loading TB model: {e}")
    tb_model = None
    scaler = None

try:
    brain_tumor_model = load_model('chest_xray_classification_model.h5')
    print("✓ Brain Tumor model loaded successfully!")
except Exception as e:
    print(f"⚠ Error loading Brain Tumor model: {e}")
    brain_tumor_model = None

# Brain tumor classes
XRAY_CLASSES = ['Normal', 'Pneumonia']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/predict', methods=['POST'])
def predict_tb_risk():
    """Predict TB risk based on symptoms"""
    if tb_model is None:
        return jsonify({'error': 'TB Model not loaded'}), 500
    
    try:
        data = request.json
        
        # Extract input
        tinggi_badan_cm = data.get('tinggi_badan_cm')
        umur_tahun = data.get('umur_tahun')
        batuk_lama = data.get('batuk_lama')
        demam = data.get('demam')
        keringat_malam = data.get('keringat_malam')
        penurunan_berat_badan = data.get('penurunan_berat_badan')
        
        # Validate input
        if None in [tinggi_badan_cm, umur_tahun, batuk_lama, demam, keringat_malam, penurunan_berat_badan]:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Prepare input data
        input_data = pd.DataFrame({
            'tinggi_badan_cm': [(tinggi_badan_cm)],
            'umur_tahun': [(umur_tahun)],
            'batuk_lama': [int(batuk_lama)],
            'demam': [int(demam)],
            'keringat_malam': [int(keringat_malam)],
            'penurunan_berat_badan': [int(penurunan_berat_badan)],
        })
        
        # Predict
        try:
            skor_risiko = tb_model.predict(input_data)[0]
        except:
            skor_risiko = tb_model.predict(input_data)[0]
        
        # Clip to [0, 1] range
        skor_risiko = float(np.clip(skor_risiko, 0, 1))
        
        # Categorize risk
        if skor_risiko < 0.4:
            kategori = 'Low Risk'
            rekomendasi = False
        elif skor_risiko < 0.7:
            kategori = 'Medium Risk'
            rekomendasi = True
        else:
            kategori = 'High Risk'
            rekomendasi = True
        
        # Return results
        return jsonify({
            'success': True,
            'input': {
                'tinggi_badan_cm': tinggi_badan_cm,
                'umur_tahun': umur_tahun,
                'batuk_lama': bool(batuk_lama),
                'demam': bool(demam),
                'keringat_malam': bool(keringat_malam),
                'penurunan_berat_badan': bool(penurunan_berat_badan)
            },
            'result': {
                'skor_risiko_tb': round(skor_risiko, 4),
                'kategori': kategori,
                'rekomendasi_pemeriksaan_dokter': rekomendasi
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/predict-brain-tumor', methods=['POST'])
def predict_brain_tumor():
    """Predict brain tumor from MRI image"""
    if brain_tumor_model is None:
        return jsonify({'error': 'Chest X-ray model not loaded'}), 500
    
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: jpg, jpeg, png, gif'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Load and preprocess image
        img = load_img(filepath, target_size=(224, 224), color_mode='grayscale')
        img_array = img_to_array(img) / 255.0  # Normalize
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        
        # Make prediction
        predictions = brain_tumor_model.predict(img_array)
        predicted_class_idx = np.argmax(predictions, axis=1)[0]
        predicted_class = XRAY_CLASSES[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx]) * 100  # Convert to percentage
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'prediction': predicted_class,
            'confidence': round(confidence, 2),
            'all_predictions': {
                XRAY_CLASSES[i]: round(float(predictions[0][i]) * 100, 2)
                for i in range(len(XRAY_CLASSES))
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'tb_model_loaded': tb_model is not None,
        'brain_tumor_model_loaded': brain_tumor_model is not None,
        'message': 'Medical Diagnosis API is running'
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("MEDICAL DIAGNOSIS API")
    print("="*60)
    print("Server running on: http://localhost:5000")
    print("\nEndpoints:")
    print("  POST /predict - Predict TB risk")
    print("  POST /predict-brain-tumor - Predict brain tumor from MRI")
    print("  GET  /health - Check API status")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)