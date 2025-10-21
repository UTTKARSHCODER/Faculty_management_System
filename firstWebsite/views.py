from django.contrib import messages
from django.shortcuts import render, HttpResponse, redirect
from django.urls import reverse
from tablib import Dataset

from MyFirstDjangoWebsite import settings
from firstWebsite.modals import Contact, Faculty, Faculty_participation_data
from .modals import Student_Directory
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .resources import StudentResources

batches = [
    {'batch':'3CS-A','no_of_stu':'64'},
    {'batch':'3CS-B','no_of_stu':'56'},
    {'batch':'3CS-C','no_of_stu':'60'},
    {'batch':'3CS-D','no_of_stu':'62'},
    {'batch':'3CS-E','no_of_stu':'63'},
    {'batch':'3CS-F','no_of_stu':'58'},
    {'batch':'3CS(AI)-A','no_of_stu':'63'},
    {'batch':'3CS(AI)-B','no_of_stu':'51'},
    {'batch':'3CS(DS)-A','no_of_stu':'48'},
    {'batch':'3CS(IOT)-A','no_of_stu':'24'},
    {'batch':'3CS(IOT)-B','no_of_stu':'18'}
]

CLIENT_ID = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
@csrf_exempt
def gsi_verify_login(request):
    """Handles the JWT token received from the Google Sign-In button."""

    global User
    if request.method == 'POST':
        try:

            data = json.loads(request.body)
            id_token_jwt = data.get('id_token')
            users_post = data.get('post_value')

            if not id_token_jwt:
                return JsonResponse({'success': False, 'error': 'No ID token provided.'}, status=400)

            idinfo = id_token.verify_oauth2_token(
                id_token_jwt,
                google_requests.Request(),
                CLIENT_ID  # Use your Client ID here
            )

            email = idinfo.get('email')

            adapter = GoogleOAuth2Adapter(request)
            try:
                if users_post == 'spa' or users_post == 'ad' or users_post == 'fa':
                    User = Faculty
                    user = User.objects.get(email=email,role__iexact=users_post)
                elif users_post == 'student':
                    User = Student_Directory
                    user = User.objects.get(email=email)
                else:
                    User = None
                    user = None
                # If login is successful:
                request.session["secret_key"] = user.email
                request.session['topLeftBar'] = users_post
                return JsonResponse({
                    'success': True,
                    'redirect_url': '/profile'  # Redirect to the home or dashboard page
                })
            except User.DoesNotExist:

                error_message = f"Access denied: The email '{email}' is not authorized to log in."

                # You can optionally add a Django message for standard page rendering
                messages.error(request, error_message)

                return JsonResponse({
                    'success': False,
                    'error': error_message
                }, status=403)

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON body.'}, status=400)
        except Exception as e:
            # Handle user restriction error from your custom allauth adapter, etc.
            return JsonResponse({'success': False, 'error': str(e)}, status=401)

    return JsonResponse({'success': False, 'error': 'Invalid method.'}, status=405)

def save_all_forms(request, pk):
    if request.method == 'POST':
        if pk == 1:
            top = request.POST.get('top')
            mode = request.POST.get('optradio')
            level = request.POST.get('optradio1')
            organizer = request.POST.get('organizer')
            sponser = request.POST.get('sponser')
            approval = request.POST.get('optradio2')
            begi_date = request.POST.get('begi_date')
            end_date = request.POST.get('end_date')
            session = request.POST.get('sessionyear')
            num_of_days = request.POST.get('num_of_days')
            proof_approval = request.POST.get('optradio3')
            proof_file_path = request.FILES.get('proof_file')
            faculty_instance = Faculty.objects.get(email=request.session.get('secret_key'))
            obj1 = Faculty_participation_data(top=top,mode=mode,level=level,organizer=organizer,sponsors=sponser,approval=approval,begi_date=begi_date,end_date=end_date,session=session,no_of_days=num_of_days,proof_enclosed=proof_approval,proof_file=proof_file_path,email=faculty_instance)
            obj1.save()
            return redirect(reverse('success'))
    return render(request, 'about')

def successfulsubmission(request):
    return render(request,'submitSuccess.html')

def upload_excel(request):
    if request.method == 'POST':
        student_resource = StudentResources()
        dataset = Dataset()
        new_students = request.FILES['excel_file']
        imported_data = dataset.load(new_students.read(), format = 'xlsx')
        for data in imported_data:
            value = Student_Directory(*data)

        value.save()
        # messages.success(request,'We are glad to share that your excel file is uploaded successfully!')
        return render(request,'student_directory.html')
    return render(request,'about.html')

def all_forms(request,pk):
    value = request.session.get('topLeftBar')
    if value == 'ad' or value == 'spa' or value == 'fa':
        data = Faculty.objects.get(email=request.session.get('secret_key'))
    elif value == 'student':
        data = Student_Directory.objects.get(email=request.session.get('secret_key'))
    else:
        data = None
    form_number = pk
    secret_key = data
    return render(request,'forms.html',{'form_number': form_number, 'value': secret_key})

def fdp(request):
    forms = [
        {'no': '0', 'form': "Non-teaching Staff Profile Details"},
        {'no': '1', 'form': "Faculty Participation"},
        {'no': '2', 'form': "MOOC's/Short Term Course/Course Completion"},
        {'no': '3', 'form': "Events Organized by Department"},
        {'no': '4', 'form': "Faculty Awards and Achievements"},
        {'no': '5', 'form': "Sponsored Research/Grant Received/Consultancy"},
        {'no': '6', 'form': "Research Publication - Journals"},
        {'no': '7', 'form': "Research Publication - Conference Publication"},
        {'no': '8', 'form': "Research Publication - Book and Book Chapters"},
        {'no': '9', 'form': "Patents"},
        {'no': '10', 'form': "M.Tech/Ph.D Guided"},
        {'no': '11', 'form': "Resource Person"}
    ]
    return render(request, 'fdp_forms.html',context={'values': forms})

def custom_logout(request):
    if 'secret_key' in request.session and 'topLeftBar' in request.session:
        del request.session['secret_key']
        del request.session['topLeftBar']
        return redirect(reverse('home'))
    return redirect(reverse('about'))

stu_data = Student_Directory.objects.all()
# Create your views here.
def index(request):
    context = {'batches':batches}
    return render(request, 'index.html',context = context)

def profile(request):
    if 'secret_key' in request.session and 'topLeftBar' in request.session:
        try:
            modal = request.session.get('topLeftBar')
            if modal == 'ad' or modal == 'spa' or modal == 'fa':
                user = Faculty
            else:
                user = Student_Directory
        except:
            user = None
    value = user.objects.get(email = request.session.get('secret_key'))
    context = {'data': value}
    return render(request,'profile.html', context=context)

def allocated_batches(request):
    context = {'card_data': stu_data}
    return render(request,'allocated_batches.html',context= context)

def student_directory(request):
    stu_data = Student_Directory.objects.all()
    context = {'stu_data': stu_data}
    return render(request,'student_directory.html',context = context)

def about(request):
    return render(request,'about.html')

def stu_card_details(request,pk):
    batch = Student_Directory.objects.filter(batch = pk)
    context = {'stu_data': batch}
    return render(request,'batch_details.html',context=context)

def login_page(request):
    return render(request,'login.html')

def contact(request):
    if request.method == "POST":
        first_name = request.POST.get('fname')
        last_name = request.POST.get('lname')
        email = request.POST.get('email')
        feedback = request.POST.get('feedback')
        contact = Contact(first_name = first_name, last_name = last_name, email = email, feedback = feedback)
        contact.save()
    return HttpResponse("This is contact page")