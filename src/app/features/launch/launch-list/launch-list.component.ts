import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LaunchService } from 'app/core/launch.service';
import { LaunchElementComponent } from 'app/features/launch/launch-element/launch-element.component';
import { Launch } from 'app/models/launch.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-launch-element-list',
  templateUrl: './launch-list.component.html',
  styleUrls: ['./launch-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    LaunchElementComponent,
    RouterLink
  ]
})
export class LaunchListComponent {
  private readonly spacexService = inject(LaunchService);

  launchList = signal<Launch[]>([]);
  currentPage = signal(1);
  pageSize = signal(10);
  isUpcoming = signal(true);
  totalItems = signal(0);

  pageSizeOptions = [10, 20, 50];

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  displayText = computed(() => this.isUpcoming() ? 'Upcoming Launches' : 'Latest Launches');

  constructor() {
    effect(() => {
      this.loadLaunches();
    });
  }

  private loadLaunches() {
    const page = this.currentPage();
    const size = this.pageSize();
    const upcoming = this.isUpcoming();

    this.spacexService.fetchUpcomingOrOldLaunchesPaginated(upcoming, size, page)
      .subscribe(response => {
        this.launchList.set(response.docs);
        this.totalItems.set(response.totalDocs);
      });
  }

  onPageSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
  }

  onFilterChange() {
    this.isUpcoming.set(!this.isUpcoming());
    this.currentPage.set(1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
