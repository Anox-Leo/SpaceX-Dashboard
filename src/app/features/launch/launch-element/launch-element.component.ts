import { Component, computed, inject, input } from '@angular/core';
import { Launch } from 'app/models/launch.interface';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Falcon9LogoComponent } from 'app/shared/falcons-logo/falcon9-logo/falcon9-logo.component';
import { FalconHeavyLogoComponent } from 'app/shared/falcons-logo/falcon-heavy-logo/falcon-heavy-logo.component';
import { RocketService } from 'app/core/rocket.service';
import { toSignal } from '@angular/core/rxjs-interop';

registerLocaleData(localeFr);

@Component({
  selector: 'app-launch-element',
  imports: [
    DatePipe,
    Falcon9LogoComponent,
    FalconHeavyLogoComponent
  ],
  templateUrl: './launch-element.component.html',
  styleUrl: './launch-element.component.css',
})
export class LaunchElementComponent {
  private rocketService = inject(RocketService);

  launch = input.required<Launch>();
  rockets = toSignal(this.rocketService.getAllRockets(), { initialValue: [] });

  rocketName = computed(() => {
    const rocket = this.rockets().find(r => r.id === this.launch().rocket);
    return rocket?.name ?? 'Unknown Rocket';
  });

  showMissionPatch = computed(() => {
    return !!this.launch().links.patch.small;
  });

  isFalconHeavy = computed(() => {
    return this.rocketName().toLowerCase().includes('falcon heavy');
  });

  statusText = computed(() => {
    return this.launch().upcoming ? 'Upcoming' : 'Past';
  });
}

