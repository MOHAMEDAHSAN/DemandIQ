import { useState, useCallback } from 'react';
import { DashboardState, DataSummary, ProductMetrics, InventoryRecord, ScenarioType } from '@/types/inventory';
// IMPORANT: Import the api service we defined
import { api } from '@/services/api'; 

export const useDashboardState = () => {
  // Ensure "loading" is added to your DashboardState type definition (see Step 2 below)
  const [state, setState] = useState<DashboardState>("idle");
  const [data, setData] = useState<InventoryRecord[]>([]);
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [productMetrics, setProductMetrics] = useState<ProductMetrics[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [forecastHorizon, setForecastHorizon] = useState(20);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>("baseline");

  const loadData = useCallback(async (file: File) => {
    setState("loading"); // This requires updating types/inventory.ts
    try {
      // 1. Upload to server
      const records = await api.uploadData(file);
      setData(records);
      
      // 2. Calculate summary for the UI (Client-side calculation)
      // We keep this here so the UI updates immediately after upload
      if (records.length > 0) {
        const uniqueProducts = new Set(records.map(r => r.Product_ID)).size;
        const dates = records.map(r => new Date(r.Date));
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

        setDataSummary({
          totalRecords: records.length,
          uniqueProducts,
          dateRange: {
            min: minDate.toISOString().split('T')[0],
            max: maxDate.toISOString().split('T')[0]
          }
        });
      }
      
      setState("idle");
    } catch (error) {
      console.error("Upload failed", error);
      setTrainingLogs(prev => [...prev, "Error: File upload failed"]);
      setState("idle");
    }
  }, []);

  const trainModels = useCallback(async () => {
    setState("training");
    setTrainingLogs(["Starting training on server..."]);
    
    try {
      // Call the real backend
      const metrics = await api.trainModel(data);
      
      setProductMetrics(metrics);
      setTrainingLogs(prev => [...prev, "Training completed successfully."]);
      setState("trained");
      
      if (metrics.length > 0) {
        setSelectedProduct(metrics[0].product_id);
      }
    } catch (error) {
      console.error("Training error", error);
      setTrainingLogs(prev => [...prev, "Error: Training failed."]);
      setState("idle");
    }
  }, [data]);

  const generateForecast = useCallback(async () => {
    setState("forecasting");
    try {
      // Fetch real forecast data
      const results = await api.getForecast(forecastHorizon, selectedScenario);
      
      // Note: You need to handle 'results' here. 
      // Either store it in a new state variable or merge it into 'data' if the structure matches.
      console.log("Forecast results:", results);
      
      setState("results");
    } catch (e) {
      console.error("Forecast failed", e);
      setState("idle"); // Revert to idle on error
    }
  }, [forecastHorizon, selectedScenario]);

  return {
    state,
    data,
    dataSummary,
    trainingLogs,
    productMetrics,
    selectedProduct,
    forecastHorizon,
    selectedScenario,
    setSelectedProduct,
    setForecastHorizon,
    setSelectedScenario,
    loadData,
    trainModels,
    generateForecast,
  };
};