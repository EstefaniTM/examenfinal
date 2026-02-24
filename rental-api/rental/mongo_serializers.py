from symtable import Class

from rest_framework import serializers

class Action:
        CREATED = "creado"
        UPDATED = "actualizado"
        MAINTENANCE = "mantenimiento"
        DISABLED = "deshabilitado"
        
class Source:
        SYSTEM = "sistema"
        MOBILE_APP = "app_movil"
        

class Event:
        CREATED = "creado"
        PICKED_UP = "recogido"
        RETURNED = "devuelto"
        PAID = "pagado"
        CANCELLED = "cancelado"

class SourceString:
        WEB = "web"
        MOBILE_APP = "app_movil"
        SYSTEM = "sistema"


class Fleet_logSerializer(serializers.Serializer):
    vehicle_id = serializers.CharField(max_length=120)
    action_string = serializers.ChoiceField(choices=[Action.CREATED, Action.UPDATED, Action.MAINTENANCE, Action.DISABLED])
    note_string = serializers.CharField(max_length=255)
    source_string = serializers.ChoiceField(choices=[Source.SYSTEM, Source.MOBILE_APP])

class Rental_eventSerializer(serializers.Serializer):
    rental_id = serializers.CharField(max_length=120)
    event_type_string = serializers.ChoiceField(choices=[Event.CREATED, Event.PICKED_UP, Event.RETURNED, Event.PAID, Event.CANCELLED])
    source_string = serializers.ChoiceField(choices=[SourceString.WEB, SourceString.MOBILE_APP, SourceString.SYSTEM])
    note_string = serializers.CharField(max_length=255)
    created_at = serializers.DateTimeField(required=False)