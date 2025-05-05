import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {};

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'SMS envoyés',
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'black'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'black'
        },
        title: {
          display: true,
          text: 'Mois/Année',
          color: 'black'
        }
      },
      y: {
        ticks: {
          color: 'black'
        },
        title: {
          display: true,
          text: 'Total SMS',
          color: 'black'
        }
      }
    }
  };

  public lineChartType: 'line' = 'line';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(data => {
      this.stats = data;

      if (data.smsEvolution) {
        const labels = data.smsEvolution.map((e: any) => `${e.mois}/${e.annee}`);
        const totals = data.smsEvolution.map((e: any) => e.total_sms);

        this.lineChartData = {
          labels,
          datasets: [
            {
              data: totals,
              label: 'SMS envoyés',
              borderColor: '#007bff',
              backgroundColor: 'rgba(0,123,255,0.2)',
              fill: true,
              tension: 0.4
            }
          ]
        };
      }
    });
  }
}
