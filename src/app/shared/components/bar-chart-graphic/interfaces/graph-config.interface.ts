export interface GraphConfig {
   data: BarChartData;
}

export interface BarChartData {
    labels: string[];
    datasets: BarChartDataSets[];
    measurementUnits?: string;
}

export interface BarChartDataSets {
    label: string;
    data: string[] | number[];
    borderWidth: number;
}