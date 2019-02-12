import {Component, Input, OnInit} from '@angular/core';
import {Form, FormGroup, FormsModule, NgForm} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {url} from 'inspector';

@Component({
  selector: 'app-questionnaire-form',
  templateUrl: './questionnaire-form.component.html',
  styleUrls: ['./questionnaire-form.component.css'],
})
export class QuestionnaireFormComponent implements OnInit {

  nomEleve: string;
  prenomEleve: string;
  mailEleve: string;

  nomFormateur: string;
  prenomFormateur: string;

  nomFormation: string;

  //Champs contenant les différents choix possibles pour les radios du formulaire
  radioRaisonFormation = [];
  radioDureeFormation = [];
  radioPhasesFormation = [];
  radioSatisfactionFormation = [];
  radioApprofondissementsFormation = [];
  radioOutilsFormation = [];

  //Objets contenant les questions/réponses(+ détail) de chaque champ du formulaire
  questionsReponsesRadio: any = {};
  questionsReponsesTextarea: any = {};
  formulaireEnvove: boolean;

  //HTTP Requests
  postEleve: any;
  postFormateur: any;
  postFormation: any;
  postQuestionReponse: any;
  postFormulaire: any;

  //ID des instances traitées (pour les PUT du formulaire)
  idEleve: any;
  idFormateur: any;
  idFormation: any;
  idFormulaire: any;

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
        'reponse': '',
        'details': 'Null'
      },
      objectifsFormation: {
        'question': 'Selon vous, les objectifs de la formation ont-ils été clairement formulés au début de la formation ?',
        'reponse': '',
        'details': 'Null'
      },
      utileFormation: {
        'question': 'Qu\'est-ce qui vous a paru le plus utile pendant cette formation?',
        'reponse': '',
        'details': 'Null'
      },
      nonInteretFormation: {
        'question': 'Quels points n’ont pas retenu votre intérêt ?',
        'reponse': '',
        'details': 'Null'
      },
      changementsFormation: {
        'question': 'Quels changements pouvons nous faire pour permettre d’améliorer ou de rendre plus\n' +
          'agréable cette formation ?',
        'reponse': '',
        'details': 'Null'
      },
      recommandationFormation: {
        'question': 'Recommanderiez-vous cette formation à un collègue ?',
        'reponse': '',
        'details': 'Null'
      }
    };
  }

  onSubmit(form: NgForm) {
    // Reset de tous les champs du formulaire
    this.formulaireEnvove = true;

    form.form.reset();
    window.scrollTo(0, 0);
  }

  //Stockage des valeurs dans les objets de questions / réponses
  storeValueRadio(event: any, object: any, property: string) {
    object[property] = event.target.value;
  }

  requestsStarter() {
    console.log("-- Formulaire envoyé. --");

    console.log("..Debut de la requête this.postEleve..");
    this.http.post('http://localhost:3000/api/eleves', {
      "nom": this.nomEleve,
      "prenom": this.prenomEleve,
      "email": this.mailEleve
    }).subscribe(
      res => {

        console.log(res);
        console.warn("-- Requête this.postEleve réussi. --")
        console.log("-- Retour de la requête this.postEleve --");

        //Récupère l'id de l'élève traité pour poster dans la clé étrangère
        //de la table questions_reponses l'id de l'élève concerné
        if (res.id != null) {
          this.idEleve = res.id;
        }

        //Tableaux contenant les différentes questions, réponses et détails
        var questionsRadio = [], questionsArea = [];
        var reponsesRadio = [], reponsesArea = [];
        var detailsRadio = [];

        //REMPLISSAGE DES TABLEAUX DE PROPRIETES DES CHAMPS RADIO
        for (var champ in this.questionsReponsesRadio) {
          var champObjet = this.questionsReponsesRadio[champ];
          //console.log(champObjet.question);

          questionsRadio.push(champObjet['question']);
          reponsesRadio.push(champObjet['reponse']);
          detailsRadio.push(champObjet['details']);
        }

        console.warn("-- Début de la boucle de requête POST des Radio --");
        //REQUETES POST DES CHAMPS RADIO
        for (var i = 0; i < questionsRadio.length; i++) { //Pour chaque champ radio
          this.http.post('http://localhost:3000/api/question_reponses', {
            "question": questionsRadio[i],
            "reponse": reponsesRadio[i],
            "details": detailsRadio[i],
            "id_eleve": this.idEleve
          }).subscribe(
            resultat => {
              console.log(resultat);
            },
            erreur => {
              console.log("Une des requêtes des radio n'a pas fonctionné.");
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

        console.warn("-- Début de la boucle de requête POST des textareas --");
        //REQUETES POST DES CHAMPS TEXTAREA
        for (var i = 0; i < questionsArea.length; i++) {
          this.http.post('http://localhost:3000/api/question_reponses', {
            "question": questionsArea[i],
            "reponse": reponsesArea[i],
            "id_eleve": this.idEleve
          }).subscribe(
            resultat => {
              console.log(resultat);
            },
            erreur => {
              console.log("Une des requêtes textarea n'a pas fonctionné.");
            }
          )
        }

        //REQUETE POST FORMULAIRE (Première)
        this.http.post('http://localhost:3000/api/formulaires', {
          "date_completion": this.todayDate(),
          "id_eleve": this.idEleve
        }).subscribe(
          result => {

            if (result.id != null) {
              this.idFormulaire = result.id;
            }
            console.warn("Requête POST Formulaire réussie" + result);
          },
          error => {
            console.log("Requête POST Formulaire ratée" + error);
          }
        )

        this.requestFormateur();
        this.requestFormation();

      },
      err => {
        console.error("La requête nom prénom mail id n'a pas pu être réalisée.");
        console.log(err);
      }
    );
  }

    requestFormateur() {
      this.http.post('http://localhost:3000/api/formateurs', {
        "nom": this.nomFormateur,
        "prenom": this.prenomFormateur
      }) .subscribe(
        res => {

          if (res.id != null) {
            this.idFormateur = res.id;
          }

          console.log(res);

        },
        err => {
          console.log("La requête formateur n'a pas pu être réalisée.");
        }
      );
    }

    requestFormation() {
      this.http.post('http://localhost:3000/api/formations', {
        "intitule": this.nomFormation,
      }) .subscribe(
        res => {
          console.log(res);

          if (res.id != null) {
            this.idFormation = res.id;
          }

        },
        err => {
          console.log("La requête formation n'a pas pu être réalisée.");
        }
      );
    }

  //Retourne la date du jour.
  todayDate() {
    var today: any = new Date();
    var jj: any = today.getDate();
    var mm: any = today.getMonth()+1; //+1 car Janvier = 0 avec .getMonth()
    var aaaa: any = today.getFullYear();

    //Jour et Mois sous la forme "0x" si jour/mois < 10
    if(jj<10)
      jj = '0'+jj;
    if(mm<10)
      mm = '0'+mm;

    today = aaaa + '-' + mm + '-' + jj; //AAAA-MM-JJ
    return today;
  }
}


