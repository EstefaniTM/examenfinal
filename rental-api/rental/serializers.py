from rest_framework import serializers
from .models import Vehicle, Rental

class VehiclesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ["id", "plate", "brand", "daily_rate", "is_available"]

class RentalSerializer(serializers.ModelSerializer):
    vehicles_nombre = serializers.CharField(source="vehicles.nombre", read_only=True)

    class Meta:
        model = Rental
        fields = ["id", "vehicle_id", "customer_name", "total", "status", "vehicles_nombre"]