from django.contrib import admin

from races.models import Race


@admin.register(Race)
class RaceAdmin(admin.ModelAdmin):
    list_display = ("name", "date", "location")
    search_fields = ("name",)
