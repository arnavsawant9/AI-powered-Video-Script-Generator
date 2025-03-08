# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from script_generator.views import ScriptViewSet, generate_script, search_scripts, export_script

router = DefaultRouter()
router.register(r'scripts', ScriptViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate-script/', generate_script, name='generate-script'),
    path('search-scripts/', search_scripts, name='search-scripts'),
    path('export-script/<int:script_id>/', export_script, name='export-script'),
]