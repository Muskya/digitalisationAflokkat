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

  //Objet contenant la réponse (Oui/Non) + Détails si il y a des radios
  //spéciaux du formulaire.
  approfondissementsRadio = {};
  outilsRadio = {};

  //Champs contenant les différents choix possibles pour les radios du formulaire
  radioRaisonFormation = [];
  radioDureeFormation = [];
  radioPhasesFormation = [];
  radioSatisfactionFormation = [];
  radioApprofondissementsFormation = [];
  radioOutilsFormation = [];

  //Questions + Réponses des radios du formulaire
  reponsesRadio = {};
  questionsRadio = {};
  questionsReponsesRadio = {};

  //Questions + Réponses des textarea du formulaire
  questionsTextarea = {};
  reponsesTextarea = {};

  formulaireEnvove: boolean;

  constructor() {
  }

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
    this.radioApprofondissementsFormation = [
      'Oui, lesquels ?',
      'Non'
    ];
    this.radioOutilsFormation = [
      'Oui',
      'Non, lesquels ?'
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

    //Coupler les this.questionsRadio et this.reponsesRadio dans cet objet.
    //Faire pareil pour les Textarea.
    this.questionsReponsesRadio = {
      suiviFormation: {
        'question': 'Pour quelle raison avez-vous suivi cette formation ?',
        'reponse': ''
      },
      satisfactionFormation: {
        'question': 'A l\'issu de ce stage, êtes-vous ?',
        'reponse': ''
      },
      approfondissementFormation: {
        'question': 'Cette formation mérite-elle des approfondissements ?',
        'reponse': '',
        'details': ''
      },
      dureeFormation: {
        'question': 'Que pensez-vous de la durée de la formation ?',
        'reponse': ''
      },
      ecouteFormation: {
        'question': 'Comment jugez-vous la capacité du formateur à répondre clairement à vos interrogations ?',
        'reponse': ''
      },
      competencesFormation: {
        'question': 'Comment évaluez-vous les compétences démontrées par le formateur ?',
        'reponse': ''
      },
      phasesFormation: {
        'question': 'Que pensez-vous de l\'articulation entre les phases de pratique et de théorie ?',
        'reponse': ''
      },
      environnementFormation: {
        'question': 'Que pouvez-vous dire sur l\'environnement du stage (locaux, installation du lieu, ...)',
        'reponse': ''
      },
      outilsFormation: {
        'question': 'La qualité des outils pédagogiques mis à disposition vous semble-t-elle efficace ?',
        'details': ''
      },
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

  storeValueRadio(event: any, object: any, property: string) {
    object[property] = event.target.value;
  }

  storeValueArea(event: any, key: string) {
    this.reponsesTextarea[key] = event.value;
  }
}


