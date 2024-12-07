from django.contrib import admin

from dream.models import Dream, Comment, Contribution


admin.site.register(Dream)
admin.site.register(Comment)
admin.site.register(Contribution)
