import { Component, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LaunchService } from 'app/core/launch.service';
import { RocketService } from 'app/core/rocket.service';
import { LaunchpadService } from 'app/core/launchpad.service';
import { Launch } from 'app/models/launch.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

@Component({
    selector: 'app-launch-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe],
    templateUrl: './launch-detail.component.html',
    styleUrls: ['./launch-detail.component.css']
})
export class LaunchDetailComponent {
    private route = inject(ActivatedRoute);
    private spacexService = inject(LaunchService);
    private rocketService = inject(RocketService);
    private launchpadService = inject(LaunchpadService);

    launch = toSignal(
        this.route.paramMap.pipe(
            map(params => params.get('id') || ''),
            switchMap(id => this.spacexService.getLaunchById(id))
        )
    );

    rockets = toSignal(this.rocketService.getAllRockets(), { initialValue: [] });
    launchpads = toSignal(this.launchpadService.getAllLaunchpads(), { initialValue: [] });

    rocketName = computed(() => {
        const launch = this.launch();
        if (!launch) return 'Unknown Rocket';
        const rocket = this.rockets().find(r => r.id === launch.rocket);
        return rocket?.name || 'Unknown Rocket';
    });

    launchpadName = computed(() => {
        const launch = this.launch();
        if (!launch) return 'Unknown Launchpad';
        const launchpad = this.launchpads().find(lp => lp.id === launch.launchpad);
        return launchpad?.name || 'Unknown Launchpad';
    });

    image = computed(() => {
        const launch = this.launch();
        if (!launch) return '';

        if (launch.links.patch.small) {
            return launch.links.patch.small;
        }

        const rocket = this.rockets().find(r => r.id === launch.rocket);
        return rocket?.flickr_images[0] || '';
    });

    isPatch = computed(() => {
        const launch = this.launch();
        return launch ? !!launch.links.patch.small : false;
    });

    statusText = computed(() => {
        const launch = this.launch();
        if (!launch) return 'UNKNOWN';
        if (launch.success === true) return 'SUCCESS';
        if (launch.success === false) return 'FAILURE';
        return 'UPCOMING';
    });

    statusClass = computed(() => {
        const launch = this.launch();
        if (!launch) return '';
        if (launch.success === true) return 'success';
        if (launch.success === false) return 'failure';
        return '';
    });
}
