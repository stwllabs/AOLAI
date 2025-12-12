from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Load model and scaler at startup
try:
    model = joblib.load('tb_risk_model.pkl')
    scaler = joblib.load('scaler.pkl')
    print("✓ Model and scaler loaded successfully!")
except Exception as e:
    print(f"⚠ Error loading model: {e}")
    print("Run the notebook first to generate tb_risk_model.pkl and scaler.pkl")
    model = None
    scaler = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        
        # Extract input dari request
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
            'tinggi_badan_cm': [float(tinggi_badan_cm)],
            'umur_tahun': [float(umur_tahun)],
            'batuk_lama': [int(batuk_lama)],
            'demam': [int(demam)],
            'keringat_malam': [int(keringat_malam)],
            'penurunan_berat_badan': [int(penurunan_berat_badan)],
        })
        
        # Predict - try with scaler first (for Linear Regression), fallback to direct prediction
        try:
            input_scaled = scaler.transform(input_data)
            skor_risiko = model.predict(input_scaled)[0]
        except:
            skor_risiko = model.predict(input_data)[0]
        
        # Clip to [0, 1] range
        skor_risiko = float(np.clip(skor_risiko, 0, 1))
        
        # Kategorisasi risiko
        if skor_risiko < 0.4:
            kategori = 'Low Risk'
            rekomendasi = False
        elif skor_risiko < 0.7:
            kategori = 'Medium Risk'
            rekomendasi = True
        else:
            kategori = 'High Risk'
            rekomendasi = True
        
        # Return hasil prediksi
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

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'message': 'TB Risk Prediction API is running'
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("TB RISK PREDICTION API")
    print("="*60)
    print("Server running on: http://localhost:5000")
    print("\nEndpoints:")
    print("  POST /predict - Predict TB risk")
    print("  GET  /health  - Check API status")
    print("\nExample request:")
    print("""
    curl -X POST http://localhost:5000/predict \\
      -H "Content-Type: application/json" \\
      -d '{
        "tinggi_badan_cm": 170,
        "umur_tahun": 30,
        "batuk_lama": true,
        "demam": true,
        "keringat_malam": false,
        "penurunan_berat_badan": true
      }'
    """)
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)