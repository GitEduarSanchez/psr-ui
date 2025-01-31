import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { HistoryItem, IReaderHistories } from '../../../core/interfaces';
import { BarChartGraphComponent } from '../bar-chart-graphic/bar-chart-graph.component';
import { GraphConfig } from '../bar-chart-graphic/interfaces/graph-config.interface';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'history',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    BarChartGraphComponent
  ],
  templateUrl: './history.component.html',
  styleUrl: './styles/history.component.scss'
})
export class HistoryComponent implements AfterViewInit, OnChanges {

  public graphConfig!: GraphConfig
  public dataSource!: MatTableDataSource<HistoryItem>;
  public displayedColumns: string[] = ['year', 'month', 'consumption'];
  public translations: any;

  @Input(({ required: true })) config!: IReaderHistories
  @Input() isExpanded: boolean = true;
  @Input() deviceType!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private translationService: TranslationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.config.items) {
      this.updateDataSource();
      this.buildGraphConfig();
    }
  }

  ngAfterViewInit() {
    this.updateDataSource();

    this.translationService.selectedLanguage$.subscribe(() => {
      setTimeout(() => {
        this.translations = this.translationService.getTranslations();
      });
    });
  }

  private updateDataSource() {
    if (this.config) {
      this.dataSource = new MatTableDataSource<HistoryItem>(this.config.items);
      this.dataSource.paginator = this.paginator;
    }
  }

  private buildGraphConfig() {
    if (this.config) {
      this.graphConfig = {
        data: {
          labels: this.buildGraphLabels(),
          measurementUnits: this.setMeasurementUnits(),
          datasets: [{
            label: 'Consumo',
            data: this.buildGraphDataSetReadings(),
            borderWidth: 1
          }]
        }
      }
    }
  }

  private buildGraphLabels(): string[] {
    let labels: string[] = [];
    this.config.items.forEach((item) => {
      labels.push(item.month);
    })
    return labels
  }

  private buildGraphDataSetReadings(): number[] {
    let readings: number[] = [];
    this.config.items.forEach((item) => {
      readings.push(Number(item.reader));
    })
    return readings
  }

  private setMeasurementUnits(): string {
    let units = '';
    switch (this.deviceType) {
      case "Light":
        units = 'KWh'
        break;
      case "Water":
        units = 'Ml'
        break;
      case "Gas":
        units = 'M3'
        break;
      default:
        units = '';
    }
    return units
  }
}