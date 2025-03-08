# script_generator/serializers.py
from rest_framework import serializers
from .models import Script, UploadedFile

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'file', 'file_type', 'text_content', 'upload_date']

class ScriptSerializer(serializers.ModelSerializer):
    files = UploadedFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = Script
        fields = ['id', 'title', 'prompt', 'generated_script', 'language', 'created_at', 'files']