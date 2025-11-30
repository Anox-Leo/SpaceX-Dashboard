import { Pipe, PipeTransform, inject } from '@angular/core';
import { RocketService } from 'app/core/rocket.service';
import { map, Observable } from 'rxjs';

@Pipe({
    name: 'rocketName',
    standalone: true
})
export class RocketNamePipe implements PipeTransform {
    private rocketService = inject(RocketService);

    transform(rocketId: string): Observable<string> {
        return this.rocketService.getAllRockets().pipe(
            map(rockets => {
                const rocket = rockets.find(r => r.id === rocketId);
                return rocket ? rocket.name : 'Unknown Rocket';
            })
        );
    }
}
