import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Feature } from 'geojson';
import { tileLayer } from 'leaflet';
import { setLayers, removeGroupLayer } from '../../explore.action';
import { formatDateUSA } from 'src/app/shared/helpers/date';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent {

  public samples: Feature[];
  public rangeTemporal: string[];
  public classes: string[] = [];
  public authors: string[] = [];
  public classesList: string[];
  public bbox: string;
  public authorsList: string[];
  public classesStatus = {};
  public classesColors = {};

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      const lastSamples = this.samples || [];
      if (res.samples) {
        this.classesList = [];
        this.authorsList = [];
        this.samples = Object.values(res.samples).slice(0, (Object.values(res.samples).length - 1)) as Feature[];

        if (lastSamples.length && lastSamples.length !== this.samples.length) {
          this.removeSamplesSearch();
        }

        this.samples.forEach((sample: Feature) => {
          if (this.authorsList.indexOf(sample.properties['system_name']) < 0) {
            this.authorsList.push(sample.properties['system_name']);
          }
          this.filtered();
        });

        if (Object.values(res.rangeTemporal).length) {
          this.rangeTemporal = [
            formatDateUSA(new Date(res.rangeTemporal['0'])) + 'T00:00:00',
            formatDateUSA(new Date(res.rangeTemporal['1'])) + 'T23:59:00'
          ];
        }

        if (res.bbox) {
          this.bbox = `${res.bbox['_southWest']['lng']}, ${res.bbox['_southWest']['lat']},
                        ${res.bbox['_northEast']['lng']}, ${res.bbox['_northEast']['lat']}`;
        }
      }
    });
  }

  public filtered() {
    this.samples.forEach( (sample: Feature) => {
      const authorName = sample.properties['system_name'];
      const className = sample.properties['class_name'];
      if (this.authors.indexOf(authorName) >= 0) {
        if (this.classesList.indexOf(className) < 0) {
          this.classesList.push(className);
          this.classesStatus[className] = false;
          this.classesColors[className] = this.classesColors[className] || '#FF0000';
        }
      }
    });
  }

  private removeSamplesSearch() {
    // remove sample layers
    this.store.dispatch(removeGroupLayer({
      key: 'alt',
      prefix: 'samples_'
    }));
    // disable toggle
    Object.keys(this.classesStatus).forEach( key => {
      this.classesStatus[key] = false;
    });
    // remove author
    this.authors = [];
  }

  public enableClass(event, className: string) {
    if (event.checked) {
      let queryCQL = '';
      // filter author
      if (this.authors.length === 1) {
        queryCQL += `system_name = '${this.authors[0]}'`;
      } else {
        queryCQL += '(';
        this.authors.forEach( author => {
          queryCQL += `system_name = '${author}' OR `;
        });
        queryCQL = queryCQL.substring(0, queryCQL.length - 4) + ')';
      }
      // filter class
      queryCQL += ` AND class_name = '${className}'`;
      // filter date
      queryCQL += ` AND (start_date AFTER ${this.rangeTemporal[0]} AND end_date BEFORE ${this.rangeTemporal[1]})`
      // filter bbox
      queryCQL += ` AND BBOX(location,${this.bbox})`;
      const layer = tileLayer.wms("http://brazildatacube.dpi.inpe.br/geoserver/samples/wms", {
        layers: 'samples:sample',
        format: 'image/png',
        styles: 'samples:samples',
        transparent: true,
        cql_filter: queryCQL,
        interactive: true,
        env: `color:${this.classesColors[className].replace('#', '')}`,
        alt: `samples_${className}`
      } as any);

      // display layer
      this.store.dispatch(setLayers([layer]));

    } else {
      this.store.dispatch(removeGroupLayer({
        key: 'alt',
        prefix: `samples_${className}`
      }));
    }
  }

  public DownloadSamplesByClass(className) {
    let queryCQL = ''
    // filter author
    if (this.authors.length == 1) {
      queryCQL += `system_name = '${this.authors[0]}'`;
    } else {
      queryCQL += '(';
      this.authors.forEach( author => {
        queryCQL += `system_name = '${author}' OR `;
      });
      queryCQL = queryCQL.substring(0, queryCQL.length - 4) + ')';
    }
    // filter class
    queryCQL += ` AND class_name = '${className}'`;
    // filter date
    queryCQL += ` AND (start_date AFTER ${this.rangeTemporal[0]} AND end_date BEFORE ${this.rangeTemporal[1]})`;
    // filter bbox
    queryCQL += ` AND BBOX(location,${this.bbox})`;

    // download file
    const url = `http://brazildatacube.dpi.inpe.br/geoserver/samples/ows?service=WFS&version=1.0.0&CQL_FILTER=${queryCQL}&request=GetFeature&typeName=samples:sample&outputFormat=SHAPE-ZIP`;
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', `samples_${className}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
