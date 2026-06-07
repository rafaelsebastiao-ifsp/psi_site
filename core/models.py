from django.db import models

TIPO_CHOICES = [
    ('aberta', 'Reunião aberta'),
    ('fechada', 'Reunião fechada'),
]

class Reuniao(models.Model):
    nome     = models.CharField('Nome do grupo', max_length=200)
    horario  = models.CharField('Horário', max_length=50, help_text='Ex: 19h00 - 20h30')
    endereco = models.CharField('Endereço', max_length=300)
    cidade   = models.CharField('Cidade', max_length=100)
    tipo     = models.CharField('Tipo', max_length=10, choices=TIPO_CHOICES, default='aberta')
    contato  = models.CharField('Contato (telefone)', max_length=30, blank=True)
    descricao = models.TextField('Descrição', blank=True)
    dia      = models.CharField('Dia', max_length=2, help_text='Ex: 16')
    mes      = models.CharField('Mês', max_length=3, help_text='Ex: ABR')
    diasem   = models.CharField('Dia da semana', max_length=3, help_text='Ex: QUI')
    dist     = models.CharField('Distância (texto)', max_length=50, blank=True, help_text='Ex: 1,2 KM DE VOCÊ')
    lat      = models.FloatField('Latitude')
    lng      = models.FloatField('Longitude')
    ativo    = models.BooleanField('Ativo', default=True)

    class Meta:
        verbose_name = 'Reunião'
        verbose_name_plural = 'Reuniões'
        ordering = ['dia', 'mes']

    def __str__(self):
        return f'{self.nome} — {self.diasem} {self.dia}/{self.mes}'


class Video(models.Model):
    titulo = models.CharField('Título', max_length=200)
    thumb  = models.CharField('Caminho da thumbnail', max_length=300, help_text='Ex: assets/images/videoteca/video-01.jpg')
    canal  = models.CharField('Canal', max_length=100, default='JA Brasil')
    views  = models.CharField('Visualizações (texto)', max_length=20, default='0', help_text='Ex: 2.3K')
    url    = models.URLField('URL do vídeo', blank=True)
    ordem  = models.PositiveIntegerField('Ordem de exibição', default=0)
    ativo  = models.BooleanField('Ativo', default=True)

    class Meta:
        verbose_name = 'Vídeo'
        verbose_name_plural = 'Vídeos'
        ordering = ['ordem']

    def __str__(self):
        return self.titulo
