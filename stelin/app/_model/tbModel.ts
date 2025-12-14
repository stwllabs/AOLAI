export interface TbPredictionRequest {
  tinggi_badan_cm: number;
  umur_tahun: number;
  batuk_lama: boolean;
  demam: boolean;
  keringat_malam: boolean;
  penurunan_berat_badan: boolean;
}

export interface TbPredictionResponse {
  success: boolean;
  input: {
    tinggi_badan_cm: number;
    umur_tahun: number;
    batuk_lama: boolean;
    demam: boolean;
    keringat_malam: boolean;
    penurunan_berat_badan: boolean;
  };
  result: {
    skor_risiko_tb: number;                // 0–1
    kategori: 'Low Risk' | 'Medium Risk' | 'High Risk';
    rekomendasi_pemeriksaan_dokter: boolean;
  };
  error?: string;
}