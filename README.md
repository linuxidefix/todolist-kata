# TODOLIST en Angular 2

## Installation de l'environnement de travail

Avant toute chose il faut installer NodeJS (+ NPM) version 6 minimum : https://nodejs.org/en/

Ensuite rendez-vous à la racine du projet avec un terminal puis entrez `npm install`. NPM va alors installer toutes les dépendences nécessaires au bon fonctionnement de notre application.
Une fois terminé lancez le serveur local en entrant `npm run dev` (toujours dans votre terminal) puis rendez-vous sur http://localhost:8080

une fois l'exercice terminé vous pouvez accéder à la solution en faisant un checkout sur la branche `solution`

## Qu'est-ce qu'une Todolist ?

Une Todolist est tout simplement un outil permettant de noter une liste de tâches à faire. Dans ce KATA nous allons en développer un en Angular 2.
Dans cette Todolist nous devons pouvoir :

- Ajouter une tâches
- Les modifier
- Les supprimer
- Changer leur statut en "terminée"
- Afficher la liste des tâches en ayant la possibilité de filtrer (Toutes, Actives, Terminées)

## Angular 2

Angular 2 est la dernière version du framework JavaScript développé par Google. Il faut savoir que cette dernière version n'à plus rien à voir avec les anciennes.

### Component

Dans Angular 2 on fonctionne principalement avec des Components (un composant HTML auquel on y affecte un style et un comportement spécifique). Ceux-ci sont composé d'au minimum :

- un template -> Une vue sur laquelle on mettra notre code HTML
- un selector -> Nom de l'element HTML qui contiendra le template
- un controller -> C'est là que tout le code JavaScript (TypeScript en l'occurence) du component sera executé

### Binding

La grande puissance d'un framework comme Angular est sa capacité à lier la vue et le controller. Pour ce faire il y a plusieurs méthodes. Prenons un exemple simple avec un Component formulaire

```javascript
@Component({
    selector: 'mon-formulaire',
    template: `<form (ngSubmit)="onSubmit()">
        <input type="text" [(ngModel)]="monChamp" />
        <button type="submit">Envoyer</button>
    </form>`
})

class MonFormulaireComponent {
    public monChamp: string

    constructor () {
        this.monChamp = ''
    }

    public onSubmit () {
        alert('Formulaire envoyé, valeur du champ : ' + this.monChamp)
    }
}
```

Ici comme on peut le voir Il y a dans le Template des attributs inhabituels. Prenons `(ngSubmit)="onSubmit()"`, dans Angular 2 lorsqu'on veut créer un évènement de la vue au controller on utilise des attributs entre parenthèses "()" et on lui affecte la méthode du controller que l'on souhaite invoquer

A l'inverse lorsqu'on souhaite envoyer une valeur du controller vers la vue on utilise des crochets "[]" et lui affecte la valeur souhaitée

Parfois on souhaite que les informations transitent dans les deux sens il faudra alors utiliser les deux en même temps comme on peut le voir dans notre exemple `[(ngModel)]="monChamp"`. Ici, on affecte la valeur de "monChamp" à "ngModel" et lui se chargera de mettre à jour "monChamp" à chaque modification.

### *ngIf

Angular nous permet aussi d'afficher ou non une balise HTML à l'aide de l'attribut `*ngIf`

```javascript
@Component({
    selector: 'mon-component',
    template: `<div class="contenu">
        Bonjour
        <span *ngIf="nom !== ''">{{ nom }}</span>
        <span *ngIf="nom === ''">Invité</span>
    </div>`
})

class MonComponentComponent {
    public nom: string

    constructor () {
        this.nom = 'John DOE'
    }
}
```

Notez les doubles brackets `{{}}`, cette syntaxe est utilisée pour afficher le contenu d'une variable ou le resultat d'une méthode du controller.

### *ngFor

Admettons que nous ayons une liste de superhéros dans un tableau et que nous souhaitions l'afficher dans une vue, l'attribut `*ngFor` d'Angular 2 nous permet d'itérer un tableau dans une vue :

```javascript
@Component({
    selector: 'ma-liste',
    template: `<ul class="liste-superheros">
        <li *ngFor="let s of superheros; let i = index" class="superhero">{{ i + '- ' + s.nom + '(' + s.vraiNom + ')' }}</li>
    </ul>`
})

class MaListeComponent {
    public superheros: Hero[]

    constructor () {
        this.superheros = [
            new Hero('Batman', 'Bruce WAYNE', false),
            new Hero('Ironman', 'Tony STARK', true),
            new Hero('Flash', 'Barry ALLEN', false),
            new Hero('Superman', 'Clark KENT', true),
            new Hero('Captain America', 'Steve ROGERS', false),
            new Hero('Hulk', 'Bruce BANNER', false),
        ]
    }
}

class Hero {
    public nom: string
    public vraiNom: string
    public volant: boolean

    constructor (nom, vraiNom, volant) {
        this.nom = nom
        this.vraiNom = vraiNom
        this.volant = volant
    }
}
```

Notez dans le `*ngFor` la présence de `let i = index`. Cela nous permet tout simplement d'affecter à la variable `i` la valeur de l'index de la ligne du tableau qu'on est en train de parcourir

### Pipes

Les pipes dans Angular 2 permettent de retourner une valeur modifiée par rapport à des paramettres qu'on lui fournit. Par exemple transformer une chaine de caractères en la mettant en majuscule ou de filtrer un tableau...
Reprenons notre exemple de superhéros, développons un pipe nous permettant de ne retourner que ceux qui peuvent voler :

```javascript
@Pipe({
    name: 'volant',
})

export class VolantPipe implements PipeTransform {
    public transform (heros: Hero[]): Hero[] {
        return heros.filter(s => s.volant)
    }
}
```

Puis ajoutons le pipe dans notre component :

```javascript
@Component({
    pipes: [ VolantPipe ],
    selector: 'ma-liste',
    template: `<ul class="liste-superheros">
        <li *ngFor="let s of (superheros | volant); let i = index" class="superhero">{{ i + '- ' + s.nom + '(' + s.vraiNom + ')' }}</li>
    </ul>`
})

// Le reste du code ne change pas
```

Nous avons ici donc ajouté notre classe `VolantPipe` dans l'attribut `pipes` du décorateur `@Component` puis nous avons appliqué le filtre `volant` a notre liste de superheros dans le `*ngFor`

Il est aussi possible d'ajouter d'autres paramètres au pipes pour cela il aurait fallut l'ecrire de la sorte : `monObjet | mon-pipe: monParametre1: monParametre2: etc...` et changer la methode transform du Pipe en y ajoutant les arguments :

```javascript
public transform (monObjet, monParametre1, monParametre2, ...etc) {
    // ...
}
```

Dernier point sur les Pipes, il faut savoir qu'ils se mettent à jour uniquement lorsque la référence de l'objet change. Pour plus d'information sur le fonctionnement de JavaScript à ce niveau : https://snook.ca/archives/javascript/javascript_pass

## KATA !

Mettons en pratique ce que nous avons vu.

Votre mission, si vous l'acceptez, sera de finir la Todolist qui a été développée. Actuellement elle ne fait pratiquement rien. tout va se passer dans le dossier `sources/components/todolist` :

1. Lorsque vous tapez quelque chose dans le champ de texte et que vous appuyez sur "ENTER" rien ne se passe ! Il va falloir donc :
    - Envoyer le formulaire
    - Insérer la valeur du champ dans le tableau `todoList` du controller celui-ci est un tableau de `TodoList` (Vous pouvez accéder à la définition de la classe dans le fichier todolist.class.ts)
    - Vider le champ
2. Il faut pouvoir supprimer une ligne lorsqu'on clique sur le bouton "poubelle"
3. Grace au Pipe `TodolistPipe` on doit pouvoir filtrer la liste grace aux boutons dans le footer. Il va donc falloir mettre à jour l'attribut `selectedFilter` avec les valeurs `all`, `actives` et `completed`. Vous pouvez utiliser l'attribut `click` sur un element HTML pour lui affecter une méthode
4. On ne veut pas que le footer s'affiche quand on n'a pas de taches dans la liste

### Bonus

On veut aussi pouvoir modifier une ligne :

- Afficher un champ de texte lorsqu'on double clique sur une tache (le nom de l'attribut sur la vue auquel affecter la méthode est : `dblclick`)
- Faire disparaitre le champ une fois le champ modifié

NB : Pour des raisons esthétiques, pensez à utiliser les exemple sur le template