from productAPI.repositories.report_repository import ReportRepository

class ReportService:
    
    @staticmethod
    def get_category_count_report(min_count=None, max_count=None):
        
        data = ReportRepository.get_category_count()
        
        result = []
        
        for row in data:
            
            count = row["product_count"]
            
            if min_count and count < min_count:
                continue
            
            if max_count and count > max_count:
                continue
            
            result.append(row)
        
        return result
        