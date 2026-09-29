"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Image as ImageIcon, X, Play, Loader2, AlertCircle } from "lucide-react";
import { usePrescription } from "@/context/PrescriptionContext";

export function UploadPrescription() {
  const { setExtractedPrescription, prescriptionMode } = usePrescription();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const analyze = async (mode: "live" | "demo") => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let base64Data = "";
      let mimeType = "";

      if (mode === "live" && file) {
        base64Data = await toBase64(file);
        mimeType = file.type;
      }

      const res = await fetch("/api/prescription/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, base64Data, mimeType }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }
      setExtractedPrescription(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
        <h2 className="font-semibold text-slate-200">Upload Prescription</h2>
        <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-md font-mono">
          MODE: {prescriptionMode.toUpperCase()}
        </span>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <div>
              <p className="font-medium text-sm">Analysis Error</p>
              <p className="text-xs opacity-80 mt-1">{error}</p>
              {error.includes("quota") && (
                <button 
                  onClick={() => analyze("demo")}
                  className="mt-3 px-3 py-1.5 bg-red-900/50 hover:bg-red-800/50 rounded text-xs transition-colors"
                >
                  Use Demo Analysis Instead
                </button>
              )}
            </div>
          </div>
        )}

        {!file ? (
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-950/30 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-14 h-14 bg-slate-800 group-hover:bg-cyan-950 rounded-full flex items-center justify-center mb-4 transition-colors">
              <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <p className="text-slate-300 font-medium">Click or drag file to upload</p>
            <p className="text-slate-500 text-sm mt-1">Supports JPG, PNG, WEBP, PDF</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*,application/pdf"
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative border border-slate-700 bg-slate-950 rounded-xl p-4 flex gap-4 items-center">
              <button 
                onClick={removeFile}
                className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 shrink-0 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-8 h-8 text-slate-500" />
                )}
              </div>
              
              <div className="min-w-0 flex-1 pr-6">
                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                disabled={isAnalyzing}
                onClick={() => analyze("live")}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing with Gemini...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Analyze Prescription
                  </>
                )}
              </button>
              
              {!isAnalyzing && (
                <button
                  onClick={() => analyze("demo")}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors border border-slate-700 text-sm whitespace-nowrap"
                >
                  Demo Mode
                </button>
              )}
            </div>
            
            <p className="text-center text-xs text-slate-500 italic">
              Note: Do not upload real patient data. This is a prototype system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
