from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/reunioes/', views.api_reunioes, name='api_reunioes'),
    path('api/videos/', views.api_videos, name='api_videos'),
]
