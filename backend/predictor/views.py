from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from .serializers import PredictionResultsSerializer
from .predict import run_prediction
from .pagination import ResultsPagination

# Create your views here.

from .utils import parse_uploaded_file

class PredictionResultsView(APIView):
    serializer_class = PredictionResultsSerializer
    pagination_class = ResultsPagination

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)

            uploaded_file = serializer.validated_data["file"]

            df = parse_uploaded_file(uploaded_file)

            preds, probs = run_prediction(df)

            df["prediction"] = preds
            df["risk_probability"] = probs

            results = df[["cve_id", "prediction", "risk_probability"]].to_dict(
                orient="records"
            )

            # APPLY PAGINATION HERE
            paginator = self.pagination_class()
            paginated_page = paginator.paginate_queryset(results, request)

            return paginator.get_paginated_response(paginated_page)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

