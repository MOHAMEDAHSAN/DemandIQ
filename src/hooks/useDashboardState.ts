import { useState, useCallback } from 'react';
import { DashboardState, DataSummary, ProductMetrics, InventoryRecord, ScenarioType } from '@/types/inventory';

export const useDashboardState = () => {
  const [state, setState] = useState<DashboardState>("idle");
  const [data, setData] = useState<InventoryRecord[]>([]);
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [productMetrics, setProductMetrics] = useState<ProductMetrics[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [forecastHorizon, setForecastHorizon] = useState(20);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>("baseline");

  const loadData = useCallback((records: InventoryRecord[]) => {
    setData(records);
    
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
    
    setState("idle");
  }, []);

  const trainModels = useCallback(() => {
    setState("training");
    setTrainingLogs([]);
    
    // Simulate training process
    const products = Array.from(new Set(data.map(r => r.Product_ID)));
    let logIndex = 0;
    
    const interval = setInterval(() => {
      if (logIndex < products.length) {
        const product = products[logIndex];
        const guardrailTriggered = Math.random() > 0.85;
        
        setTrainingLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Training ${product}...`,
          guardrailTriggered ? `[WARN] Guardrail triggered: Price elasticity illogical, removed from model` : `[OK] Model converged successfully`
        ]);
        
        logIndex++;
      } else {
        clearInterval(interval);
        
        // Generate metrics for all products
        const metrics: ProductMetrics[] = products.map(pid => ({
          product_id: pid,
          success_rate: 0.95 + Math.random() * 0.05,
          wmape: 0.05 + Math.random() * 0.1,
          guardrail_triggered: Math.random() > 0.85,
          drivers: ["Price Sensitive", "Seasonal"].filter(() => Math.random() > 0.5),
          recommendation: Math.random() > 0.5 ? "High Potential: Run aggressive promotion" : "Stable: Maintain current strategy",
          predicted_demand: Math.floor(100 + Math.random() * 500),
          confidence: 0.85 + Math.random() * 0.1
        }));
        
        setProductMetrics(metrics);
        setState("trained");
        setSelectedProduct(products[0]);
      }
    }, 300);
  }, [data]);

  const generateForecast = useCallback(() => {
    setState("forecasting");
    
    setTimeout(() => {
      setState("results");
    }, 1500);
  }, []);

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
