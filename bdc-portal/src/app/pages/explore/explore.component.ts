import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatSidenav } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store, select } from '@ngrx/store';
import { ExploreState } from './explore.state';

/**
 * Explore Component
 * Initialization component of the spatial data visualization page
 */
@Component({
  templateUrl: './explore.component.html'
})
export class ExploreComponent implements OnInit, AfterViewInit {

  /** component reference toolbar */
  @ViewChild('toolbar', {static: true}) toolbar: ElementRef;
  /** component reference footer */
  @ViewChild('footer', {static: true}) footer: ElementRef;
  /** component reference sidenav */
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  /** toolbar component height */
  public toolbarHeight: number;
  /** footer component height */
  public footerHeight: number;
  /** map height in window */
  public innerHeight: number;

  constructor(private store: Store<ExploreState>, private spinner: NgxSpinnerService) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.loading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }

  /**
   * get Height of the toolbar and footer components
   * when initialize this component
   */
  ngOnInit() {
    this.toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;
    this.onResize('');
  }

  /**
   * get Height of the toolbar and footer components
   * after initialize this component
   */
  ngAfterViewInit() {
    this.toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;
    setTimeout( _ => this.onResize(''));
  }

  /**
   * toggleDrawer - enable or disable the side menu of the map page
   */
  toggleDrawer() {
    this.sidenav.toggle();
  }

  /**
   * onResize - calculate the size of the map when you modify the size of the window
   * @param _ ignored - not used
   */
  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.innerHeight = window.innerHeight - this.toolbarHeight - this.footerHeight;
  }

}
