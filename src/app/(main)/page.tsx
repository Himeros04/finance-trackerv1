import { HeroCard } from "@/components/dashboard/HeroCard";
import { ActionButtons, MonthlyTargets } from "@/components/dashboard/RightPanel";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { ExpenseLimits } from "@/components/dashboard/ExpenseLimits";
import { Search } from "lucide-react";
import { getTransactions, getBudgetGoals, getExpenseBudgets } from "@/actions/data";

export default async function Dashboard() {
  const transactions = await getTransactions();
  const budgetGoals = await getBudgetGoals();
  const expenseBudgets = await getExpenseBudgets();

  return (
    <div className="space-y-6">
      {/* Header / Search */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border-none rounded-full leading-5 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 sm:text-sm shadow-sm"
            placeholder="Search for a transaction"
          />
        </div>
        <h1 className="text-2xl font-bold text-foreground md:hidden">Dashboard</h1>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-6 hidden md:block">Dashboard</h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Row 1: Hero (CashFlow) + Goal Progress */}
        <div className="lg:col-span-2 h-[350px]">
          <HeroCard transactions={transactions} />
        </div>

        <div className="lg:col-span-1 h-[350px]">
          <GoalProgress transactions={transactions} budgetGoals={budgetGoals} />
        </div>

        {/* Row 2: Actions + Targets/Limits (Full Width) */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-[400px]">
          <div className="flex-none h-[80px]">
            <ActionButtons />
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MonthlyTargets budgetGoals={budgetGoals} transactions={transactions} />
              <ExpenseLimits expenseBudgets={expenseBudgets} transactions={transactions} />
            </div>
          </div>
        </div>

        {/* Row 3: Monthly Earnings (Full Width) */}
        <div className="lg:col-span-3 h-[400px]">
          <BalanceChart transactions={transactions} />
        </div>

      </div>
    </div>
  );
}
