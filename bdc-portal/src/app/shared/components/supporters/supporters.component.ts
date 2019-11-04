import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
    selector: 'app-supporters',
    templateUrl: 'supporters.component.html',
    styleUrls: ['./supporters.component.scss']
})
export class SupportersComponent {
    constructor(private _bottomSheetRef: MatBottomSheetRef<SupportersComponent>) {}

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }
}