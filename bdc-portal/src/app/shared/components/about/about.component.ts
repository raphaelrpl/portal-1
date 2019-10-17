import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-about',
    templateUrl: 'about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    
    constructor(public dialogRef: MatDialogRef<AboutComponent>) {}
        
}