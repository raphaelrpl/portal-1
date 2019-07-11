import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';

@Component({
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {

  @ViewChild('toolbar', {static: true}) toolbar: ElementRef;
  @ViewChild('footer', {static: true}) footer: ElementRef;
  
  public toolbarHeight: number;
  public footerHeight: number;
  public innerHeight: any;

  ngOnInit() {
    this.toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;
    this.onResize('');
  }

  ngAfterViewInit() {
    this.toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;
    this.onResize('');
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.innerHeight = window.innerHeight - this.toolbarHeight - this.footerHeight;
  }

}
