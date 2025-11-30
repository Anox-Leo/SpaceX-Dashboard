import {Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener} from '@angular/core';

@Component({
  selector: 'app-starfield-background',
  template: '<canvas #starfield></canvas>',
  styles: [`
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: #000;
    }
  `]
})
export class StarfieldBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('starfield', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private animationId!: number;
  private width!: number;
  private height!: number;

  ngOnInit(): void {
    this.setupCanvas();
    this.createStars(200);
    this.animate();

    window.addEventListener('resize', () => this.handleResize());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', () => this.handleResize());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.handleResize();
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
  }

  private createStars(count: number): void {
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
  }


  private animate(): void {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Dessiner les étoiles avec scintillement
    this.stars.forEach(star => {
      star.phase += star.twinkleSpeed;
      star.opacity = 0.3 + Math.sin(star.phase) * 0.7;

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private handleResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;

    // Regenerate stars for new screen size
    this.stars = [];
    this.createStars(200);
  }
}

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  phase: number;
}

interface Planet {
  angle: number;
  distance: number;
  size: number;
  speed: number;
  color: string;
  centerX: number;
  centerY: number;
}
