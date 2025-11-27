import { CashflowCards } from "@/components/analytics/CashflowCards";
import { RevenueTrendChart } from "@/components/analytics/RevenueTrendChart";
import { IncomeDistributionChart } from "@/components/analytics/IncomeDistributionChart";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-[#1B2559]">Revenue Analytics</h1>

            <div className="mb-8">
                <CashflowCards />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                <RevenueTrendChart />
                <IncomeDistributionChart />
            </div>
        </div>
    );
}
