Résumé optimisation APK Skaneo
1. Problème initial

Après un build de production avec :

eas build -p android --profile production

l'APK généré faisait environ :

155,88 Mo

Ce qui était trop lourd pour une application mobile de scan.

2. Vérification de la configuration Expo

On a analysé ton app.json.

On a vérifié :

l'icône ;
le splash screen ;
les plugins Expo ;
la configuration Android ;
le projet EAS.

Le problème ne venait pas :

des images ;
de l'icône ;
des assets.
3. Nettoyage du projet natif

On a exécuté :

npx expo prebuild --clean

Cette commande a :

supprimé l'ancien dossier Android généré ;
recréé une nouvelle configuration native ;
appliqué les paramètres actuels du app.json.

Cela permettait notamment de prendre en compte les nouvelles ressources Android.

4. Problème trouvé dans l'APK

On a extrait l'APK et analysé son contenu.

On a découvert que l'APK contenait plusieurs architectures :

lib/
├── arm64-v8a
├── armeabi-v7a
├── x86
└── x86_64

Donc l'application embarquait :

les téléphones récents ;
les anciens téléphones 32 bits ;
les émulateurs Android.

Résultat : beaucoup de fichiers inutiles pour ton usage.

5. Optimisation choisie

Comme Skaneo cible uniquement les téléphones récents, on a décidé de garder uniquement :

arm64-v8a
6. Correction du app.json

On a ajouté expo-build-properties correctement :

[
  "expo-build-properties",
  {
    "android": {
      "buildArchs": [
        "arm64-v8a"
      ],
      "enableProguardInReleaseBuilds": true
    }
  }
]

Cela permet :

de supprimer les architectures inutiles ;
d'activer l'optimisation du code Android avec ProGuard/R8.
7. Rebuild propre

Après modification :

npx expo prebuild --clean

Puis :

eas build -p android --profile production --clear-cache

Le --clear-cache force EAS à reconstruire complètement l'application avec les nouvelles configurations.

8. Résultat

La dernière méthode a fonctionné ✅

L'APK est maintenant beaucoup plus optimisé car il ne contient plus les architectures inutiles.

La principale amélioration venait de :

Avant :
arm64-v8a
armeabi-v7a
x86
x86_64

Après :
arm64-v8a uniquement
Conclusion

Les principales actions qui ont corrigé le problème :

✅ Analyse de l'APK
✅ Identification des architectures inutiles
✅ Configuration ARM64 uniquement
✅ Activation ProGuard
✅ Nettoyage avec expo prebuild --clean
✅ Nouveau build EAS avec cache vidé