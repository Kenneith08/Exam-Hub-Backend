Bon je sais pas si vous savez mais faut copier le contenu de .env.example dans .env dans lequel vous allez completer 
Les champs necessaires pour que tout baigne 

Faites npm install pour installer les dependances /node_modules (chais pas vraiment si c'est necessaires mais bon)

! Oubliez pas de creer la base de donnees !

Pour ça vous devez etre dans la racine du projet (si vous avez deja ouvert le teminal dans votre IDE tapez la cmd suivante)  : psql -U postgres -d exam_hub -f database/migrations/001_init_schema.sql

Une fois fait vous allez taper " npm run seed " et ensuite vous devriez voir un truc du genre Admin cree avec son email et mdp

Toujours dans le termianl vous tapez " npm run dev " et il devrait pas y avoire d'erreur 

Puis vous basculez vers un autre (si vous avez la flemme d'ouvrir un nav ou Postman) et vous tapez :

" curl http://localhost:3000/health "

Le resultat sera long mais normalement il devrait y avoir un code de status 200 
Si vous l'avez pas assurez vous que le projet est à jour pour vous ( git pull ) parce que j'ai déjà testé et le mien marche 



Et pour le JWT secret vous faites ça dans le terminal   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Et la valeur que vous aurez c'est ça que vous mettez dessus 


Franchement faudra formaliser tout ça mais flemme les mecs...