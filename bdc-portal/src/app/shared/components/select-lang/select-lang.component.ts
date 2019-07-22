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
      {id: 'pt', title: 'PT-BR', icon: '/assets/images/icons/brazil.jpg'},
      {id: 'en', title: 'EN', icon: '/assets/images/icons/usa.png'}
    ];
    this.languageId = 'en';
  }

}
