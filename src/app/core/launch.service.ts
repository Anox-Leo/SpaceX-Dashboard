import { inject, Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Launch } from 'app/models/launch.interface';
import { Query } from 'app/models/query.interface';

@Injectable({ providedIn: 'root' })
export class LaunchService implements OnDestroy {
  private apiUrl = 'https://api.spacexdata.com';
  private http = inject(HttpClient)

  _allLaunches: WritableSignal<Launch[]> = signal([]);

  ngOnDestroy() { }

  fetchAllLaunches(): Observable<Launch[]> {
    return this.http.get<Launch[]>(`${this.apiUrl}/v5/launches`).pipe(
      tap(this._allLaunches.set)
    );
  }

  getLaunchById(id: string): Observable<Launch> {
    return this.http.get<Launch>(`${this.apiUrl}/v5/launches/${id}`);
  }

  fetchUpcomingOrOldLaunchesPaginated(upcoming: boolean, limit: number, page: number): Observable<Query> {
    return this.http.post<Query>(`${this.apiUrl}/v5/launches/query`, {
      query: { upcoming },
      options: {
        sort: { date_utc: upcoming ? 'asc' : 'desc' },
        limit,
        page
      }
    });
  }
}
