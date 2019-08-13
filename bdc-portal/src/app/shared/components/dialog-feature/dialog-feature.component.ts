import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Feature } from 'src/app/pages/explore/sidenav/collection/collection.interface';
import { formatDateUSA } from '../../helpers/date';

/**
 * Dialog Features
 * view infos of the cube and downloads assets
 */
@Component({
  selector: 'app-dialog-feature',
  templateUrl: './dialog-feature.component.html',
  styleUrls: ['./dialog-feature.component.scss']
})
export class DialogFeatureComponent {

  /** type download - by feature or cube */
  public typeDownload = 'feature'
  /** list all features selected by search */
  public features = [];
  /** feature selected by user */
  public feature: Feature;
  /** bands of the cube */
  public bands: object = {};
  /** file with images links to download */
  public fileUrl: SafeResourceUrl;
  /** file name */
  public fileName: string;

  /** receive infos to display in this component */
  constructor(
    public dialogRef: MatDialogRef<DialogFeatureComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.feature = data.feature;
      this.features = data.features;
      data.feature['bands'].forEach( (band: string) => {
        this.bands[band] = true
      });
  }

  /** format date to USA template */
  getDateFormated(date: string) {
    return formatDateUSA(new Date(date));
  }
  
  /** generate file with links of the bands to download */
  async generateLinks() {
    let links = [];
    await this.features.forEach( (feat: Feature) => {
      Object.keys(this.bands).forEach( band => {
        if (this.bands[band]) {
          links.push(feat.assets[band].href);
        }
      })
    });

    const blob = new Blob(links, {type: "text/plain;charset=utf-8"});
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    this.fileName = `${this.data['collections']}.txt`;
  }
}
