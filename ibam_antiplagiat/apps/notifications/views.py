from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(destinataire=self.request.user)

    @action(detail=True, methods=["put"])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.lue = True
        notification.save()
        return Response({"message": "Notification marquée comme lue"})

    @action(detail=False, methods=["put"], url_path="read-all")
    def read_all(self, request):
        self.get_queryset().update(lue=True)
        return Response({"message": "Toutes les notifications marquées comme lues"})

    @action(detail=False, methods=["get"], url_path="unread-count")
    def unread_count(self, request):
        count = self.get_queryset().filter(lue=False).count()
        return Response({"unread_count": count})
