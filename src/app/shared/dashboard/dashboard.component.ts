import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { LaunchService } from 'app/core/launch.service';
import { RocketService } from 'app/core/rocket.service';
import { LaunchpadService } from 'app/core/launchpad.service';
import { Launch } from 'app/models/launch.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private spacexService = inject(LaunchService);
  private rocketService = inject(RocketService);
  private launchpadService = inject(LaunchpadService);

  private launches = signal<Launch[]>([]);
  private rockets = toSignal(this.rocketService.getAllRockets(), { initialValue: [] });
  private launchpads = toSignal(this.launchpadService.getAllLaunchpads(), { initialValue: [] });

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Launches Per Year',
        color: 'white',
        font: { size: 18, weight: 'bold' }
      }
    },
    scales: {
      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    }
  };
  public barChartData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: 'rgba(33, 150, 243, 0.8)',
      borderColor: 'rgba(33, 150, 243, 1)',
      borderWidth: 2,
      borderRadius: 4
    }]
  });
  public barChartType: ChartType = 'bar';

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: 'white', padding: 15, font: { size: 12 } }
      },
      title: {
        display: true,
        text: 'Mission Success Rate',
        color: 'white',
        font: { size: 18, weight: 'bold' }
      }
    }
  };
  public pieChartData = signal<ChartData<'pie'>>({
    labels: ['Success', 'Failure'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4CAF50', '#F44336'],
      hoverBackgroundColor: ['#66BB6A', '#EF5350'],
      borderColor: '#1a1a1a',
      borderWidth: 2
    }]
  });
  public pieChartType: ChartType = 'pie';

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: 'white', padding: 15, font: { size: 12 } }
      },
      title: {
        display: true,
        text: 'Launches by Rocket Type',
        color: 'white',
        font: { size: 18, weight: 'bold' }
      }
    }
  };
  public doughnutChartData = signal<ChartData<'doughnut'>>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ],
      borderColor: '#1a1a1a',
      borderWidth: 2
    }]
  });
  public doughnutChartType: ChartType = 'doughnut';

  public horizontalBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Most Used Launchpads',
        color: 'white',
        font: { size: 18, weight: 'bold' }
      }
    },
    scales: {
      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    }
  };
  public horizontalBarChartData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: 'rgba(156, 39, 176, 0.8)',
      borderColor: 'rgba(156, 39, 176, 1)',
      borderWidth: 2,
      borderRadius: 4
    }]
  });
  public horizontalBarChartType: ChartType = 'bar';

  constructor() {
    this.loadData();
  }

  private loadData() {
    this.spacexService.fetchAllLaunches().subscribe(launches => {
      this.launches.set(launches);
      this.processLaunchesPerYear(launches);
      this.processSuccessFailure(launches);
      this.processRocketTypes(launches);
      this.processLaunchpads(launches);
    });
  }

  private processLaunchesPerYear(launches: Launch[]) {
    const yearCounts = new Map<string, number>();

    launches.forEach(launch => {
      const year = new Date(launch.date_utc).getFullYear().toString();
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
    });

    const sortedYears = Array.from(yearCounts.keys()).sort();
    const counts = sortedYears.map(year => yearCounts.get(year) || 0);

    this.barChartData.set({
      labels: sortedYears,
      datasets: [{
        data: counts,
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 2,
        borderRadius: 4
      }]
    });
  }

  private processSuccessFailure(launches: Launch[]) {
    const success = launches.filter(l => l.success === true).length;
    const failure = launches.filter(l => l.success === false).length;

    this.pieChartData.set({
      labels: ['Success', 'Failure'],
      datasets: [{
        data: [success, failure],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#EF5350'],
        borderColor: '#1a1a1a',
        borderWidth: 2
      }]
    });
  }

  private processRocketTypes(launches: Launch[]) {
    const rocketCounts = new Map<string, number>();

    launches.forEach(launch => {
      rocketCounts.set(launch.rocket, (rocketCounts.get(launch.rocket) || 0) + 1);
    });

    const rocketIds = Array.from(rocketCounts.keys());
    const rocketNames = rocketIds.map(id => {
      const rocket = this.rockets().find(r => r.id === id);
      return rocket?.name || 'Unknown';
    });
    const counts = rocketIds.map(id => rocketCounts.get(id) || 0);

    this.doughnutChartData.set({
      labels: rocketNames,
      datasets: [{
        data: counts,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderColor: '#1a1a1a',
        borderWidth: 2
      }]
    });
  }

  private processLaunchpads(launches: Launch[]) {
    const launchpadCounts = new Map<string, number>();

    launches.forEach(launch => {
      launchpadCounts.set(launch.launchpad, (launchpadCounts.get(launch.launchpad) || 0) + 1);
    });

    const sortedEntries = Array.from(launchpadCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const launchpadNames = sortedEntries.map(([id]) => {
      const launchpad = this.launchpads().find(lp => lp.id === id);
      return launchpad?.name || 'Unknown';
    });
    const counts = sortedEntries.map(([, count]) => count);

    this.horizontalBarChartData.set({
      labels: launchpadNames,
      datasets: [{
        data: counts,
        backgroundColor: 'rgba(156, 39, 176, 0.8)',
        borderColor: 'rgba(156, 39, 176, 1)',
        borderWidth: 2,
        borderRadius: 4
      }]
    });
  }
}

