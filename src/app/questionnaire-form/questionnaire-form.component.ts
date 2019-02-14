import {Component, Input, OnInit} from '@angular/core';
import {Form, FormGroup, FormsModule, NgForm} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CronJob, CronTime, CronJobParameters} from 'cron';

import * as nodemailer from 'nodemailer'

@Component({
  selector: 'app-questionnaire-form',
  templateUrl: './questionnaire-form.component.html',
  styleUrls: ['./questionnaire-form.component.css'],
})

export class QuestionnaireFormComponent implements OnInit {
  //Premiers inputs du formulaires
  nomEleve: string;
  prenomEleve: string;
  mailEleve: string;
  nomFormateur: string;
  prenomFormateur: string;
  nomFormation: string;

  //Propriétés du CronJob pour l'envoi du mail
  moisCron: any;
  dateCron: any;
  cronEnvoi: any;

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

  //ID des instances traitées (pour les PUT du formulaire)
  idEleve: any;
  idFormateur: any;
  idFormation: any;
  idFormulaire: any;

  //Propriétés mail
  transport: any;

  //Autres
  formulaireEnvove: boolean;

  //Service HttpClient injecté
  constructor(private http: HttpClient) { }

  //Initialisation des propriétés / objets
  ngOnInit() {
    this.formulaireEnvove = false;

    this.transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "theoporticcio@gmail.com",
          pass: "biloute50",
        }
    });



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

    //Appel des requêtes
    this.requestsStarter();

    //Réinitialise le formulaire et remonte en haut de la page
    form.form.reset();
    window.scrollTo(0, 0);
  }

  //Stockage des valeurs dans les objets de questions / réponses
  storeValueRadio(event: any, object: any, property: string) {
    object[property] = event.target.value;
  }

  //Démarre les différentes requêtes HTTP
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
        //Evite les erreurs de compilation
        if (res.hasOwnProperty("id")) {
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

            //Evite les erreurs de compilation
            if (result.hasOwnProperty("id")) {
              this.idFormulaire = result.id;
            }
            console.warn("Requête POST Formulaire réussie" + result);
          },
          error => {
            console.log("Requête POST Formulaire ratée" + error);
          }
        )

        //Appel des autres requêtes dans le retour du Post formulaire
        //Aucune raison particulière
        this.requestFormateur();
        this.requestFormation();

      },
      err => {
        console.error("La requête nom prénom mail id n'a pas pu être réalisée.");
        console.log(err);
      }
    );
  }

    //REQUETE POST INFOS DU PROFESSEUR
    requestFormateur() {
      this.http.post('http://localhost:3000/api/formateurs', {
        "nom": this.nomFormateur,
        "prenom": this.prenomFormateur
      }) .subscribe(
        res => {

          //Evite les erreurs de compilation
          if (res.hasOwnProperty("id")) {
            this.idFormateur = res.id;
          }
          console.log(res);
        },
        err => {
          console.log("La requête formateur n'a pas pu être réalisée.");
        }
      );
    }

    //REQUETE POST LES INFOS DE LA FORMATION
    requestFormation() {
      this.http.post('http://localhost:3000/api/formations', {
        "intitule": this.nomFormation,
      }) .subscribe(
        res => {
          console.log(res);

          //Evite les erreurs de compilation
          if (res.hasOwnProperty("id")) {
            this.idFormation = res.id;
          }
        },
        err => {
          console.log("La requête formation n'a pas pu être réalisée.");
        }
      )
    }

  //Retourne la date du jour pour la date de complétion du formulaire
  //Création du CronJob à partir de la date de complétion du form + 3 mois
  //+ envoi du mail.
  todayDate() {
    var today: any = new Date();
    var jj: any = today.getDate();
    var mm: any = today.getMonth()+1; //+1 car Janvier = 0 avec .getMonth()
    var aaaa: any = today.getFullYear();

    //+1 car Janvier = 0 et + 3 car 3 mois plus tard. +4
    this.moisCron = today.getMonth()+4
    //3 mois suivant la date de complétion du formulaire à 12h00.
    this.dateCron = "00 00 12 " + this.moisCron.toString() + " * *";

    //CronJob envoyant le mail 3 mois plus tard.
    this.cronEnvoi = new CronJob(this.dateCron, function () {
      console.log("Message");
      //envoi du mail
    }, null, true, 'Europe/Paris');

    //Jour et Mois sous la forme "0x" si jour/mois < 10
    if(jj<10)
      jj = '0'+jj;
    if(mm<10)
      mm = '0'+mm;

    //Mise en forme de la date du jour (requis pour le format "date" de MySQL)
    today = aaaa + '-' + mm + '-' + jj; //AAAA-MM-JJ

    return today;
  }
}


