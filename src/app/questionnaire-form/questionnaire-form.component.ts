import {Component, Input, OnInit} from '@angular/core';
import {Form, FormGroup, FormsModule, NgForm} from '@angular/forms';

@Component({
  selector: 'app-questionnaire-form',
  templateUrl: './questionnaire-form.component.html',
  styleUrls: ['./questionnaire-form.component.css'],
})
export class QuestionnaireFormComponent implements OnInit {

  nomEleve: string
  prenomEleve: string;
  mailEleve: string;

  nomFormateur: string;
  nomFormation: string;

  raisonSuiviRadio: string;

  formulaireEnvove: boolean;

  constructor() { }

  ngOnInit() {
    this.formulaireEnvove = false;
  }

  diagnostic() {
    return this.nomEleve + ' ' + this.prenomEleve + ' ' + this.mailEleve + ' ' + this.nomFormateur + ' ' + this.nomFormation;
  }

  // S'occupe de reset le formulaire, de faire les éventuelles dernières vérifications restantes, et ... ?
  onSubmit(form: NgForm) {
    // Reset de tous les champs du formulaire
    this.formulaireEnvove = true;

    form.reset();
    //Autre chose ... ?
  }

  storeValue(valeur) {
    console.log('Méthode appelée.');
    this.raisonSuiviRadio = valeur;
  }

}
