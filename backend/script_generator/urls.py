from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'scripts', views.ScriptViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', views.generate_script, name='generate_script'),
]
