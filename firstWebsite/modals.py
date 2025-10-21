from django.core.validators import validate_email, EmailValidator
from django.db import models
from django.db.models import DO_NOTHING


class Contact(models.Model):
    first_name = models.CharField(max_length=122)
    last_name = models.CharField(max_length=122)
    email = models.CharField(max_length=122)
    feedback = models.CharField(max_length=122)

class Student_Directory(models.Model):
    name = models.CharField(max_length=100)
    batch = models.CharField(max_length=100,default='Unknown')
    roll_no = models.CharField(max_length=100)
    college_id = models.CharField(max_length=20)
    email = models.EmailField(max_length=254)
    student_phone_no = models.CharField(max_length=10)
    parent_phone_no = models.CharField(max_length=10)
    address = models.TextField()

    def __str__(self):
        return self.name

class Role(models.TextChoices):
    FACULTY = "FA", "Faculty",
    ADMIN = "AD", "Admin",
    SUPERADMIN = "SPA", "Superadmin"

class Status(models.TextChoices):
    REGISTERED = "R", "Registered",
    NOTREGISTERED = "NR", "NotRegistered"

class Faculty(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    emp_id = models.IntegerField()
    department = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=10)
    role = models.CharField(
        max_length=3,
        choices=Role.choices,
        default=Role.FACULTY
    )
    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.NOTREGISTERED
    )

    def __str__(self):
        return self.email

class accept(models.TextChoices):
    YES = "y", "Yes",
    NO = "N", "No"

class level(models.TextChoices):
    NATIONAL = "Na", "National",
    INTERNATIONAL = "In", "International"

class mode(models.TextChoices):
    ONLINE = "On", "Online",
    OFFLINE = "Of", "Offline"

class Faculty_participation_data(models.Model):
    top = models.CharField(max_length=100,default='Unknown')
    mode = models.CharField(
        max_length=2,
        choices=mode.choices
    )
    level = models.CharField(
        max_length=2,
        choices=level.choices
    )
    organizer = models.CharField(max_length=100)
    sponsors = models.CharField(max_length=100)
    approval = models.CharField(
        max_length=1,
        choices=accept.choices
    )
    begi_date = models.DateField()
    end_date = models.DateField()
    session = models.CharField(max_length=50)
    no_of_days = models.IntegerField()
    proof_enclosed = models.CharField(
        max_length=1,
        choices=accept.choices
    )
    proof_file = models.FileField(upload_to='uploads/')
    email = models.ForeignKey(Faculty,on_delete=DO_NOTHING)

    def __str__(self):
        return self.top