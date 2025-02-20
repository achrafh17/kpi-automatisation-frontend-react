import React, { useState, useEffect, useRef } from "react";
import { uploadFile } from "./apiService.tsx";
import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const ElegantDashboard = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState([]);
  const [localdate, setlocaldate] = useState();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const processFile = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await uploadFile(file);
      setResults(response);
    } catch (err) {
      setError(
        err?.response?.data?.error || "Erreur lors de l'envoi du fichier"
      );
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  // const chartData = () => {
  //   console.log("date array",date);
  //   console.log("localdate",localdate);
  // };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  fetch("https://kpi-backend-4jcu.onrender.com/upload")
    .then((response) => response.json())
    .then((data) => console.log("render data", data));

  return (
    <div className="elegant-dashboard">
      <header className="dashboard-header">
        <h1>Tableau de Bord Logistique</h1>
        <p>Analyse Avancée des Performances</p>
      </header>

      <div className="dashboard-content">
        <div className="upload-section">
          <div className="file-upload-card">
            <h2>Télécharger Fichier</h2>
            <div className="file-upload-section">
              <p className="file-upload-instruction">
                Sélectionnez un fichier CSV pour l'analyse
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="file-input"
              />
              {file && (
                <div className="file-input-selected-name">
                  Fichier sélectionné: {file.name}
                </div>
              )}
            </div>
            <button
              onClick={processFile}
              disabled={!file || loading}
              className={`upload-btn ${!file || loading ? "disabled" : ""}`}
            >
              {loading ? "Traitement..." : "Analyser"}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-notification">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="results-grid">
            <div className="kpi-card">
              <h2>KPIs Actuels</h2>
              {Object.entries(results.kpis).map(([key, value]) => (
                <div key={key} className="kpi-item">
                  <span className="kpi-label">
                    {key.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="kpi-value">
                    {parseFloat(value).toFixed(2)}
                    {key.includes("load_factor")
                      ? "%"
                      : key.includes("cost")
                      ? "€"
                      : key.includes("time")
                      ? "h"
                      : ""}
                  </span>
                </div>
              ))}
            </div>

            <div className="validation-card">
              <h2>Validation ISO</h2>
              {Object.entries(results.validation).map(([key, details]) => (
                <div key={key} className="validation-item">
                  <span
                    className={`status-icon ${
                      details.iso_compliant ? "compliant" : "non-compliant"
                    }`}
                  >
                    {details.iso_compliant ? "✓" : "✗"}
                  </span>
                  <span className="validation-label">
                    {key.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="validation-value">
                    {parseFloat(details.value).toFixed(2)}
                    {key.includes("load_factor")
                      ? "%"
                      : key.includes("cost")
                      ? "€"
                      : key.includes("time")
                      ? "h"
                      : ""}
                  </span>
                </div>
              ))}
            </div>
            <div className="validated-item">
              <h2>KPIs Validés</h2>
              {Object.entries(results.validation)
                .filter(([_, details]) => details.iso_compliant)
                .map(([key, details]) => (
                  <div key={key} className="kpi-item">
                    <span className="kpi-label">
                      {key.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="validation-value">
                      {parseFloat(details.value).toFixed(2)}
                      {key.includes("load_factor")
                        ? "%"
                        : key.includes("cost")
                        ? "€"
                        : key.includes("time")
                        ? "h"
                        : ""}
                    </span>
                  </div>
                ))}
            </div>
            <div className="non-validated-item">
              <h2>KPIs Non-Validés</h2>
              {Object.entries(results.validation)
                .filter(([_, details]) => !details.iso_compliant)
                .map(([key, details]) => (
                  <div key={key} className="kpi-item">
                    <span className="kpi-label">
                      {key.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="validation-value">
                      {parseFloat(details.value).toFixed(2)}
                      {key.includes("load_factor")
                        ? "%"
                        : key.includes("cost")
                        ? "€"
                        : key.includes("time")
                        ? "h"
                        : ""}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="chart-section">
          <div className="chart-card">
            <button>ajouter une date</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElegantDashboard;
