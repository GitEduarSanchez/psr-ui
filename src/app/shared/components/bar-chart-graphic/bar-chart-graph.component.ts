import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js'
import { GraphConfig } from './interfaces/graph-config.interface';
Chart.register(...registerables);

@Component({
  selector: 'bar-chart-graph',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart-graph.component.html',
  styleUrl: './bar-chart-graph.component.scss'
})
export class BarChartGraphComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  public id!: string
  public chart!: any;
  
  @Input() config!: GraphConfig

  ngOnInit(): void {
    this.id = 'chart_' + Math.floor(Math.random() * 101);
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.buildGraph();
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildGraph();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private buildGraph() {
    if (this.config?.data?.labels && this.config?.data?.datasets && this.id) {
      const existingChart = Chart.getChart(this.id);

      if (existingChart) {
        existingChart.destroy();
      }
    }

    const canvas = document.getElementById(this.id) as HTMLCanvasElement;
    if (canvas) {
      this.chart = new Chart(this.id, {
        type: 'bar',
        data: {
          labels: this.config.data.labels,
          datasets: this.config.data.datasets
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          }
        },
        plugins: [
          {
            id: 'customYAxisTitle',
            afterDraw: (chart) => {
              const { ctx, chartArea: { top } } = chart;
    
              ctx.save();
              ctx.font = 'bold 16px Roboto';
    
              const measurementUnits = this.config.data.measurementUnits;
    
              ctx.fillText(measurementUnits || '', 5, top - 20);
              ctx.restore();
            }
          },
        ],
      }) as Chart;
    }
  }

  private updateGraph() {
     if (this.chart) {
      this.chart.data.labels = this.config.data.labels;
      this.chart.data.datasets = this.config.data.datasets;
      this.chart.update();
    } else {
      this.buildGraph();
    }
  }
}
