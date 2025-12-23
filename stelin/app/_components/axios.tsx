"use client";
import axios from "axios";
import { TbPredictionRequest, TbPredictionResponse } from "../_model/tbModel";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:5000",
    timeout: 30_000,
});

export async function predictTbRisk(payload: TbPredictionRequest): Promise<TbPredictionResponse> {
    const { data } = await api.post<TbPredictionResponse>("/predict", payload);
    console.log(data)
    return data;
}

// For brain tumor prediction
export async function predictBrainTumor(imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:5000" + '/predict-brain-tumor', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`Predicted: ${result.prediction}`);
      console.log(`Confidence: ${result.confidence}`);
      console.log('All predictions:', result.all_predictions);
      return result;
    } else {
      console.error('Prediction error:', result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}