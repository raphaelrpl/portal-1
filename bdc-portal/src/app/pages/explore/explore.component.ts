import { Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

@Component({
  templateUrl: './explore.component.html'
})
export class ExploreComponent implements OnInit, AfterViewInit {

  @ViewChild('toolbar', {static: true}) toolbar: ElementRef;
  @ViewChild('footer', {static: true}) footer: ElementRef;

  public toolbarHeight: number;
  public footerHeight: number;
  public innerHeight: number;

  ngOnInit() {
    this.toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;
    this.onResize('');
  }

  ngAfterViewInit() {
    this.toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;
    setTimeout( _ => this.onResize(''));
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.innerHeight = window.innerHeight - this.toolbarHeight - this.footerHeight;
  }

}
