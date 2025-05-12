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
  tauxMensuels: any[] = [];

  // 📊 Ligne : Évolution SMS
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
      legend: { labels: { color: 'black' } }
    },
    scales: {
      x: { ticks: { color: 'black' }, title: { display: true, text: 'Mois/Année', color: 'black' } },
      y: { ticks: { color: 'black' }, title: { display: true, text: 'Total SMS', color: 'black' } }
    }
  };

  public lineChartType: 'line' = 'line';

  // 📊 Barres : Taux mensuels
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Réussite (%)',
        backgroundColor: '#28a745'
      },
      {
        data: [],
        label: 'Échec (%)',
        backgroundColor: '#dc3545'
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { labels: { color: 'black' } }
    },
    scales: {
      x: { ticks: { color: 'black' }, title: { display: true, text: 'Mois', color: 'black' } },
      y: { ticks: { color: 'black' }, title: { display: true, text: 'Taux (%)', color: 'black' }, min: 0, max: 100 }
    }
  };

  public barChartType: 'bar' = 'bar';

  // 🔵 Nouveau : Statistiques des puces
  pucesStats: any = {
    contact: { count: 0, taux: 0 },
    mission: { count: 0, taux: 0 },
    unassigned: { count: 0, taux: 0 },
    total: 0
  };

  public pucesChartData: ChartData<'pie'> = {
    labels: ['Affectées à un contact', 'Affectées à une mission', 'Non affectées'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#17a2b8', '#fc5130', '#6c757d']
      }
    ]
  };

  public pucesChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { labels: { color: 'black' } }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // 📌 Graphique ligne : SMS envoyés
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

    // 📌 Graphique barres : Taux mensuels
    this.dashboardService.getTauxMensuels().subscribe(data => {
      this.tauxMensuels = data.tauxMensuels;

      const labels = this.tauxMensuels.map(t => t.mois);
      const success = this.tauxMensuels.map(t => t.taux_success);
      const fail = this.tauxMensuels.map(t => t.taux_fail);

      this.barChartData = {
        labels,
        datasets: [
          {
            data: success,
            label: 'Réussite (%)',
            backgroundColor: '#28a745'
          },
          {
            data: fail,
            label: 'Échec (%)',
            backgroundColor: '#dc3545'
          }
        ]
      };
    });

    // 📌 Graphique camembert : Statistiques des puces
    this.dashboardService.getPuceStats().subscribe(
      (response) => {
        this.pucesStats = response;
        this.pucesChartData = {
          labels: ['Affectées à un contact', 'Affectées à une mission', 'Non affectées'],
          datasets: [
            {
              data: [
                this.pucesStats.contact.count,
                this.pucesStats.mission.count,
                this.pucesStats.unassigned.count
              ],
              backgroundColor: ['#17a2b8', '#ffc107', '#6c757d']
            }
          ]
        };
      },
      (error) => {
        console.error('Erreur récupération statistiques des puces:', error);
      }
    );
  }
}
