import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Service to get infos and features of catalog
 */
@Injectable({ providedIn: 'root' })
export class SamplesService {
  private API_URL: string = window['__env'].urlSampleDBBackend;

  constructor(
    private http: HttpClient
  ) {}

  public upload(mappings: any, classification_system: any, file: any) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('mappings', JSON.stringify(mappings));
    formData.append('classification_system', classification_system);

    return this.http.post(`${this.API_URL}/api/sample/`, formData).toPromise();
  }

  public getClassificationSystems(): Promise<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/api/sample/classification_system`).toPromise();
  }

  public addClassificationSystem(data: any): Promise<any> {
    const url = `${this.API_URL}/api/sample/classification_system`;

    return this.http.post(url, data).toPromise();
  }
}
