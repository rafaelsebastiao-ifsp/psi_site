import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import Reuniao, Video

from django.contrib.auth import get_user_model


def index(request):
    return render(request, 'core/index.html')

def api_reunioes(request):
    qs = Reuniao.objects.filter(ativo=True)
    data = list(qs.values(
        'nome','horario','endereco','tipo','dist',
        'dia','mes','diasem','cidade','contato','descricao','lat','lng'
    ))
    # converte tipo para label legível
    tipo_map = {'aberta': 'Reunião aberta', 'fechada': 'Reunião fechada'}
    for r in data:
        r['tipo'] = tipo_map.get(r['tipo'], r['tipo'])
    return JsonResponse(data, safe=False)

def api_videos(request):
    qs = Video.objects.filter(ativo=True)
    data = list(qs.values('titulo','thumb','canal','views','url'))
    return JsonResponse(data, safe=False)


User = get_user_model()

def api_usuarios(request):
    usuarios = User.objects.filter(is_superuser=True)

    data = list(
        usuarios.values(
            'id',
            'username',
            'email',
            'first_name',
            'last_name'
        )
    )

    return JsonResponse(data, safe=False)