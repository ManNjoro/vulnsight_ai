from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from .serializers import PredictionResultsSerializer
from .predict import run_prediction
from rest_framework.pagination import PageNumberPagination

# Create your views here.

from .utils import parse_uploaded_file

class PredictionResultsView(APIView):
    serializer_class = PredictionResultsSerializer
    pagination_class = PageNumberPagination

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)

            uploaded_file = serializer.validated_data["file"]

            # Parse file
            df = parse_uploaded_file(uploaded_file)
            print(df.head())

            
            preds, probs = run_prediction(df)

            df["prediction"] = preds
            df["risk_probability"] = probs

            # Format response
            results = df[["cve_id", "prediction", "risk_probability"]].to_dict(
                orient="records"
            )

            return Response(
                {
                    "success": True,
                    "total_items": len(results),
                    "results": results,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
