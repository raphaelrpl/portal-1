import { Component, Input } from '@angular/core';

/**
 * Alert component
 * simple static component
 */
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  @Input('type') type: string;
  @Input('message') message: string;

  public getIcon(type: string): string {
    switch (type) {
      case 'error':
        return 'error_outline';
      case 'warning':
        return 'alert';
    }
  }

}
