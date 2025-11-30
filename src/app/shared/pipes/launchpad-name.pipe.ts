import { Pipe, PipeTransform, inject } from '@angular/core';
import { LaunchpadService } from 'app/core/launchpad.service';
import { map, Observable } from 'rxjs';

@Pipe({
    name: 'launchpadName',
    standalone: true
})
export class LaunchpadNamePipe implements PipeTransform {
    private launchpadService = inject(LaunchpadService);

    transform(launchpadId: string): Observable<string> {
        return this.launchpadService.getAllLaunchpads().pipe(
            map(launchpads => {
                const launchpad = launchpads.find(lp => lp.id === launchpadId);
                return launchpad ? launchpad.name : 'Unknown Launchpad';
            })
        );
    }
}
