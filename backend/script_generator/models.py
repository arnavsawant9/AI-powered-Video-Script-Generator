# script_generator/models.py
from django.db import models

class Script(models.Model):
    title = models.CharField(max_length=255, blank=True)
    prompt = models.TextField()
    generated_script = models.TextField()
    language = models.CharField(max_length=50, default='English')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title if self.title else self.prompt[:50]
    
    class Meta:
        ordering = ['-created_at']

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    file_type = models.CharField(max_length=50)
    text_content = models.TextField(blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    script = models.ForeignKey(Script, related_name='files', on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return f"{self.file.name}"