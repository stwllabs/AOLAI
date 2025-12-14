"use client";
import axios from "axios";
import { TbPredictionRequest, TbPredictionResponse } from "../_model/tbModel";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:5000",
    timeout: 10_000,
});

export async function predictTbRisk(payload: TbPredictionRequest): Promise<TbPredictionResponse> {
    const { data } = await api.post<TbPredictionResponse>("/predict", payload);
    console.log(data)
    return data;
}