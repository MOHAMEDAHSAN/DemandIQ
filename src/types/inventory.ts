export interface InventoryRecord {
  Date: string;
  Store_ID: string;
  Product_ID: string;
  Category: string;
  Region: string;
  Inventory_Level: number;
  Units_Sold: number;
  Units_Ordered: number;
  Demand_Forecast: number;
  Price: number;
  Discount: number;
  Weather_Condition: string;
  Holiday_Promotion: number;
  Competitor_Pricing: number;
  Seasonality: string;
}

export interface DataSummary {
  totalRecords: number;
  uniqueProducts: number;
  dateRange: {
    min: string;
    max: string;
  };
}

export interface ProductMetrics {
  product_id: string;
  success_rate: number;
  wmape: number;
  guardrail_triggered: boolean;
  drivers: string[];
  recommendation: string;
  predicted_demand: number;
  confidence: number;
}

export interface ForecastDataPoint {
  date: string;
  historical?: number;
  forecast?: number;
}

export type DashboardState = "idle" | "training" | "trained" | "forecasting" | "results";
export type ScenarioType = "baseline" | "discount" | "price_cut" | "holiday";
