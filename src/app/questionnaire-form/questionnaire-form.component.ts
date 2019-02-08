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
        'reponse': '',
        'details': 'Aucun'
      },
      satisfactionFormation: {
        'question': 'A l\'issu de ce stage, êtes-vous ?',
        'reponse': '',
        'details': 'Aucun'
      },
      approfondissementFormation: {
        'question': 'Cette formation mérite-elle des approfondissements ?',
        'reponse': '',
        'details': ''
      },
      dureeFormation: {
        'question': 'Que pensez-vous de la durée de la formation ?',
        'reponse': '',
        'details': 'Aucun'
      },
      ecouteFormation: {
        'question': 'Comment jugez-vous la capacité du formateur à répondre clairement à vos interrogations ?',
        'reponse': '',
        'details': 'Aucun'
      },
      competencesFormation: {
        'question': 'Comment évaluez-vous les compétences démontrées par le formateur ?',
        'reponse': '',
        'details': 'Aucun'
      },
      phasesFormation: {
        'question': 'Que pensez-vous de l\'articulation entre les phases de pratique et de théorie ?',
        'reponse': '',
        'details': 'Aucun'
      },
      environnementFormation: {
        'question': 'Que pouvez-vous dire sur l\'environnement du stage (locaux, installation du lieu, ...)',
        'reponse': '',
        'details': 'Aucun'
      },
      outilsFormation: {
        'question': 'La qualité des outils pédagogiques mis à disposition vous semble-t-elle efficace ?',
        'reponse': '',
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

    this.postEleve = this.http.post('http://localhost:3000/api/eleves', {
      "nom": this.nomEleve,
      "prenom": this.prenomEleve,
      "email": this.mailEleve,
    }).subscribe(
      res => {

        this.idEleve = res.id;

        //Tableaux contenant les différentes questions, réponses et détails
        var questionsRadio = [], questionsArea = [];
        var reponsesRadio = [], reponsesArea = [];
        var detailsRadio = [];

        //REMPLISSAGE DES TABLEAUX DE PROPRIETES DES CHAMPS RADIO
        for (const champ in this.questionsReponsesRadio) {
          const champObjet = this.questionsReponsesRadio[champ];
          //console.log(champObjet.question);

          questionsRadio.push(champObjet.question);
          reponsesRadio.push(champObjet.reponse);
          detailsRadio.push(champObjet.details);
        }

        //REQUETES POST DES CHAMPS RADIO
        for (var i = 0; i < questionsRadio.length; i++) { //Pour chaque champ radio
          this.postQuestionReponse = this.http.post('http://localhost:3000/api/questions_reponses', {
            "question": questionsRadio[i],
            "reponse": reponsesRadio[i],
            "details": detailsRadio[i],
            "id_eleve": this.idEleve
          }) .subscribe(
            resultat => {
              console.log(resultat);
            },
            erreur => {
              console.log("La requête n'a pas fonctionné.");
            }
          )
        }

        //REMPLISSAGE DES TABLEAUX DE PROPRIETES DES CHAMPS TEXTAREA
        for (const champ in this.questionsReponsesTextarea) {
          const champObjet = this.questionsReponsesTextarea[champ];
          //console.log(champObjet.question);

          questionsArea.push(champObjet.question);
          reponsesArea.push(champObjet.reponse);
        }

        //REQUETES POST DES CHAMPS TEXTAREA
        for (var i = 0; i < questionsArea.length; i++) {
          this.postQuestionReponse = this.http.post('http://localhost:3000/api/questions_reponses', {
            "question": questionsArea[i],
            "reponse": reponsesArea[i],
            "id_eleve": this.idEleve
          }) .subscribe(
            resultat => {
              console.log(resultat);
            },
            erreur => {
              console.log("La requête n'a pas fonctionné.");
            }
          )
        }
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


