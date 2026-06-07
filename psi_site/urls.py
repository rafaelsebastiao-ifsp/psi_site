from django.contrib import admin
from django.urls import path, include

admin.site.site_header  = 'Jogadores Anônimos — Admin'
admin.site.site_title   = 'JA Admin'
admin.site.index_title  = 'Painel de administração'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
]
