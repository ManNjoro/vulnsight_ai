from django_filters.rest_framework import FilterSet
from .models import PredictionResult

class PredictionResultsFilter(FilterSet):
  class Meta:
    model = PredictionResult
    fields = {
      'prediction': ['exact'],
    }