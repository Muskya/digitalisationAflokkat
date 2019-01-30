import {Component, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-questionnaire-form',
  templateUrl: './questionnaire-form.component.html',
  styleUrls: ['./questionnaire-form.component.css'],
})
export class QuestionnaireFormComponent implements OnInit {

  nom: string
  prenom: string;
  mail: string;

  values = '';

  test = 'bonjour';

  constructor() { }

  ngOnInit() {

  }

  onKeyup(event: any) {
    this.values += event.target.value + ' | ';
  }
}
