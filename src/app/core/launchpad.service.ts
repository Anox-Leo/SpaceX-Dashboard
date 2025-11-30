import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Launchpad } from 'app/models/launchpad.interface';

@Injectable({ providedIn: 'root' })
export class LaunchpadService {
    private http = inject(HttpClient);
    private apiUrl = 'https://api.spacexdata.com/v4/launchpads';

    private launchpads$ = this.http.get<Launchpad[]>(this.apiUrl).pipe(
        shareReplay(1)
    );

    getAllLaunchpads(): Observable<Launchpad[]> {
        return this.launchpads$;
    }
}
