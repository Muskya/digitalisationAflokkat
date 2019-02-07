import {Component, Input, OnInit} from '@angular/core';
import {Form, FormGroup, FormsModule, NgForm} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {type} from 'os';

@Component({
  selector: 'app-questionnaire-form',
  templateUrl: './questionnaire-form.component.html',
  styleUrls: ['./questionnaire-form.component.css'],
})
export class QuestionnaireFormComponent implements OnInit {

/*  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };*/

  nomEleve: string
  prenomEleve: string;
  mailEleve: string;

  nomFormateur: string;
  prenomFormateur: string;

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

  //Objets contenant les questions/réponses(+ détail) de chaque champ du formulaire
  questionsReponsesRadio = {};
  questionsReponsesTextarea = {};

  formulaireEnvove: boolean;

  //HTTP Requests
  postEleve: any;
  postFormateur: any;
  postFormation: any;
  postQuestionReponse: any;
  idEleve: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.formulaireEnvove = false;

    // region Radio Questions
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
    // endregion

    // region Objet questionsReponsesRadio
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
    // endregion

    this.questionsReponsesTextarea = {
      insatisfactionFormation: {
        'question': 'En cas d’insatisfaction, pourquoi cette formation n’a pas répondue à vos besoins ?',
        'reponse': ''
      },
      objectifsFormation: {
        'question': 'Selon vous, les objectifs de la formation ont-ils été clairement formulés au début de la formation ?',
        'reponse': ''
      },
      utileFormation: {
        'question': 'Qu\'est-ce qui vous a paru le plus utile pendant cette formation?',
        'reponse': ''
      },
      nonInteretFormation: {
        'question': 'Quels points n’ont pas retenu votre intérêt ?',
        'reponse': ''
      },
      changementsFormation: {
        'question': 'Quels changements pouvons nous faire pour permettre d’améliorer ou de rendre plus\n' +
          'agréable cette formation ?',
        'reponse': ''
      },
      recommandationFormation: {
        'question': 'Recommanderiez-vous cette formation à un collègue ?',
        'reponse': ''
      }

    };
  }

  // S'occupe de reset le formulaire, de faire les éventuelles dernières vérifications restantes, et ... ?
  onSubmit(form: NgForm) {
    // Reset de tous les champs du formulaire
    this.formulaireEnvove = true;

    //POST DU NOM, PRENOM, MAIL
    this.postEleve = this.http.post('http://localhost:3000/api/eleves', {
      "nom": this.nomEleve,
      "prenom": this.prenomEleve,
      "email": this.mailEleve,
    }).subscribe(
      res => {
        this.idEleve = res.id;

        //BOUCLE A FAIRE POUR CHAQUE RADIO DU FORMULAIRE + BOUCLE POUR LES TEXTAREA
        this.postQuestionReponse = this.http.post('http://localhost:3000/api/questions_reponses', {
          "question": this.questionsReponsesRadio.satisfactionFormation['question'],
          "reponse": this.questionsReponsesRadio.satisfactionFormation['reponse'],
          "id_eleve": this.idEleve
        }) .subscribe(
          resul => {
            console.log(resul);
          },
          err => {
            console.log("La requête formation n'a pas pu être réalisée.");
          }
        );

      },
      err => {
        console.log("La requête nom prénom mail id n'a pas pu être réalisée.", err);
      }
    );

    this.postFormateur = this.http.post('http://localhost:3000/api/formateurs', {
      "nom": this.nomFormateur,
      "prenom": this.prenomFormateur
    }) .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("La requête formateur n'a pas pu être réalisée.");
      }
    );

    this.postFormation = this.http.post('http://localhost:3000/api/formations', {
      "intitule": this.nomFormation,
    }) .subscribe(
        res => {
          console.log(res);
        },
      err => {
          console.log("La requête formation n'a pas pu être réalisée.");
      }
    );
  }

  //Stockage des valeurs dans les objets de questions / réponses
  storeValueRadio(event: any, object: any, property: string) {
    object[property] = event.target.value;
  }
}


