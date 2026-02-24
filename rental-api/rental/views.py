from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Vehicle, Rental
from .serializers import VehiclesSerializer, RentalSerializer
from .permissions import IsAdminOrReadOnly

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all().order_by("id")
    serializer_class = VehiclesSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["plate", "brand"]
    ordering_fields = ["id", "plate", "brand", "daily_rate"]

class RentalViewSet(viewsets.ModelViewSet):
    queryset = Rental.objects.select_related("vehicle_id").all().order_by("-id")
    serializer_class = RentalSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "vehicle_id"]
    search_fields = ["customer_name", "vehicle__plate", "vehicle__brand"]
    ordering_fields = ["id", "customer_name", "total", "status"]

    def get_permissions(self):
        # Público: SOLO listar vehículos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()