# Logiciel Anti-Plagiat IBAM

Backend complet pour le système Anti-Plagiat de l'IBAM.
Développé avec Django 5.x, Django REST Framework, Celery, Redis, Channels et PostgreSQL.

## Fonctionnalités
- Authentification JWT avec modèle User personnalisé
- Gestion des sessions académiques
- Soumission et analyse de thèmes et de rapports de stage
- Moteur NLP asynchrone (spaCy, scikit-learn)
- Génération automatique de rapports PDF
- Système de notifications en temps réel avec WebSockets
- Signature électronique (RSA-2048)

## Déploiement

Voir les instructions détaillées dans le cahier des charges (Fedora Linux).

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

python manage.py makemigrations
python manage.py migrate

python manage.py runserver
# ou en production
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```
