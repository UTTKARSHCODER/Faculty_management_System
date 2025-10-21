from django.contrib import admin

from firstWebsite.modals import Contact, Student_Directory, Faculty, Faculty_participation_data

# Register your models here.
admin.site.register(Contact)
admin.site.register(Student_Directory)
admin.site.register(Faculty)
admin.site.register(Faculty_participation_data)