from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from .serializers import PredictionResultsSerializer, DashboardSummarySerializer
from .predict import run_prediction
from .pagination import ResultsPagination
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .filters import PredictionResultsFilter
from django.db.models import Count
from django.utils.timezone import localtime

# Create your views here.

from .utils import parse_uploaded_file

from .models import PredictionResult
from .serializers import PredictionResultSerializer

class PredictionResultsView(APIView):
    serializer_class = PredictionResultsSerializer

    def post(self, request):
        try:
            # Validate incoming file
            upload_serializer = PredictionResultsSerializer(data=request.data)
            upload_serializer.is_valid(raise_exception=True)

            uploaded_file = upload_serializer.validated_data["file"]

            # Parse uploaded CSV/XLSX
            df = parse_uploaded_file(uploaded_file)

            # Run model inference
            preds, probs = run_prediction(df)

            df["prediction"] = preds
            df["risk_probability"] = probs

            # Save each row to DB
            filename = uploaded_file.name

            # saved_records = []
            prediction_results = [
                PredictionResult(
                    cve_id=row["cve_id"],
                    prediction=row["prediction"],
                    risk_probability=row["risk_probability"],
                    original_filename=filename
                ) for _, row in df.iterrows()
            ]

            PredictionResult.objects.bulk_create(prediction_results)
            # for _, row in df.iterrows():
            #     obj = PredictionResult.objects.create(
            #         cve_id=row["cve_id"],
            #         prediction=row["prediction"],
            #         risk_probability=row["risk_probability"],
            #         original_filename=filename
            #     )
            #     saved_records.append(obj)

            # Prepare response
            # results = [
            #     {
            #         "cve_id": r.cve_id,
            #         "prediction": r.prediction,
            #         "risk_probability": r.risk_probability
            #     }
            #     for r in saved_records
            # ]

            return Response({
                "success": True,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)


class PredictionListView(ListAPIView):
    queryset = PredictionResult.objects.all().order_by("-uploaded_at")
    serializer_class = PredictionResultSerializer
    pagination_class = ResultsPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['cve_id', 'original_filename']
    filterset_class = PredictionResultsFilter

class DashboardSummaryView(APIView):

    def get(self, request):
        qs = PredictionResult.objects.all().order_by("-uploaded_at")

        total = qs.count()
        high_risk = qs.filter(prediction=1).count()
        low_risk = qs.filter(prediction=0).count()

        latest = qs.first().uploaded_at if qs.exists() else None

        # Risk distribution
        risk_dist = [
            {"name": "High Risk", "value": high_risk},
            {"name": "Low Risk", "value": low_risk},
        ]

        # Predictions over time (group by day)
        daily = (
            qs.extra({"day": "date(uploaded_at)"})
              .values("day")
              .annotate(count=Count("id"))
              .order_by("day")
        )

        time_data = [
            {
                "date": localtime(d["day"]).strftime("%b %d"),
                "count": d["count"]
            }
            for d in daily
        ]

        summary = {
            "total_predictions": total,
            "high_risk": high_risk,
            "low_risk": low_risk,
            "latest_upload": latest,
            "risk_distribution": risk_dist,
            "predictions_over_time": time_data,
        }

        serializer = DashboardSummarySerializer(summary)
        return Response(serializer.data, status=status.HTTP_200_OK)