import { Component, OnInit } from '@angular/core';
import { Language } from './language.interface';

@Component({
  selector: 'app-select-lang',
  templateUrl: './selectLang.component.html',
  styleUrls: ['./selectLang.component.scss']
})
export class SelectLangComponent implements OnInit {

  public languages: Language[];
  public languageId: string;

  ngOnInit() {
    this.languages = [
      {id: 'pt', title: 'PT-BR', icon: '/assets/images/icons/brazil.jpg'},
      {id: 'en', title: 'EN', icon: '/assets/images/icons/usa.png'}
    ];

    this.languageId = 'pt';
  }

}
