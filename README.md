# Chat Public - MVP Ultra Simple

Un chat public ultra simple avec Next.js 14, TypeScript, Tailwind CSS et Supabase.

## 🚀 Fonctionnalités

- ✅ Chat public sans authentification
- ✅ Messages en temps réel avec Supabase Realtime
- ✅ Chargement par lots de 20 messages
- ✅ Validation des messages (1-300 caractères)
- ✅ Interface responsive et moderne
- ✅ Pseudo optionnel (défaut: "Anonyme")

## 🛠️ Stack Technique

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Déploiement**: Vercel

## 📋 Prérequis

- Node.js 18+ 
- Compte Supabase (gratuit)

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd site-chat-secret
   npm install
   ```

2. **Créer un projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Choisissez la région UE
   - Notez votre URL et clé anonyme

3. **Configurer les variables d'environnement**
   Créez un fichier `.env.local` à la racine :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
   ```

4. **Exécuter la migration Supabase**
   - Dans votre dashboard Supabase, allez dans "SQL Editor"
   - Copiez et exécutez le contenu de `supabase/migrations/000_init.sql`

5. **Lancer en local**
   ```bash
   npm run dev
   ```
   Ouvrez [http://localhost:3000](http://localhost:3000)

## 🗄️ Structure de la Base de Données

### Table `messages`
```sql
CREATE TABLE messages (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content text NOT NULL CHECK (char_length(trim(content)) BETWEEN 1 AND 300),
    nickname text NOT NULL DEFAULT 'Anonyme',
    created_at timestamptz NOT NULL DEFAULT now()
);
```

### Sécurité (RLS)
- ✅ Row Level Security activé
- ✅ Lecture publique (SELECT)
- ✅ Écriture publique avec validation (INSERT)
- ✅ Pas de modification/suppression (UPDATE/DELETE)

## 📁 Structure du Projet

```
├── app/
│   └── page.tsx              # Page principale
├── components/
│   ├── MessageList.tsx       # Liste des messages + temps réel
│   └── MessageComposer.tsx   # Formulaire d'envoi
├── lib/
│   └── supabase/
│       └── client.ts         # Client Supabase
├── supabase/
│   └── migrations/
│       └── 000_init.sql      # Migration initiale
└── README.md
```

## 🚀 Déploiement sur Vercel

1. **Connecter votre repo GitHub à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Importez votre repository

2. **Configurer les variables d'environnement**
   - Dans les paramètres du projet Vercel
   - Ajoutez les mêmes variables que dans `.env.local`

3. **Déployer**
   - Vercel détecte automatiquement Next.js
   - Le déploiement se fait automatiquement à chaque push

## 🧪 Tests

### Critères d'acceptation
- ✅ Envoi d'un message l'affiche en < 1s sur un autre client
- ✅ Chargement des 20 derniers messages à l'arrivée
- ✅ Bouton "Charger plus" récupère les messages plus anciens
- ✅ Validation des messages vides ou > 300 caractères
- ✅ Interface responsive et accessible

### Test manuel
1. Ouvrez l'app dans deux onglets différents
2. Envoyez un message depuis un onglet
3. Vérifiez qu'il apparaît instantanément dans l'autre
4. Testez la validation (message vide, trop long)
5. Testez le chargement par lots

## 🔧 Configuration Avancée

### Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Scripts disponibles
```bash
npm run dev          # Développement local
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint
```

## 🐛 Dépannage

### Erreur de connexion Supabase
- Vérifiez vos variables d'environnement
- Assurez-vous que votre projet Supabase est actif
- Vérifiez que la migration a été exécutée

### Messages ne s'affichent pas en temps réel
- Vérifiez que Realtime est activé dans Supabase
- Vérifiez les politiques RLS
- Regardez la console pour les erreurs

### Erreur de build Vercel
- Vérifiez que toutes les variables d'environnement sont configurées
- Vérifiez que TypeScript compile sans erreur

## 📝 Notes

- **Sécurité**: Aucune authentification, messages publics
- **Performance**: Index sur `created_at DESC` pour un chargement rapide
- **UX**: Pas d'auto-scroll, l'utilisateur reste à sa position de lecture
- **Responsive**: Interface adaptée mobile/desktop

## 🤝 Contribution

Ce projet est un MVP ultra simple. Pour des améliorations :
- Modération des messages
- Système d'authentification
- Salons multiples
- Emojis et formatage
- Notifications push

---

**Développé avec ❤️ en utilisant Next.js 14 + Supabase**
