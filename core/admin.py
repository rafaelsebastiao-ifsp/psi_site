from django.contrib import admin
from .models import Reuniao, Video

@admin.register(Reuniao)
class ReuniaoAdmin(admin.ModelAdmin):
    list_display  = ('nome', 'cidade', 'diasem', 'dia', 'mes', 'horario', 'tipo', 'ativo')
    list_filter   = ('tipo', 'ativo', 'mes')
    search_fields = ('nome', 'cidade', 'endereco')
    list_editable = ('ativo',)
    fieldsets = (
        ('Identificação', {
            'fields': ('nome', 'tipo', 'ativo')
        }),
        ('Data e Horário', {
            'fields': (('dia', 'mes', 'diasem'), 'horario')
        }),
        ('Localização', {
            'fields': ('endereco', 'cidade', 'dist', ('lat', 'lng'))
        }),
        ('Contato e Descrição', {
            'fields': ('contato', 'descricao')
        }),
    )

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display  = ('titulo', 'canal', 'views', 'ordem', 'ativo')
    list_editable = ('ordem', 'ativo')
    search_fields = ('titulo', 'canal')
