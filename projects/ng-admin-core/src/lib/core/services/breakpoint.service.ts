import { Injectable, inject, signal, computed } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

/**
 * Service for managing responsive breakpoints and screen sizes
 * Uses Angular CDK BreakpointObserver for reactive breakpoint detection
 */
@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  /**
   * Current screen size category
   */
  screenSize = signal<'mobile' | 'tablet' | 'desktop'>('desktop');

  /**
   * Whether the current screen is mobile size
   */
  isMobile = computed(() => this.screenSize() === 'mobile');

  /**
   * Whether the current screen is tablet size
   */
  isTablet = computed(() => this.screenSize() === 'tablet');

  /**
   * Whether the current screen is desktop size
   */
  isDesktop = computed(() => this.screenSize() === 'desktop');

  /**
   * Whether the current screen is mobile or tablet (small screens)
   */
  isSmallScreen = computed(() =>
    this.screenSize() === 'mobile' || this.screenSize() === 'tablet'
  );

  constructor() {
    // Observe mobile breakpoints (XSmall and Small)
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        map(result => result.matches ? 'mobile' as const : null)
      )
      .subscribe(size => {
        if (size) this.screenSize.set(size);
      });

    // Observe tablet breakpoints (Medium)
    this.breakpointObserver
      .observe([Breakpoints.Medium])
      .pipe(
        map(result => result.matches ? 'tablet' as const : null)
      )
      .subscribe(size => {
        if (size) this.screenSize.set(size);
      });

    // Observe desktop breakpoints (Large and XLarge)
    this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .pipe(
        map(result => result.matches ? 'desktop' as const : null)
      )
      .subscribe(size => {
        if (size) this.screenSize.set(size);
      });
  }

  /**
   * Check if the screen matches a specific breakpoint
   */
  matches(breakpoint: string): boolean {
    return this.breakpointObserver.isMatched(breakpoint);
  }

  /**
   * Check if the screen matches any of the provided breakpoints
   */
  matchesAny(breakpoints: string[]): boolean {
    return breakpoints.some(bp => this.matches(bp));
  }
}
