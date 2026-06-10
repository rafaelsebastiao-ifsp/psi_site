import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

from .models import Reuniao, Video


# ── Login / Logout ──────────────────────────────────────────────────────────

def admin_login(request):
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('admin_panel')

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None and (user.is_staff or user.is_superuser):
            login(request, user)
            return redirect('admin_panel')
        else:
            return render(request, 'core/login.html', {
                'error': 'Usuário ou senha inválidos, ou sem permissão de acesso.',
                'username': username,
            })

    return render(request, 'core/login.html')


def admin_logout(request):
    logout(request)
    return redirect('admin_login')


# ── Painel ───────────────────────────────────────────────────────────────────

@login_required(login_url='admin_login')
def admin_panel(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return redirect('admin_login')
    return render(request, 'core/admin_panel.html')


# ── API Reuniões ─────────────────────────────────────────────────────────────

def _require_staff(view):
    """Decorador simples: exige login + is_staff."""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
            return JsonResponse({'error': 'Forbidden'}, status=403)
        return view(request, *args, **kwargs)
    return wrapper


@_require_staff
@require_http_methods(['GET', 'POST'])
def api_admin_reunioes(request):
    if request.method == 'GET':
        qs = Reuniao.objects.all()
        data = list(qs.values(
            'id', 'nome', 'horario', 'endereco', 'cidade', 'tipo',
            'contato', 'descricao', 'dia', 'mes', 'diasem',
            'dist', 'lat', 'lng', 'ativo'
        ))
        return JsonResponse(data, safe=False)

    # POST — criar nova reunião
    payload = json.loads(request.body)
    r = Reuniao.objects.create(
        nome=payload.get('nome', ''),
        horario=payload.get('horario', ''),
        endereco=payload.get('endereco', ''),
        cidade=payload.get('cidade', ''),
        tipo=payload.get('tipo', 'aberta'),
        contato=payload.get('contato', ''),
        descricao=payload.get('descricao', ''),
        dia=payload.get('dia', ''),
        mes=payload.get('mes', ''),
        diasem=payload.get('diasem', ''),
        dist=payload.get('dist', ''),
        lat=float(payload.get('lat', 0)),
        lng=float(payload.get('lng', 0)),
        ativo=bool(payload.get('ativo', True)),
    )
    return JsonResponse({'id': r.id}, status=201)


@_require_staff
@require_http_methods(['PUT', 'PATCH', 'DELETE'])
def api_admin_reuniao_detail(request, pk):
    try:
        r = Reuniao.objects.get(pk=pk)
    except Reuniao.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'DELETE':
        r.delete()
        return JsonResponse({'ok': True})

    payload = json.loads(request.body)

    if request.method == 'PATCH':
        # apenas campos enviados
        for field in ['ativo', 'nome', 'horario', 'endereco', 'cidade', 'tipo',
                      'contato', 'descricao', 'dia', 'mes', 'diasem', 'dist', 'lat', 'lng']:
            if field in payload:
                setattr(r, field, payload[field])
        r.save()
        return JsonResponse({'ok': True})

    # PUT — atualização completa
    r.nome     = payload.get('nome', r.nome)
    r.horario  = payload.get('horario', r.horario)
    r.endereco = payload.get('endereco', r.endereco)
    r.cidade   = payload.get('cidade', r.cidade)
    r.tipo     = payload.get('tipo', r.tipo)
    r.contato  = payload.get('contato', r.contato)
    r.descricao= payload.get('descricao', r.descricao)
    r.dia      = payload.get('dia', r.dia)
    r.mes      = payload.get('mes', r.mes)
    r.diasem   = payload.get('diasem', r.diasem)
    r.dist     = payload.get('dist', r.dist)
    r.lat      = float(payload.get('lat', r.lat))
    r.lng      = float(payload.get('lng', r.lng))
    r.ativo    = bool(payload.get('ativo', r.ativo))
    r.save()
    return JsonResponse({'ok': True})


# ── API Vídeos ────────────────────────────────────────────────────────────────

@_require_staff
@require_http_methods(['GET', 'POST'])
def api_admin_videos(request):
    if request.method == 'GET':
        qs = Video.objects.all()
        data = list(qs.values('id', 'titulo', 'thumb', 'canal', 'views', 'url', 'ordem', 'ativo'))
        return JsonResponse(data, safe=False)

    payload = json.loads(request.body)
    v = Video.objects.create(
        titulo=payload.get('titulo', ''),
        thumb=payload.get('thumb', ''),
        canal=payload.get('canal', 'JA Brasil'),
        views=payload.get('views', '0'),
        url=payload.get('url', ''),
        ordem=int(payload.get('ordem', 0)),
        ativo=bool(payload.get('ativo', True)),
    )
    return JsonResponse({'id': v.id}, status=201)


@_require_staff
@require_http_methods(['PUT', 'PATCH', 'DELETE'])
def api_admin_video_detail(request, pk):
    try:
        v = Video.objects.get(pk=pk)
    except Video.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'DELETE':
        v.delete()
        return JsonResponse({'ok': True})

    payload = json.loads(request.body)

    if request.method == 'PATCH':
        for field in ['ativo', 'titulo', 'thumb', 'canal', 'views', 'url', 'ordem']:
            if field in payload:
                setattr(v, field, payload[field])
        v.save()
        return JsonResponse({'ok': True})

    v.titulo = payload.get('titulo', v.titulo)
    v.thumb  = payload.get('thumb', v.thumb)
    v.canal  = payload.get('canal', v.canal)
    v.views  = payload.get('views', v.views)
    v.url    = payload.get('url', v.url)
    v.ordem  = int(payload.get('ordem', v.ordem))
    v.ativo  = bool(payload.get('ativo', v.ativo))
    v.save()
    return JsonResponse({'ok': True})
