from rest_framework.response import Response
from rest_framework.views import APIView

from productAPI.services.report_service import ReportService
from productAPI.serializers.report_serializer import CategoryCountReportSerializer


class CategoryCountReportController(APIView):

    def get(self, request):

        min_count = request.GET.get("min_count")
        max_count = request.GET.get("max_count")

        data = ReportService.get_category_count_report(
            min_count=int(min_count) if min_count else None,
            max_count=int(max_count) if max_count else None
        )

        serializer = CategoryCountReportSerializer(
            data,
            many=True
        )

        return Response(serializer.data)