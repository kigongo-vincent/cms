from django.contrib import admin

from .models import Programme, User, Course, AcademicYear, Notification, MissingMarksComplaint, RegistrationComplaint

admin.site.register(Programme)
admin.site.register(User)
admin.site.register(Course)
admin.site.register(MissingMarksComplaint)
admin.site.register(RegistrationComplaint)
admin.site.register(Notification)
admin.site.register(AcademicYear)
