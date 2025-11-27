import { getBudgetGoals, getExpenseBudgets, getCategories, getTags } from "@/actions/data";
import SettingsClient from "./client";

export default async function SettingsPage() {
    const [budgetGoals, expenseBudgets, categories, tags] = await Promise.all([
        getBudgetGoals(),
        getExpenseBudgets(),
        getCategories(),
        getTags(),
    ]);

    return (
        <SettingsClient
            budgetGoals={budgetGoals}
            expenseBudgets={expenseBudgets}
            categories={categories}
            tags={tags}
        />
    );
}
