from datetime import datetime

from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response

from .models import Note
from .serializers import UserSerializer, NoteSerializer, NoteFilterSerializer


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)


class ProfileUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        response = {'message': 'PUT method is not allowed'}
        return Response(response, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        response = {'message': 'PATCH method is not allowed'}
        return Response(response, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    # http_method_names = ['post']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == self.request.user:
            return super().update(request, *args, **kwargs)
        else:
            response = {'message': 'The created user and the updated user are different'}
            return Response(response, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        if instance.user == self.request.user:
            instance.deleted_at = datetime.now()
            instance.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            response = {'message': 'The created user and the deleted user are different'}
            return Response(response, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def perform_destroy(self, instance):
        # 注意 親クラスではperform_destroyでdeleteを実施しているため、必ずオーバーライドしpassすること
        pass


class MyNoteList(generics.ListAPIView):
    serializer_class = NoteFilterSerializer

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(user=user, deleted_at=None)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
