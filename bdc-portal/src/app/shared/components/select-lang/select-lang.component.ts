import { Component, OnInit } from '@angular/core';
import { Language } from './language.interface';

/**
 * Select Language
 * component to select language of the application
 * * options: EN, PT-BR
 */
@Component({
  selector: 'app-select-lang',
  templateUrl: './select-lang.component.html',
  styleUrls: ['./select-lang.component.scss']
})
export class SelectLangComponent implements OnInit {

  /** List of Languages */
  public languages: Language[];
  /** Language selected */
  public languageId: string;

  /**
   * Define language possibilities in this component
   */
  ngOnInit() {
    this.languages = [
      {id: 'pt', icon: '/assets/images/icons/br.svg'},
      {id: 'en', icon: '/assets/images/icons/usa.svg'}
    ];
    this.languageId = 'en';
  }

}
