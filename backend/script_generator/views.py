from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Script
from .serializers import ScriptSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

class ScriptViewSet(viewsets.ModelViewSet):
    queryset = Script.objects.all().order_by('-created_at') # Order by newest first
    serializer_class = ScriptSerializer

@api_view(['POST'])
def generate_script(request):
    prompt = request.data.get('prompt')

    if not prompt:
        return Response({'error': 'Prompt is required'}, status=400)

    # Call the AI API (replace with your actual API endpoint and key)
    api_url = 'https://api.example.com/generate_script' # Replace with the actual API endpoint
    headers = {'Authorization': 'Bearer YOUR_API_KEY'}  #If API Key is required
    data = {'prompt': prompt}

    try:
        response = requests.post(api_url, headers=headers, json=data)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        ai_script = response.json().get('script')  # Adjust based on the actual response structure

        if ai_script:
            # Save the script to the database
            script = Script.objects.create(prompt=prompt, generated_script=ai_script)
            serializer = ScriptSerializer(script)
            return Response(serializer.data, status=201)
        else:
            return Response({'error': 'Failed to generate script from AI API'}, status=500)

    except requests.exceptions.RequestException as e:
        return Response({'error': f'Error calling AI API: {str(e)}'}, status=500)
