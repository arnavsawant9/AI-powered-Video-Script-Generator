from django.db import models

# Create your models here.
class Script(models.Model):
    prompt = models.TextField()
    generated_script = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prompt
