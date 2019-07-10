import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';

@Component({
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {

  @ViewChild('navigation', {static: true}) navigation: ElementRef;
  @ViewChild('footer', {static: true}) footer: ElementRef;
  
  public navigationHeight: number;
  public footerHeight: number;
  public innerWidth: any;
  public innerHeight: any;

  ngOnInit() {
    this.navigationHeight = this.navigation.nativeElement.offsetHeight;
    this.footerHeight = this.navigation.nativeElement.offsetHeight;
    this.onResize('');
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight - this.navigationHeight - this.footerHeight;
  }

}
