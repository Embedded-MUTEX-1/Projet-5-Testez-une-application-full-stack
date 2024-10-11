# Projet-5-OpenClassrooms
## Mise en place de la base de données
- Sur le site de MySQL (https://www.mysql.com/fr/downloads/) téléchargez la dernière version du SGDB et procédez à l'installation.
- Téléchargez et installez l'outil MySQL Workbench (https://dev.mysql.com/downloads/workbench/).
- Après avoir configuré l'outil pour se connecter au SGBD, créez une base de données et un utilisateur avec les droits nécessaires au CRUD, et la manipulation des bases de données.
- Pensez à noter les mots de passe, identifiants et url pour pouvoir les utiliser par la suite.
## Mise en place du projet
- Clonez le projet.
- Avec votre IDE Java préféré, ouvrez l'un des dossier du projet.
### Front
**Commandes** :

Installer les dépendances : ``` npm install ```

Lancer l'application angular : ``` ng s ```

Lancer les tests : ``` npm test ```

Lancer les tests e2e : ``` ng run yoga:e2e-ci ```

Obtenir le coverage : ``` ng run yoga:e2e-ci ```
### Back
Modifier le fichier 'application.properties' pour l'accès à votre BDD

**Commandes** :

Lancer les tests : ``` mvn clean verify ```

Obtenir le coverage : dans les dossiers target -> jacoco, ouvrir le fichier 'index.html' dans votre navigateur
