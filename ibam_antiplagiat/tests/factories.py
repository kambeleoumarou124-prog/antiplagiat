import factory
from django.contrib.auth import get_user_model

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@ibam.bf")
    nom = factory.Faker('last_name')
    prenom = factory.Faker('first_name')
    role = "ETUDIANT"
