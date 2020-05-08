# Dojo React API - CRUD

## A propos de ce dojo

Ce dojo est l'occasion parfaite de revoir les bases de React, en se concentrant 
sur la gestion du `state` et la communication avec une API distante. 

L'objectif est de compléter une application gérant une liste de tâches :

![](https://i.imgur.com/CzvmmPX.png)

En l'état, elle permet déjà, en local :
- D'ajouter une tâche à la liste
- De mettre à jour le status de complétion d'une tâche en particulier
- De supprimer une tâche de la liste

Maintenant, on aimerait bien pouvoir sauvegarder 
les tâches que l'on renseigne sur un serveur distant, afin de les *persister* sur
 un support pour les retrouver lorsque 
l'on recharge l'application ! 

Par chance, un serveur Node a déjà été développé (cf: dossier `server` pour les curieux).
Il permet déjà de gérer et persister temporairement (en mémoire vive, pas en BDD) 
la liste de tâches. Il n'y aura donc plus 
qu'à "câbler" le client React avec ce dernier !

Pour cela, le serveur expose une API 
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
(basée sur le protocole 
[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) 
et le format 
[JSON](https://en.wikipedia.org/wiki/JSON)) 
qu'il faudra requêter en lecture et en écriture, à l'aide de 
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) ou 
[axios](https://github.com/axios/axios), pour réaliser les opérations 
[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) sur ces tâches.

## Avant de commencer

Installer et démarrer le serveur :
```sh
cd server && npm i && npm start
```

Dans un terminal séparé, démarrer le client
```
npm i && npm start
```

Ouvrir ce dernier dans un navigateur et explorer un peu l'application d'un point 
de vue fonctionnel.

Rendez-vous dans `App.js`, observer un peu le code existant, on pourra en 
tirer parti lors du développement des nouvelles fonctionnalités.

Par soucis de simplicité, toute l'application tient 
dans le composant App et il n'y aura presque pas à intervenir au niveau 
de la méthode `render`, puisque la partie "affichage" est déjà 
en grande partie développée. 

## Fonctionnalités à développer

Si les fonctionnalités sont plus ou moins indépendantes les unes des autres, 
il est tout de même recommandé de 
les faire dans l'odre qui suit (au moins les critères "MUST"), 
afin de faciliter certains tests. 

### Récupération des tâches sur le serveur (READ <--> GET)

![](https://memeshappen.com/media/created/2016/11/I-just-like-to-read-Reading-is-my-Favorite.jpg)

Une fois le serveur démarré, écrire la méthode `fetchTasks`. 

#### Validation

Action(s) : On se rend sur l'application

Critères :
1. (MUST) La liste des tâches doit être chargée quand on arrive sur l'application.
2. (MUST) Quand la liste est chargée, on doit voir 3 tâches (si aucune tâche n'a été ajoutée).
3. (SHOULD) Quand la liste charge, un indicateur est affiché.
4. (COULD) Si le serveur n'est pas démarré (simulation d'une communication impossible avec l'API), 
un message "Can't load tasks form the server" est affiché après l'échec de la requête.
5. (COULD) Au survol d'une tâche dans la liste, on voit "Created <_x_> <_minutes|seconds|hours_> ago"

#### Indices / Conseils pour le développement

- Il faudra requêter l'URL [http://localhost:5000/tasks](http://localhost:5000/tasks) 
pour charger la liste des tâches. 
Il faudra également gérer les données suivantes dans le `state` : 
  - `loadingTasks` : booléen indiquant si la liste est en cours de chargement. 
C'est ce qui déclenchera l'affichage d'un indicateur de chargement au niveau de la vue.
  - `taskList` : Un tableau devant contenir toutes les tâches sous forme d'objets
- Pour la gestion d'erreur, voir la méthode `showErrorMessage` dans `App`
- Pour le dernier critère, recherchez `fromNow` dans `App`, 
puis recherchez `task relative creation time here` ;)

### Création d'une tâche sur le serveur (CREATE <--> POST)

![](https://img.pngio.com/free-posting-icon-155456-download-posting-icon-155456-posting-png-512_512.jpg)

Réécrire la méthode `createTask` pour synchroniser la tâche créée sur le serveur. 

#### Validation

Action(s) : On tape un nom pour la nouvelle tâche, on appuie sur le bouton "+" (ou on fait Entrée).

Critères :
1. (MUST) Une fois qu'elle a été créee sur le serveur, la nouvelle tâche doit 
être affichée dans la liste sur le client.
2. (MUST) Une fois qu'elle a été créee sur le serveur, 
on peut recharger la page et se rendre compte que la nouvelle tâche est toujours présente.
3. (SHOULD) Quand les données sont en train d'être traitées sur le serveur, 
on voit "Submitting task <_name_>..." s'afficher dans le formulaire de la nouvelle tâche.
4. (SHOULD) Lorsque la tâche a été créée sur le serveur, un message de succès 
"Task <_name_> successfully created on the server !" est affiché
5. (COULD) Si le serveur est n'est pas démarré et qu'on essaie de créer une tâche, 
un message d'erreur "Can't create task "<_name_>" on server" est affiché
6. (COULD) Si on entre un nom de tâche qui existe déjà dans la liste, 
le message d'erreur renvoyé par le serveur est affiché à l'utilisateur.

#### Indices / Conseils pour le développement

- Il faudra requêter l'URL [http://localhost:5000/tasks](http://localhost:5000/tasks), 
cette fois avec le verbe HTTP POST. 
Les attributs de la nouvelle tâche devront être passés au serveur dans le corps de la requête, comme ceci :
![](https://i.imgur.com/rCEN4mM.png) Si nécéssaire, se renseigner sur comment passer des données
dans le corps de la requête avec axios ou fetch en lisant la doc ;)
- La tâche devra être ajoutée dans le tableau de tâches `taskList` présent dans `state` **après** que 
l'API ait répondu avec l'objet "tâche" créé sur le serveur.
- Pour le critère 3, il faudra dans `newTask` gérer une clé `_submitting` dont la valeur sera un booléen indiquant à 
la vue que la création de la tâche est en cours de traitement.
- Pour les derniers critères, voir les méthodes `showSuccessMessage` et `showErrorMessage` de `App`. 
- Pour le critère 6, si l'API renvoie un message d'erreur, on pourra récupérer 
ce dernier dans `error.response.data.errorMessage` 
(si `error` est la variable représentant l'erreur dans le `catch`).

### Mise à jour d'une tâche sur le serveur (UPDATE <--> PATCH/PUT)

![](https://i.redd.it/evlil7rqtvx01.jpg)

Réécrire la méthode `updateTask` pour synchroniser la tâche le serveur suite au cochage/décochage de la checkbox. 

#### Validation

Action(s) : On coche/décoche une checkbox sur une tâche

Critères :
1. (MUST) Une fois qu'elle a été mise à jour sur le serveur, le status de complétion 
est mis à jour sur le client.
2. (MUST) Une fois qu'elle a été mise à jour sur le serveur, 
on peut recharger la page et se rendre compte qu'elle est 
restée dans le dernier état de complétion renseigné.
3. (SHOULD) Quand les données sont en train d'être traitées sur le serveur, 
on voit "Updating task <_name_>..." s'afficher dans à la place du nom de la tâche.
4. (SHOULD) Lorsque la tâche a bien été modifiée sur le serveur, un message de succès 
"Task <_name_> successfully updated on the server !" est affiché
5. (COULD) Si le serveur est n'est pas démarré et qu'on essaie de modifier une tâche, 
un message d'erreur "Can't update this task on server" est affiché
6. (COULD) Si on tente de modifier une tâche qui n'existe plus sur le serveur, 
le message d'erreur renvoyé par le serveur est affiché à l'utilisateur. 
Pour tester facilement : creer une nouvelle tâche, 
redémarrer le serveur et essayer de modifier cette dernière tâche 
(sans avoir rechargé l'application).

#### Indices / Conseils pour le développement

- Il faudra requêter l'URL [http://localhost:5000/tasks/id](http://localhost:5000/tasks/:id), 
avec le verbe HTTP PATCH, où il faudra remplacer `id` par l'identifiant de la tâche à modifier. 
Les nouveaux attributs de la tâche (ceux qui ont possiblement changé, ici `done`) 
devront être passés au serveur dans le corps de la requête.
Si nécéssaire, se renseigner sur comment spécifier le verbe PATCH et passer des données
dans le corps de la requête avec axios ou fetch en lisant la doc ;)
- Pour le critère 3, il faudra gérer une clé `_updating` dont la valeur sera 
un booléen indiquant à l'interface si la tâche en question est en cours de synchronisation.
Cette clé devra être présente dans l'objet "tâche" en cours de mise à jour, cet objet 
est contenu dans le tableau `taskList` du `state`.
- Pour le critère 6, si l'API renvoie un message d'erreur, on pourra récupérer 
ce dernier dans `error.response.data.errorMessage` 
(si `error` est la variable représentant l'erreur dans le `catch`).

### Suppresion d'une tâche sur le serveur (DELETE/DESTROY <--> DELETE)

![](https://www.theseoproject.org/wp-content/uploads/2016/08/delete-sp-meme.png)

Réécrire la méthode `updateTask` pour synchroniser la tâche le serveur suite au cochage/décochage de la checkbox. 

#### Validation

Action(s) : On clique sur le bouton "mettre à la poubelle" au niveau d'une tâche

Critères :
1. (MUST) Une fois qu'elle a supprimée sur le serveur, elle est retirée de la liste 
sur le client.
2. (MUST) Une fois qu'elle a été supprimée sur le serveur, 
on peut recharger la page et ne pas la voir réapparaître.
3. (SHOULD) Quand la suppression est en cours sur le serveur, 
on voit "Deleting task <_name_>..." s'afficher dans à la place du nom de la tâche.
4. (SHOULD) Lorsque la tâche a été supprimée sur le serveur, un message de succès 
"Task <_name_> successfully deleted on the server !" est affiché
5. (COULD) Si le serveur est n'est pas démarré et qu'on essaie de supprimer une tâche, 
un message d'erreur "Can't delete this task on server" est affiché
6. (COULD) Si on tente de supprimer une tâche qui n'existe plus sur le serveur, 
le message d'erreur renvoyé par le serveur est affiché à l'utilisateur. 
Pour tester facilement : creer une nouvelle tâche, 
redémarrer le serveur et essayer de supprimer cette dernière
(sans avoir rechargé l'application).

#### Indices / Conseils pour le développement

- Il faudra requêter l'URL `http://localhost:5000/tasks/:id`, 
avec le verbe HTTP DELETE, où il faudra remplacer `:id` par l'identifiant de la tâche à modifier. 
Si nécéssaire, se renseigner sur comment spécifier le verbe DELETE avec axios ou fetch en lisant la doc ;)
- Pour le critère 3, il faudra gérer une clé `_deleting` dont la valeur sera 
un booléen indiquant à l'interface si la tâche en question est en cours de synchronisation.
Cette clé devra être présente dans l'objet "tâche" en cours de mise à jour, cet objet 
est contenu dans le tableau `taskList` du `state`.
- Pour le critère 6, si l'API n'a pas trouvé la tâche 
à supprimer, `error.response.status` vaudra `404` 
(si `error` est la variable représentant l'erreur dans le `catch`).

## Au-delà du dojo

Les opérations CRUD font partie du quotidien des développeurs, car c'est selon ce 
mode opératoire que sont développées les applications qui gèrent des "ressources" 
(des tâches, des clients, des commandes, des commentaires, des utilisateurs, ..., 
bref: des *données métier* que l'on souhaite bien souvent *persister* afin de les manipuler par la suite). 
Autant dire que cette notion de "CRUD" est omniprésente dans l'immense majorité des applications web !

Comme cette application manipule des données relativement simples, 
il est tout à fait possible (et même souhaitable) de reprendre et 
completer ce dernier tout au long de la formation pour revoir cette base 
(qui sera très vite indispensable) 
ou encore expérimenter de nouvelles choses :)

### Idées pour pratiquer encore plus

- Un bouton "reload" permettant de recharger la liste des tâches depuis le serveur
- Un bouton "afficher uniquement les tâches à faire" / "afficher toutes les tâches"
- Un bouton "Tout cocher" qui ira mettre `done` à `true` pour toutes les tâches 
sur le serveur et le client
- Un bouton "Tout décocher" qui ira mettre `done` à `false` pour toutes les 
tâches sur le serveur et le client
- Un filtre par nom de tâche
- Réusiner le code (mieux compartimenter les composants, utiliser les hooks, ...)
- Utiliser l'API Context pour permettre le choix entre plusieurs thèmes ("mode dark", ...)
- (Avancé) Au double-clique sur une tâche, permettre d'éditer le nom dans un 
formulaire et répercuter les modifications sur le serveur quand 
on a arreté d'écrire depuis x secondes par exemple, ou/et quand on appuie sur Entrée.

### Idées pour appronfondir et découvrir de nouvelles notions

- (Avancé) Utiliser [i18n](https://github.com/i18next/react-i18next) pour internationaliser l'interface.
- (Avancé) Implémenter une gestion du state centralisée avec [Redux](https://redux.js.org/introduction/getting-started).
- (Très avancé) C'est pas hyper propre d'ajouter des propriétés `_submitting`, `_updating` ou `_deleting` 
sur des objets métiers (les tâches) afin d'avoir facilement des informations sur 
leurs états individuels de synchronisation avec l'API. 
[On pourrait utiliser les symboles pour éviter de polluer nos tâches avec ces propriétés](https://medium.com/intrinsic/javascript-symbols-but-why-6b02768f4a5c). 
- (Très avancé) Implémenter [des mises à jour "optimistes" sur l'interface](https://medium.com/@_erikaybar/optimistic-ui-updates-in-react-9e139ffa2e45).

### Idées pour aller beaucoup plus loin

- (Très avancé) [Implémenter les fonctionnalités d'une PWA (mode "offline", ...)](https://www.youtube.com/watch?v=C6S-SOqAX-k).
- (Très très avancé) Aller voir comment est programmée l'API, 
tenter de [persister les infos dans une base de donnée MySQL](https://www.mysqltutorial.org/mysql-nodejs/) (ou autre).
- (Très très avancé) Completez serveur et client pour implémenter une pagination des tâches.
- (Très très avancé) Completez serveur et client pour gérer 
des "chronomètres" (démarrer, mettre en pause, reprendre, remettre à zero) sur les tâches.
- (Avancé à l'extrême) Implémenter une communication bi-directionnelle entre client et serveur, 
pour faire une application en "temps réel" (si je lance un autre client et que le premier ajoute une tâche, 
je la vois automatiquement apparaître sans aucune action de ma part). 
On pourrait par exemple utiliser [socket.io](https://socket.io/) et l'intégrer au serveur Node existant, 
ou carrément repartir sur un autre back-end en utilisant [Firebase](https://firebase.google.com/docs/firestore))
