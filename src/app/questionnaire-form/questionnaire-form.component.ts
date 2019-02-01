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


  radioRaisonFormation = [];
  radioDureeFormation = [];
  radioPhasesFormation = [];
  radioSatisfactionFormation = [];

  reponsesRadio = {};
  questionsRadio = {};

  questionsTextarea = [];
  reponsesTextarea = {};

  formulaireEnvove: boolean;

  constructor() { }

  ngOnInit() {
    this.formulaireEnvove = false;
    this.radioSatisfactionFormation = [
      'Très satisfait',
      'Satisfait',
      'Assez satisfait',
      'Insatisfait',
      'Très insatisfait'
      ];
    this.radioRaisonFormation = [
      'Formation prévue par l\'entreprise',
      'Renforcer des compétences dans votre poste',
      'Acquérir de nouvelles compétences',
      'Pour une évolution professionnelle'
    ];
    this.radioDureeFormation = [
      'Trop longue',
      'Correcte',
      'Trop courte'
    ];
    this.radioPhasesFormation = [
      'Trop de pratique',
      'Equilibré',
      'Trop de théorie'
    ];
    this.questionsRadio = {
      'suiviFormation': 'Pour quelle raison avez-vous suivi cette formation ?',
      'satisfactionFormation': 'A l\'issu de ce stage, êtes-vous ?',
      'approfondissementFormation': 'Cette formation mérite-elle des approfondissements ?',
      'dureeFormation': 'Que pensez-vous de la durée de la formation ?',
      'ecouteFormation': 'Comment jugez-vous la capacité du formateur à répondre clairement à vos interrogations ?',
      'competencesFormation': 'Comment évaluez-vous les compétences démontrées par le formateur ?',
      'phasesFormation': 'Que pensez-vous de l’articulation entre les phases de pratique et de théorie ?',
      'environnementFormation': 'Que pouvez-vous dire sur l’environnement du stage ( locaux, installation du lieu, ... )',
      'outilsFormation': 'La qualité des outils pédagogiques à disposition vous semble t- elle efficace ?'
    };
  }

  diagnostic() {
    return this.nomEleve + ' ' + this.prenomEleve + ' ' + this.mailEleve + ' ' + this.nomFormateur + ' ' + this.nomFormation;
  }

  // S'occupe de reset le formulaire, de faire les éventuelles dernières vérifications restantes, et ... ?
  onSubmit(form: NgForm) {
    // Reset de tous les champs du formulaire
    this.formulaireEnvove = true;

    form.reset();
  }

  //Enregistre la valeur choisie sur le radiobutton dans l'objet reponsesRadio
  //avec comme une clé identificatrice.
  storeValue(event: any, key: string) {
    this.reponsesRadio[key] = event.target.value;
  }

}
