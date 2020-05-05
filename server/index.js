const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let studentsRawData = [
  {
    firstName: 'Abdelmamajid',
    lastName: 'AHAMIANE',
    githubAccountUrl: 'https://github.com/abdelWildLyon',
    p1bisRepoUrl: 'https://github.com/abdelWildLyon/abdelWildLyon-Projet--1',
    p1bisPresented: true
  },
  {
    firstName: 'Abdel-rahim',
    lastName: 'Akroh',
    githubAccountUrl: 'https://github.com/abdel74100',
    p1bisRepoUrl: 'https://github.com/abdel74100/retro-inviders/tree/master',
    p1bisPresented: true
  },
  {
    firstName: 'Ikram',
    lastName: 'Beldjilali',
    githubAccountUrl: 'https://github.com/ikramb-ctrl',
    p1bisRepoUrl: 'https://github.com/ikramb-ctrl/lyon-0320-todo-lyon',
    p1bisPresented: false
  },
  {
    firstName: 'Vianney',
    lastName: 'Bouault',
    githubAccountUrl: 'https://github.com/vbouault',
    p1bisRepoUrl: 'https://github.com/vbouault/0320-Agence-Got-Vianney',
    p1bisPresented: true
  },
  {
    firstName: 'Camille',
    lastName: 'Bueno',
    githubAccountUrl: 'https://github.com/Sora952',
    p1bisRepoUrl: 'https://github.com/Sora952/lyon-0320-todo-lyon',
    p1bisPresented: true
  },
  {
    firstName: 'Amélie',
    lastName: 'Chevalier',
    githubAccountUrl: 'https://github.com/AmelieChevalier',
    p1bisRepoUrl: 'https://github.com/AmelieChevalier/lyon-0320-escalagones',
    p1bisPresented: true
  },
  {
    firstName: 'Baptiste',
    lastName: 'Courgibet',
    githubAccountUrl: 'https://github.com/Astarosa',
    p1bisRepoUrl: 'https://github.com/Astarosa/lyon-0320-how-to-learn-to-code.git',
    p1bisPresented: true
  },
  {
    firstName: 'Geoffroy',
    lastName: 'Crabières',
    githubAccountUrl: 'https://github.com/Gottfrieden',
    p1bisRepoUrl: 'https://github.com/Gottfrieden/lyon-0320-golden-retro',
    p1bisPresented: true
  },
  {
    firstName: 'Christophe',
    lastName: 'Crébier',
    githubAccountUrl: 'https://github.com/Rincevent42',
    p1bisRepoUrl: 'https://github.com/Rincevent42/lyon-0320-voyager',
    p1bisPresented: true
  },
  {
    firstName: 'Nathan',
    lastName: 'Guillaumin',
    githubAccountUrl: 'https://github.com/nathanguillaumin',
    p1bisRepoUrl: 'https://github.com/nathanguillaumin/ToDoLyon',
    p1bisPresented: true
  },
  {
    firstName: 'Florent',
    lastName: 'Houdeillé',
    githubAccountUrl: 'https://github.com/florenthoudeille',
    p1bisRepoUrl: 'https://github.com/florenthoudeille/lyon-0320-todo-lyon',
    p1bisPresented: true
  },
  {
    firstName: 'Anaïs',
    lastName: 'Huoch Gagneur',
    githubAccountUrl: 'https://github.com/AnaH-1907',
    p1bisRepoUrl: 'https://github.com/AnaH-1907/lyon-0320-todo-lyon',
    p1bisPresented: true
  },
  {
    firstName: 'Pascal',
    lastName: 'Pereira',
    githubAccountUrl: 'https://github.com/Pascal-Pereira',
    p1bisRepoUrl: 'https://github.com/Pascal-Pereira/lyon-0320-escalagones.git',
    p1bisPresented: false
  },
  {
    firstName: 'Hugo',
    lastName: 'Pioda',
    githubAccountUrl: 'https://github.com/K0Si-003',
    p1bisRepoUrl: 'https://github.com/K0Si-003/lyon-0320-how-to-learn-to-code',
    p1bisPresented: false
  },
  {
    firstName: 'Armin',
    lastName: 'Saad',
    githubAccountUrl: 'https://github.com/wdwcs',
    p1bisRepoUrl: 'https://github.com/wdwcs/lyon-0320-how-to-learn-to-code',
    p1bisPresented: false
  },
  {
    firstName: 'Adama',
    lastName: 'SONKO',
    githubAccountUrl: 'https://github.com/adadofr',
    p1bisRepoUrl: 'https://github.com/adadofr/lyon-0320-escalagones',
    p1bisPresented: false
  },
  {
    firstName: 'Mickaël',
    lastName: 'Thely',
    githubAccountUrl: 'https://github.com/tmicka23',
    p1bisRepoUrl: 'https://github.com/tmicka23/lyon-0320-voyager-1',
    p1bisPresented: true
  },
  {
    firstName: 'Lancelot',
    lastName: 'Trapet',
    githubAccountUrl: 'https://github.com/lancelottrapet',
    p1bisRepoUrl: 'https://github.com/lancelottrapet/lyon-0320-agence-got.git',
    p1bisPresented: false
  },
  {
    firstName: 'Riri',
    lastName: 'Zamor',
    githubAccountUrl: 'https://github.com/riri6969',
    p1bisRepoUrl: 'https://github.com/riri6969/lyon-0320-how-to-learn-to-code',
    p1bisPresented: false
  }
];

app.use(cors());
app.use(bodyParser.json());

app.get('/students', (req, res) => {
  setTimeout(() => {
    res.json(studentsRawData);
    // res.sendStatus(500);
  }, 2000);
});

app.get('/students/:githubAccountName', (req, res) => {
  setTimeout(() => {
    const githubAccountUrl = 'https://github.com/' + req.params.githubAccountName;
    const existingStudent = _.find(studentsRawData, { githubAccountUrl });
    if (existingStudent) {
      res.json(existingStudent);
    } else {
      res.sendStatus(404);
    }
  }, 500);
});

app.delete('/students/:githubAccountName', (req, res) => {
  setTimeout(() => {
    const githubAccountUrl = 'https://github.com/' + req.params.githubAccountName;
    const existingStudent = _.find(studentsRawData, { githubAccountUrl });

    if (existingStudent) {
      studentsRawData = studentsRawData.filter(s => s.githubAccountUrl !== githubAccountUrl);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }, 500);
});

app.post('/students', (req, res) => {
  setTimeout(() => {
    const newStudentAttributes = req.body;
    const existingStudent = _.find(studentsRawData, { githubAccountUrl: newStudentAttributes.githubAccountUrl });

    if (existingStudent) {
      res.status(400);
      return res.json({ error: `Un étudiant avec l'URL Github "${newStudentAttributes.githubAccountUrl}" existe déjà sur le serveur !` });
    }

    studentsRawData.push({ ...newStudentAttributes, p1bisPresented: false, p1bisRepoUrl: newStudentAttributes.githubAccountUrl });
    res.json(newStudentAttributes);
  }, 2000);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
