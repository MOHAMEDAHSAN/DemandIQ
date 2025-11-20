import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductMetrics } from '@/types/inventory';

interface ActionableTablesProps {
  metrics: ProductMetrics[];
}

export const ActionableTables = ({ metrics }: ActionableTablesProps) => {
  if (metrics.length === 0) return null;

  const topPerformers = [...metrics]
    .sort((a, b) => b.predicted_demand - a.predicted_demand)
    .slice(0, 5);

  const bottomPerformers = [...metrics]
    .sort((a, b) => a.predicted_demand - b.predicted_demand)
    .slice(0, 5);

  const handleExport = () => {
    const csvContent = [
      ['Product_ID', 'Predicted_Demand', 'Confidence', 'WMAPE', 'Recommendation'].join(','),
      ...metrics.map(m => [
        m.product_id,
        m.predicted_demand,
        (m.confidence * 100).toFixed(1) + '%',
        (m.wmape * 100).toFixed(2) + '%',
        `"${m.recommendation}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forecast_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6 border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Performers</h2>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead className="text-right">Predicted Demand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPerformers.map((metric) => (
              <TableRow key={metric.product_id}>
                <TableCell className="font-medium">{metric.product_id}</TableCell>
                <TableCell className="text-right success-text font-semibold">
                  {metric.predicted_demand.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6 border-border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Critical Attention Required</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Demand</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bottomPerformers.map((metric) => (
              <TableRow key={metric.product_id}>
                <TableCell className="font-medium">{metric.product_id}</TableCell>
                <TableCell className="text-destructive font-semibold">
                  {metric.predicted_demand.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {metric.recommendation.split(':')[1]?.trim() || 'Review pricing'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
