import { useEffect } from 'react';
import { useDashboardState } from '@/hooks/useDashboardState';
import { DataUpload } from '@/components/DataUpload';
import { TrainingConsole } from '@/components/TrainingConsole';
import { ScenarioConfig } from '@/components/ScenarioConfig';
import { ProductDeepDive } from '@/components/ProductDeepDive';
import { ActionableTables } from '@/components/ActionableTables';
import { generateMockData, parseCSV } from '@/utils/mockData';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
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
  } = useDashboardState();

  // Auto-load mock data on mount
  useEffect(() => {
    const mockData = generateMockData();
    loadData(mockData);
    toast({
      title: "Mock Data Loaded",
      description: `${mockData.length.toLocaleString()} records across ${new Set(mockData.map(r => r.Product_ID)).size} products`,
    });
  }, [loadData]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const records = parseCSV(text);
        loadData(records);
        toast({
          title: "Data Uploaded Successfully",
          description: `Loaded ${records.length} records`,
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Invalid CSV format. Please check your file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const uniqueProducts = Array.from(new Set(data.map(r => r.Product_ID))).sort();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <DataUpload onUpload={handleFileUpload} dataSummary={dataSummary} />
        
        <TrainingConsole 
          state={state}
          logs={trainingLogs}
          onTrain={trainModels}
          metrics={productMetrics}
        />
        
        {(state === "trained" || state === "forecasting" || state === "results") && (
          <ScenarioConfig
            state={state}
            forecastHorizon={forecastHorizon}
            selectedScenario={selectedScenario}
            onHorizonChange={setForecastHorizon}
            onScenarioChange={setSelectedScenario}
            onGenerate={generateForecast}
            metrics={productMetrics}
          />
        )}
        
        {(state === "trained" || state === "results") && (
          <>
            <ProductDeepDive
              products={uniqueProducts}
              selectedProduct={selectedProduct}
              onProductChange={setSelectedProduct}
              metrics={productMetrics}
              data={data}
              forecastHorizon={forecastHorizon}
            />
            
            <ActionableTables metrics={productMetrics} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
