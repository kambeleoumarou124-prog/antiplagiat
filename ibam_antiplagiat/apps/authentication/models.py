from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class RoleChoices(models.TextChoices):
    ETUDIANT    = "ETUDIANT",    "Étudiant"
    CHEF_DEPT   = "CHEF_DEPT",   "Chef de Département"
    DIR_ADJOINT = "DIR_ADJOINT", "Directeur Adjoint"
    ADMIN       = "ADMIN",       "Administrateur"

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('role', RoleChoices.ADMIN)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superutilisateur doit avoir is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superutilisateur doit avoir is_staff=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email                  = models.EmailField(unique=True)
    nom                    = models.CharField(max_length=100)
    prenom                 = models.CharField(max_length=100)
    role                   = models.CharField(max_length=20, choices=RoleChoices.choices, default=RoleChoices.ETUDIANT)
    actif                  = models.BooleanField(default=True)
    eligibilite_rapport    = models.BooleanField(default=False)
    failed_login_attempts  = models.PositiveSmallIntegerField(default=0)
    locked_until           = models.DateTimeField(null=True, blank=True)
    date_creation          = models.DateTimeField(auto_now_add=True)
    date_modification      = models.DateTimeField(auto_now=True)
    
    # Required for Django admin access
    is_staff               = models.BooleanField(default=False)
    is_active              = models.BooleanField(default=True)

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["nom", "prenom", "role"]
    objects = UserManager()

    class Meta:
        db_table = "users"
        verbose_name = "Utilisateur"
        
    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.email})"
