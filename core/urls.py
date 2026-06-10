from django.urls import path
from . import views
from . import admin_views

urlpatterns = [
    # ── Site público ──────────────────────────────────────────────────────
    path('', views.index, name='index'),
    path('api/reunioes/', views.api_reunioes, name='api_reunioes'),
    path('api/videos/',   views.api_videos,   name='api_videos'),
    path('api/usuarios/', views.api_usuarios, name='api_usuarios'),

    # ── Autenticação ──────────────────────────────────────────────────────
    path('painel/login/',  admin_views.admin_login,  name='admin_login'),
    path('painel/logout/', admin_views.admin_logout, name='admin_logout'),
    path('painel/',        admin_views.admin_panel,  name='admin_panel'),

    # ── APIs do painel ────────────────────────────────────────────────────
    path('api/admin/reunioes/',     admin_views.api_admin_reunioes,       name='api_admin_reunioes'),
    path('api/admin/reunioes/<int:pk>/', admin_views.api_admin_reuniao_detail, name='api_admin_reuniao_detail'),
    path('api/admin/videos/',       admin_views.api_admin_videos,         name='api_admin_videos'),
    path('api/admin/videos/<int:pk>/',   admin_views.api_admin_video_detail,   name='api_admin_video_detail'),
]
