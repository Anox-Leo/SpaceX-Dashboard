import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Rocket } from 'app/models/rocket.interface';

@Injectable({ providedIn: 'root' })
export class RocketService {
    private http = inject(HttpClient);
    private apiUrl = 'https://api.spacexdata.com/v4/rockets';

    private rockets$ = this.http.get<Rocket[]>(this.apiUrl).pipe(
        shareReplay(1)
    );

    getAllRockets(): Observable<Rocket[]> {
        return this.rockets$;
    }
}
