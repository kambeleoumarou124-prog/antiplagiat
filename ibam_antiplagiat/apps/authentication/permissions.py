from rest_framework.permissions import BasePermission

class IsEtudiant(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role == "ETUDIANT")

class IsChefDept(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role == "CHEF_DEPT")

class IsDirAdjoint(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role == "DIR_ADJOINT")

class IsAdminIBAM(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role == "ADMIN")

class IsChefOrDirAdjoint(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role in ("CHEF_DEPT", "DIR_ADJOINT"))
