import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/**
 * component to view infos about to project
 */
@Component({
    selector: 'app-about',
    templateUrl: 'about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

    /**
     * open page in dialog
     */
    constructor(public dialogRef: MatDialogRef<AboutComponent>) {}

}
