import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataSummary } from '@/types/inventory';

interface DataUploadProps {
  onUpload: (file: File) => void;
  dataSummary: DataSummary | null;
}

export const DataUpload = ({ onUpload, dataSummary }: DataUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Card className="p-6 border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">DemandForecast IQ</h1>
        <label htmlFor="csv-upload">
          <Button variant="outline" className="cursor-pointer" asChild>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Upload Inventory CSV
            </span>
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      
      {dataSummary && (
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-semibold">{dataSummary.totalRecords.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Unique Products</p>
            <p className="text-2xl font-semibold">{dataSummary.uniqueProducts}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date Range</p>
            <p className="text-sm font-semibold">{dataSummary.dateRange.min} – {dataSummary.dateRange.max}</p>
          </div>
        </div>
      )}
    </Card>
  );
};
