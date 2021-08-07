from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from api.views import NoteViewSet
from rest_framework.authtoken.views import obtain_auth_token
from . import views

router = routers.DefaultRouter()
router.register('notes', NoteViewSet)


urlpatterns = [
    # userに関わるパス一覧
    path('createuser/', views.CreateUserView.as_view(), name='create'),
    path('userprofile/', views.ProfileUserView.as_view(), name='profile'),
    path('auth/', obtain_auth_token, name='auth'),
    # Note モデル制限アクセス
    path('mynotes/', views.MyNoteList.as_view(), name='list'),
    path('', include(router.urls)),
]
