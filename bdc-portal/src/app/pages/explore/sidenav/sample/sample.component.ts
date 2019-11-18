import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Feature } from 'geojson';
import { tileLayer } from 'leaflet';
import { setLayers, removeGroupLayer } from '../../explore.action';
import { formatDateUSA } from 'src/app/shared/helpers/date';

/**
 * Samples component
 * component to display and filter samples available
 */
@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent {

  /** samples */
  public samples: Feature[];
  /** range temporal selected */
  public rangeTemporal: string[];
  /** list with name classes */
  public classesList: string[];
  /** authors finded in search */
  public authorsList: string[];
  /** bounding box of search */
  public bbox: string;
  /** list with status by classes (enable or disabled) */
  public classesStatus = {};
  /** list with colors by classes */
  public classesColors = {};
  /** list with authors selected in input select (this component) */
  public authors: string[] = [];

  private urlGeoserver = window['__env'].urlGeoserver;

  /** initialize services and get search information of the Explore store */
  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      const lastSamples = this.samples || [];
      if (res.samples) {
        this.classesList = [];
        this.authorsList = [];
        this.samples = Object.values(res.samples).slice(0, (Object.values(res.samples).length - 1)) as Feature[];

        // clear samples of the map
        if (lastSamples.length && lastSamples.length !== this.samples.length) {
          this.removeSamplesSearch();
        }
        this.filtered();

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

  /** filter classes by authors */
  public filtered() {
    this.classesList = [];
    this.samples.forEach( (sample: Feature) => {
      const authorName = sample.properties['system_name'];
      const className = sample.properties['class_name'];

      // mount list with authors
      if (this.authorsList.indexOf(sample.properties['system_name']) < 0) {
        this.authorsList.push(sample.properties['system_name']);
      }

      // mount classes by author
      if (this.authors.indexOf(authorName) >= 0) {
        if (this.classesList.indexOf(className) < 0) {
          this.classesList.push(className);
          this.classesStatus[className] = false;
          this.classesColors[className] = this.classesColors[className] || '#FF0000';
        }
      }
    });
  }

  /** clean samples */
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

  /** enable and display samples by class in the map */
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
      queryCQL += ` AND (start_date AFTER ${this.rangeTemporal[0]} AND end_date BEFORE ${this.rangeTemporal[1]})`;
      // filter bbox
      queryCQL += ` AND BBOX(location,${this.bbox})`;
      const layer = tileLayer.wms(`${this.urlGeoserver}/samples/wms`, {
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

  /** redirect to download samples */
  public DownloadSamplesByClass(className) {
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
    queryCQL += ` AND (start_date AFTER ${this.rangeTemporal[0]} AND end_date BEFORE ${this.rangeTemporal[1]})`;
    // filter bbox
    queryCQL += ` AND BBOX(location,${this.bbox})`;

    // download file
    let url = `${this.urlGeoserver}/samples/ows?service=WFS&version=1.0.0&CQL_FILTER=${queryCQL}`;
    url += `&request=GetFeature&typeName=samples:sample&outputFormat=SHAPE-ZIP`;
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', `samples_${className}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
