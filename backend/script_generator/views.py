# from django.shortcuts import render

# # Create your views here.
# from rest_framework import viewsets
# from .models import Script
# from .serializers import ScriptSerializer
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# import requests

# class ScriptViewSet(viewsets.ModelViewSet):
#     queryset = Script.objects.all().order_by('-created_at') # Order by newest first
#     serializer_class = ScriptSerializer

# @api_view(['POST'])
# def generate_script(request):
#     prompt = request.data.get('prompt')

#     if not prompt:
#         return Response({'error': 'Prompt is required'}, status=400)

#     # Call the AI API (replace with your actual API endpoint and key)
#     api_url = 'https://api.example.com/generate_script' # Replace with the actual API endpoint
#     headers = {'Authorization': 'Bearer YOUR_API_KEY'}  #If API Key is required
#     data = {'prompt': prompt}

#     try:
#         response = requests.post(api_url, headers=headers, json=data)
#         response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
#         ai_script = response.json().get('script')  # Adjust based on the actual response structure

#         if ai_script:
#             # Save the script to the database
#             script = Script.objects.create(prompt=prompt, generated_script=ai_script)
#             serializer = ScriptSerializer(script)
#             return Response(serializer.data, status=201)
#         else:
#             return Response({'error': 'Failed to generate script from AI API'}, status=500)

#     except requests.exceptions.RequestException as e:
#         return Response({'error': f'Error calling AI API: {str(e)}'}, status=500)




















# # script_generator/views.py
# import os
# import json
# import requests
# import PyPDF2
# from django.conf import settings
# from django.shortcuts import render
# from rest_framework import viewsets, status
# from rest_framework.decorators import api_view, parser_classes
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
# from .models import Script, UploadedFile
# from .serializers import ScriptSerializer, UploadedFileSerializer
# import base64
# import mimetypes

# class ScriptViewSet(viewsets.ModelViewSet):
#     queryset = Script.objects.all()
#     serializer_class = ScriptSerializer
    
#     def get_queryset(self):
#         queryset = Script.objects.all()
#         search_query = self.request.query_params.get('search', None)
#         language = self.request.query_params.get('language', None)
        
#         if search_query:
#             queryset = queryset.filter(
#                 title__icontains=search_query) | queryset.filter(prompt__icontains=search_query)
#         if language:
#             queryset = queryset.filter(language=language)
            
#         return queryset

# @api_view(['POST'])
# @parser_classes([MultiPartParser, FormParser, JSONParser])
# def generate_script(request):
#     prompt = request.data.get('prompt', '')
#     title = request.data.get('title', '')
#     language = request.data.get('language', 'English')
    
#     if not prompt:
#         return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)
    
#     # Handle file upload if present
#     files = request.FILES.getlist('files') if 'files' in request.data else []
#     extracted_text = ""
#     uploaded_files = []
    
#     for file in files:
#         file_obj = UploadedFile.objects.create(file=file, file_type=file.content_type)
#         uploaded_files.append(file_obj)
        
#         # Extract text based on file type
#         if file.name.endswith('.txt'):
#             text = file.read().decode('utf-8')
#             file_obj.text_content = text
#             extracted_text += f"\nContent from {file.name}: {text}"
        
#         elif file.name.endswith('.pdf'):
#             try:
#                 reader = PyPDF2.PdfReader(file)
#                 pdf_text = ""
#                 for page_num in range(len(reader.pages)):
#                     pdf_text += reader.pages[page_num].extract_text()
#                 file_obj.text_content = pdf_text
#                 extracted_text += f"\nContent from {file.name}: {pdf_text}"
#             except Exception as e:
#                 extracted_text += f"\nError extracting text from {file.name}: {str(e)}"
        
#         file_obj.save()
    
#     # Process links if present
#     links = request.data.get('links', '').split(',') if request.data.get('links') else []
#     link_content = ""
    
#     for link in links:
#         if link.strip():
#             try:
#                 response = requests.get(link.strip())
#                 link_content += f"\nContent from URL {link}: {response.text[:500]}..."  # Limit content size
#             except Exception as e:
#                 link_content += f"\nFailed to fetch content from URL {link}: {str(e)}"
    
#     # Build enhanced prompt with all inputs
#     enhanced_prompt = prompt
#     if extracted_text:
#         enhanced_prompt += "\n\nAdditional context from files:" + extracted_text
#     if link_content:
#         enhanced_prompt += "\n\nAdditional context from links:" + link_content
    
#     # Call Gemini API
#     api_key = settings.GEMINI_API_KEY
#     api_url = f"{settings.GEMINI_API_URL}?key={api_key}"
    
#     headers = {
#         'Content-Type': 'application/json'
#     }
    
#     payload = {
#         "contents": [
#             {
#                 "parts": [
#                     {
#                         "text": f"Generate a video script based on the following prompt. The script should be well-structured with sections for introduction, main body, and conclusion. Make it engaging and suitable for a video. Format it nicely with clear section headers. Write it in {language}.\n\nHere's the prompt: {enhanced_prompt}"
#                     }
#                 ]
#             }
#         ],
#         "generationConfig": {
#             "temperature": 0.7,
#             "topK": 40,
#             "topP": 0.95,
#             "maxOutputTokens": 2048,
#         }
#     }
    
#     try:
#         response = requests.post(api_url, headers=headers, json=payload)
#         response.raise_for_status()
        
#         response_data = response.json()
#         # Extract text from Gemini API response
#         generated_text = response_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
        
#         if not generated_text:
#             return Response({'error': 'Failed to generate script from Gemini API'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#         # Save script to database
#         script = Script.objects.create(
#             title=title if title else prompt[:50],
#             prompt=prompt,
#             generated_script=generated_text,
#             language=language
#         )
        
#         # Associate uploaded files with script
#         for file_obj in uploaded_files:
#             file_obj.script = script
#             file_obj.save()
        
#         serializer = ScriptSerializer(script)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
    
#     except requests.exceptions.RequestException as e:
#         return Response({'error': f'Error calling Gemini API: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['GET'])
# def search_scripts(request):
#     search_query = request.query_params.get('q', '')
#     language = request.query_params.get('language', None)
#     page = int(request.query_params.get('page', 1))
#     page_size = int(request.query_params.get('page_size', 10))
    
#     queryset = Script.objects.all()
    
#     if search_query:
#         queryset = queryset.filter(title__icontains=search_query) | queryset.filter(prompt__icontains=search_query)
    
#     if language:
#         queryset = queryset.filter(language=language)
    
#     total_count = queryset.count()
#     start = (page - 1) * page_size
#     end = start + page_size
    
#     scripts = queryset[start:end]
#     serializer = ScriptSerializer(scripts, many=True)
    
#     return Response({
#         'results': serializer.data,
#         'count': total_count,
#         'total_pages': (total_count + page_size - 1) // page_size,
#         'current_page': page
#     })

# @api_view(['GET'])
# def export_script(request, script_id):
#     try:
#         script = Script.objects.get(id=script_id)
#         format_type = request.query_params.get('format', 'txt')
        
#         if format_type == 'txt':
#             response = Response({
#                 'content': script.generated_script,
#                 'filename': f"{script.title or 'script'}.txt"
#             })
#             return response
        
#         elif format_type == 'json':
#             serializer = ScriptSerializer(script)
#             return Response(serializer.data)
        
#         else:
#             return Response({'error': 'Unsupported format'}, status=status.HTTP_400_BAD_REQUEST)
    
#     except Script.DoesNotExist:
#         return Response({'error': 'Script not found'}, status=status.HTTP_404_NOT_FOUND)











# code which is working perfectly fine!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# import os
# import json
# import requests
# import PyPDF2
# import logging
# from django.conf import settings
# from django.shortcuts import render
# from rest_framework import viewsets, status
# from rest_framework.decorators import api_view, parser_classes
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
# from .models import Script, UploadedFile
# from .serializers import ScriptSerializer, UploadedFileSerializer
# from django.http import JsonResponse

# @api_view(['GET'])
# def search_scripts(request):
#     return JsonResponse({"message": "Search functionality is not yet implemented"})

# def export_script(request, script_id):
#     return JsonResponse({"message": "Export script function works!"})

# logger = logging.getLogger(__name__)

# class ScriptViewSet(viewsets.ModelViewSet):
#     queryset = Script.objects.all()
#     serializer_class = ScriptSerializer

    
    
#     def get_queryset(self):
#         queryset = Script.objects.all()
#         search_query = self.request.query_params.get('search', None)
#         language = self.request.query_params.get('language', None)
        
#         if search_query:
#             queryset = queryset.filter(
#                 title__icontains=search_query) | queryset.filter(prompt__icontains=search_query)
#         if language:
#             queryset = queryset.filter(language=language)
            
#         return queryset

# @api_view(['POST'])
# @parser_classes([MultiPartParser, FormParser, JSONParser])
# def generate_script(request):
#     try:
#         print("🔹 Received request for script generation")
#         print("🔹 Request data:", request.data)

#         prompt = request.data.get('prompt', '')
#         title = request.data.get('title', '')
#         language = request.data.get('language', 'English')

#         if not prompt:
#             return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

#         # Handle file upload if present
#         files = request.FILES.getlist('files') if 'files' in request.data else []
#         extracted_text = ""
#         uploaded_files = []

#         for file in files:
#             file_obj = UploadedFile.objects.create(file=file, file_type=file.content_type)
#             uploaded_files.append(file_obj)

#             # Extract text based on file type
#             if file.name.endswith('.txt'):
#                 text = file.read().decode('utf-8')
#                 file_obj.text_content = text
#                 extracted_text += f"\nContent from {file.name}: {text}"

#             elif file.name.endswith('.pdf'):
#                 try:
#                     reader = PyPDF2.PdfReader(file)
#                     pdf_text = ""
#                     for page_num in range(len(reader.pages)):
#                         pdf_text += reader.pages[page_num].extract_text()
#                     file_obj.text_content = pdf_text
#                     extracted_text += f"\nContent from {file.name}: {pdf_text}"
#                 except Exception as e:
#                     extracted_text += f"\nError extracting text from {file.name}: {str(e)}"

#             file_obj.save()

#         # Process links if present
#         links = request.data.get('links', '').split(',') if request.data.get('links') else []
#         link_content = ""

#         for link in links:
#             if link.strip():
#                 try:
#                     response = requests.get(link.strip())
#                     link_content += f"\nContent from URL {link}: {response.text[:500]}..."  # Limit content size
#                 except Exception as e:
#                     link_content += f"\nFailed to fetch content from URL {link}: {str(e)}"

#         # Build enhanced prompt with all inputs
#         enhanced_prompt = prompt
#         if extracted_text:
#             enhanced_prompt += "\n\nAdditional context from files:" + extracted_text
#         if link_content:
#             enhanced_prompt += "\n\nAdditional context from links:" + link_content

#         print("🔹 Enhanced Prompt:", enhanced_prompt)

#         # Call Gemini API
#         api_key = settings.GEMINI_API_KEY
#         api_url = f"{settings.GEMINI_API_URL}?key={api_key}"

#         headers = {
#             'Content-Type': 'application/json'
#         }

#         payload = {
#             "contents": [
#                 {
#                     "parts": [
#                         {
#                             "text": f"Generate a video script based on the following prompt. The script should be well-structured with sections for introduction, main body, and conclusion. Make it engaging and suitable for a video. Format it nicely with clear section headers. Write it in {language}.\n\nHere's the prompt: {enhanced_prompt}"
#                         }
#                     ]
#                 }
#             ],
#             "generationConfig": {
#                 "temperature": 0.7,
#                 "topK": 40,
#                 "topP": 0.95,
#                 "maxOutputTokens": 2048,
#             }
#         }

#         print("🔹 Sending request to Gemini API...")

#         try:
#             response = requests.post(api_url, headers=headers, json=payload)
#             response.raise_for_status()

#             response_data = response.json()
#             print("✅ Gemini API Response:", response_data)

#             # Extract text from Gemini API response
#             generated_text = response_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')

#             if not generated_text:
#                 return Response({'error': 'Failed to generate script from Gemini API'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#             # Save script to database
#             script = Script.objects.create(
#                 title=title if title else prompt[:50],
#                 prompt=prompt,
#                 generated_script=generated_text,
#                 language=language
#             )

#             # Associate uploaded files with script
#             for file_obj in uploaded_files:
#                 file_obj.script = script
#                 file_obj.save()

#             serializer = ScriptSerializer(script)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         except requests.exceptions.RequestException as e:
#             logger.error(f"❌ Error calling Gemini API: {str(e)}")
#             return Response({'error': f'Error calling Gemini API: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     except Exception as e:
#         logger.error(f"❌ Internal Server Error in generate_script: {str(e)}")
#         return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)



















import os
import json
import requests
import PyPDF2
import logging
from django.conf import settings
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.http import JsonResponse
from .models import Script, UploadedFile
from .serializers import ScriptSerializer, UploadedFileSerializer
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image

logger = logging.getLogger(__name__)

@api_view(['GET'])
def search_scripts(request):
    return JsonResponse({"message": "Search functionality is not yet implemented"})

@api_view(['GET'])
def export_script(request, script_id):
    return JsonResponse({"message": "Export script function works!"})

class ScriptViewSet(viewsets.ModelViewSet):
    queryset = Script.objects.all()
    serializer_class = ScriptSerializer
    
    def get_queryset(self):
        queryset = Script.objects.all()
        search_query = self.request.query_params.get('search', None)
        language = self.request.query_params.get('language', None)
        
        if search_query:
            queryset = queryset.filter(title__icontains=search_query) | queryset.filter(prompt__icontains=search_query)
        if language:
            queryset = queryset.filter(language=language)
            
        return queryset

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
# def generate_script(request):
#     try:
#         print("🔹 Received request for script generation")
#         print("🔹 Request data:", request.data)

#         prompt = request.data.get('prompt', '')
#         title = request.data.get('title', '')
#         language = request.data.get('language', 'English')

#         if not prompt:
#             return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

#         files = request.FILES.getlist('files') if 'files' in request.data else []
#         extracted_text = ""
#         uploaded_files = []

#         for file in files:
#             file_obj = UploadedFile.objects.create(file=file, file_type=file.content_type)
#             uploaded_files.append(file_obj)

#             if file.name.endswith('.txt'):
#                 text = file.read().decode('utf-8')
#                 file_obj.text_content = text
#                 extracted_text += f"\nContent from {file.name}: {text}"

#             elif file.name.endswith('.pdf'):
#                 try:
#                     reader = PyPDF2.PdfReader(file)
#                     pdf_text = ""
#                     for page_num in range(len(reader.pages)):
#                         pdf_text += reader.pages[page_num].extract_text()
#                     file_obj.text_content = pdf_text
#                     extracted_text += f"\nContent from {file.name}: {pdf_text}"
#                 except Exception as e:
#                     extracted_text += f"\nError extracting text from {file.name}: {str(e)}"

#             file_obj.save()

#         links = request.data.get('links', '').split(',') if request.data.get('links') else []
#         link_content = ""

#         for link in links:
#             if link.strip():
#                 try:
#                     response = requests.get(link.strip())
#                     link_content += f"\nContent from URL {link}: {response.text[:500]}..."
#                 except Exception as e:
#                     link_content += f"\nFailed to fetch content from URL {link}: {str(e)}"

#         enhanced_prompt = prompt
#         if extracted_text:
#             enhanced_prompt += "\n\nAdditional context from files:" + extracted_text
#         if link_content:
#             enhanced_prompt += "\n\nAdditional context from links:" + link_content

#         print("🔹 Enhanced Prompt:", enhanced_prompt)

#         api_key = settings.GEMINI_API_KEY
#         api_url = f"{settings.GEMINI_API_URL}?key={api_key}"

#         headers = {'Content-Type': 'application/json'}
#         payload = {
#             "contents": [
#                 {"parts": [{"text": f"Generate a video script based on the following prompt. The script should be well-structured with sections for introduction, main body, and conclusion. Make it engaging and suitable for a video. Format it nicely with clear section headers. Write it in {language}.\n\nHere's the prompt: {enhanced_prompt}"}]}
#             ],
#             "generationConfig": {
#                 "temperature": 0.7,
#                 "topK": 40,
#                 "topP": 0.95,
#                 "maxOutputTokens": 2048,
#             }
#         }

#         print("🔹 Sending request to Gemini API...")

#         try:
#             response = requests.post(api_url, headers=headers, json=payload)
#             response.raise_for_status()
#             response_data = response.json()
#             print("✅ Gemini API Response:", response_data)

#             generated_text = response_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')

#             if not generated_text:
#                 return Response({'error': 'Failed to generate script from Gemini API'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#             script = Script.objects.create(
#                 title=title if title else prompt[:50],
#                 prompt=prompt,
#                 generated_script=generated_text,
#                 language=language
#             )

#             for file_obj in uploaded_files:
#                 file_obj.script = script
#                 file_obj.save()

#             serializer = ScriptSerializer(script)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         except requests.exceptions.RequestException as e:
#             logger.error(f"❌ Error calling Gemini API: {str(e)}")
#             return Response({'error': f'Error calling Gemini API: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     except Exception as e:
#         logger.error(f"❌ Internal Server Error in generate_script: {str(e)}")
#         return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)


def generate_script(request):
    try:
        print("🔹 Received request for script generation")
        print("🔹 Request data:", request.data)

        prompt = request.data.get('prompt', '')
        title = request.data.get('title', '')
        language = request.data.get('language', 'English')

        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        files = request.FILES.getlist('files') if 'files' in request.data else []
        extracted_text = ""
        uploaded_files = []

        for file in files:
            file_obj = UploadedFile.objects.create(file=file, file_type=file.content_type)
            uploaded_files.append(file_obj)

            if file.name.endswith('.txt'):
                text = file.read().decode('utf-8')
                file_obj.text_content = text
                extracted_text += f"\nContent from {file.name}: {text}"

            elif file.name.endswith('.pdf'):
                try:
                    # --- OCR Integration ---
                    # Use OCR for PDF text extraction
                    images = convert_from_bytes(file.read())
                    pdf_text = ""
                    for img in images:
                        text = pytesseract.image_to_string(img)
                        pdf_text += text + "\n"
                    
                    file_obj.text_content = pdf_text  # Save the extracted text
                    extracted_text += f"\nContent from {file.name} (OCR): {pdf_text}"
                except Exception as e:
                    extracted_text += f"\nError extracting text from {file.name}: {str(e)}"

            file_obj.save()

        links = request.data.get('links', '').split(',') if request.data.get('links') else []
        link_content = ""

        for link in links:
            if link.strip():
                try:
                    response = requests.get(link.strip())
                    link_content += f"\nContent from URL {link}: {response.text[:500]}..."
                except Exception as e:
                    link_content += f"\nFailed to fetch content from URL {link}: {str(e)}"

        enhanced_prompt = prompt
        if extracted_text:
            enhanced_prompt += "\n\nAdditional context from files:" + extracted_text
        if link_content:
            enhanced_prompt += "\n\nAdditional context from links:" + link_content

        print("🔹 Enhanced Prompt:", enhanced_prompt)

        api_key = settings.GEMINI_API_KEY
        api_url = f"{settings.GEMINI_API_URL}?key={api_key}"

        headers = {'Content-Type': 'application/json'}
        payload = {
            "contents": [
                {"parts": [{"text": f"Generate a video script based on the following prompt. The script should be well-structured with sections for introduction, main body, and conclusion. Make it engaging and suitable for a video. Format it nicely with clear section headers. Write it in {language}.\n\nHere's the prompt: {enhanced_prompt}"}]}
            ],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048,
            }
        }

        print("🔹 Sending request to Gemini API...")

        try:
            response = requests.post(api_url, headers=headers, json=payload)
            response.raise_for_status()
            response_data = response.json()
            print("✅ Gemini API Response:", response_data)

            generated_text = response_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')

            if not generated_text:
                return Response({'error': 'Failed to generate script from Gemini API'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            script = Script.objects.create(
                title=title if title else prompt[:50],
                prompt=prompt,
                generated_script=generated_text,
                language=language
            )

            for file_obj in uploaded_files:
                file_obj.script = script
                file_obj.save()

            serializer = ScriptSerializer(script)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Error calling Gemini API: {str(e)}")
            return Response({'error': f'Error calling Gemini API: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(f"❌ Internal Server Error in generate_script: {str(e)}")
        return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)