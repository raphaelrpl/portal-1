import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Sidenav component
 * simple static component
 */
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  /** route path actived */
  public pathActive = '';
  /** list of links */
  public links = [];

  /**
   * get path by route and set links in list
   */
  constructor(private router: Router) {
    const path = this.router.url;
    this.pathActive = path.split('/')[2];
    this.links = [
      {
        path: '/admin/cubes',
        icon: 'filter_none',
        title: 'Cubes',
        group: 'cubes'
      },
      { path: '/admin/samples/upload',
        icon: 'satellite',
        title: 'Samples',
        group: 'samples',
        children: [
          {
            path: '/admin/samples/classification_system/create',
            icon: 'filter_none',
            title: 'Classification System',
            group: 'class_system'
          },
          {
            path: '/admin/samples/upload',
            icon: 'satellite',
            title: 'Upload',
            group: 'upload',
          }
        ]
      }
    ];
  }
}
