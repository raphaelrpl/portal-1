import { Component, OnInit, EventEmitter, Output } from '@angular/core';

export interface Language {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  
  @Output() toggleToEmit = new EventEmitter();
  
  public languages: Language[]
  public languageId: string
  
  ngOnInit() {
    this.languages = [
      {id: "pt", title: "PT-BR", icon: "/assets/images/icons/brazil.jpg"},
      {id: "en", title: "EN", icon: "/assets/images/icons/usa.png"}
    ]

    this.languageId = "pt"
  }

  toggleDrawer() {
    this.toggleToEmit.emit()
  }
  
}
