'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Transaction, Category, Tag, BudgetGoal, ExpenseBudget } from '@/types'

export async function getTransactions() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((t: any) => ({
        ...t,
        entityName: t.entity_name,
    })) as Transaction[]
}

export async function getCategories(type?: 'Income' | 'Expense') {
    const supabase = await createClient()
    let query = supabase
        .from('categories')
        .select('*')
        .order('name')

    if (type) {
        query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data as Category[]
}

export async function getTags() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching tags:', error)
        return []
    }

    return data as Tag[]
}

export async function getBudgetGoals() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('budget_goals')
        .select('*')

    if (error) {
        console.error('Error fetching budget goals:', error)
        return []
    }

    return data.map(bg => ({
        id: bg.id,
        user_id: bg.user_id,
        category: bg.category,
        currentAmount: Number(bg.current_amount),
        targetAmount: Number(bg.target_amount),
        color: bg.color
    })) as BudgetGoal[]
}

export async function addTransaction(formData: FormData) {
    const supabase = await createClient()

    const rawFormData = {
        date: formData.get('date'),
        entity_name: formData.get('entityName'),
        category: formData.get('category'),
        tag: formData.get('tag') || null, // Handle optional tag
        status: formData.get('status'),
        amount: formData.get('amount'),
        amount: formData.get('amount'),
        type: formData.get('type'),
    }

    const isRecurring = formData.get('isRecurring') === 'true';
    const frequency = formData.get('frequency') as 'Monthly' | 'Yearly' | 'Weekly';

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase.from('transactions').insert({
        ...rawFormData,
        user_id: user.id,
    })

    if (error) {
        console.error('Error adding transaction:', error)
        throw new Error('Failed to add transaction')
    }

    // Handle Recurring Transaction
    if (isRecurring && frequency) {
        const startDate = new Date(rawFormData.date as string);
        let nextRunDate = new Date(startDate);

        if (frequency === 'Monthly') {
            nextRunDate.setMonth(nextRunDate.getMonth() + 1);
        } else if (frequency === 'Yearly') {
            nextRunDate.setFullYear(nextRunDate.getFullYear() + 1);
        } else if (frequency === 'Weekly') {
            nextRunDate.setDate(nextRunDate.getDate() + 7);
        }

        const { error: recurringError } = await supabase.from('recurring_transactions').insert({
            user_id: user.id,
            amount: rawFormData.amount,
            category: rawFormData.category,
            entity_name: rawFormData.entity_name,
            type: rawFormData.type,
            frequency: frequency,
            start_date: rawFormData.date,
            next_run_date: nextRunDate.toISOString().split('T')[0],
            active: true
        });

        if (recurringError) {
            console.error('Error adding recurring transaction:', recurringError);
            // We don't throw here to avoid rolling back the main transaction, 
            // but in a real app we might want a transaction block.
        }
    }

    revalidatePath('/')
    return { success: true }
}

export async function addCategory(name: string, type: 'Income' | 'Expense', targetAmount?: number, color?: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { data: category, error } = await supabase
        .from('categories')
        .insert({ name, type, user_id: user.id })
        .select()
        .single()

    if (error) {
        console.error('Error adding category:', error)
        throw new Error('Failed to add category')
    }

    if (targetAmount && targetAmount > 0) {
        if (type === 'Income') {
            // Create Budget Goal
            const { error: goalError } = await supabase.from('budget_goals').insert({
                user_id: user.id,
                category: name,
                target_amount: targetAmount,
                current_amount: 0,
                color: color || '#4318FF' // Use provided color or default
            })
            if (goalError) console.error('Error creating budget goal for new category:', goalError)
        } else {
            // Create Expense Budget
            const { error: budgetError } = await supabase.from('expense_budgets').insert({
                user_id: user.id,
                category: name,
                amount: targetAmount
            })
            if (budgetError) console.error('Error creating expense budget for new category:', budgetError)
        }
    }

    revalidatePath('/add-transaction')
    revalidatePath('/settings')
    revalidatePath('/')
    return { success: true, category }
}

export async function updateCategory(id: string, name: string, type: 'Income' | 'Expense', targetAmount?: number, color?: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Get old category data first
    const { data: oldCategory, error: fetchError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !oldCategory) {
        console.error('Error fetching category to update:', fetchError)
        throw new Error('Failed to fetch category to update')
    }

    // Update category name and type
    const { data: category, error: catError } = await supabase
        .from('categories')
        .update({ name, type })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (catError) {
        console.error('Error updating category:', catError)
        throw new Error('Failed to update category')
    }

    // If name changed, propagate to other tables
    if (oldCategory.name !== name) {
        await supabase.from('budget_goals').update({ category: name }).eq('category', oldCategory.name).eq('user_id', user.id)
        await supabase.from('expense_budgets').update({ category: name }).eq('category', oldCategory.name).eq('user_id', user.id)
        await supabase.from('transactions').update({ category: name }).eq('category', oldCategory.name).eq('user_id', user.id)
    }

    // Handle Budget Goal / Expense Budget updates
    if (type === 'Income') {
        // Remove from expense_budgets if exists (in case type changed)
        await supabase.from('expense_budgets').delete().eq('category', name).eq('user_id', user.id)

        if (targetAmount !== undefined) {
            const { error: goalError } = await supabase.from('budget_goals').upsert({
                user_id: user.id,
                category: name,
                target_amount: targetAmount,
                color: color || '#4318FF'
            }, { onConflict: 'category,user_id' })

            if (goalError) console.error('Error updating budget goal:', goalError)
        }
    } else {
        // Remove from budget_goals if exists
        await supabase.from('budget_goals').delete().eq('category', name).eq('user_id', user.id)

        if (targetAmount !== undefined) {
            const { error: budgetError } = await supabase.from('expense_budgets').upsert({
                user_id: user.id,
                category: name,
                amount: targetAmount
            }, { onConflict: 'category,user_id' })

            if (budgetError) console.error('Error updating expense budget:', budgetError)
        }
    }

    revalidatePath('/add-transaction')
    revalidatePath('/settings')
    revalidatePath('/')
    return { success: true, category }
}

export async function addTag(name: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
        .from('tags')
        .insert({ name, user_id: user.id })
        .select()
        .single()

    if (error) {
        console.error('Error adding tag:', error)
        throw new Error('Failed to add tag')
    }

    revalidatePath('/add-transaction')
    return { success: true, tag: data }
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Convert camelCase to snake_case for DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbUpdates: any = {}
    if (updates.entityName) dbUpdates.entity_name = updates.entityName
    if (updates.date) dbUpdates.date = updates.date
    if (updates.category) dbUpdates.category = updates.category
    if (updates.tag) dbUpdates.tag = updates.tag
    if (updates.status) dbUpdates.status = updates.status
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount
    if (updates.type) dbUpdates.type = updates.type

    const { error } = await supabase
        .from('transactions')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating transaction:', error)
        throw new Error('Failed to update transaction')
    }

    revalidatePath('/')
    revalidatePath('/transactions')
    return { success: true }
}

export async function addBudgetGoal(formData: FormData) {
    const supabase = await createClient()

    const rawFormData = {
        category: formData.get('category'),
        target_amount: formData.get('targetAmount'),
        color: formData.get('color'),
        current_amount: 0, // Initial amount is 0
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase.from('budget_goals').insert({
        ...rawFormData,
        user_id: user.id,
    })

    if (error) {
        console.error('Error adding budget goal:', error)
        throw new Error('Failed to add budget goal')
    }

    revalidatePath('/')
    return { success: true }
}

export async function getExpenseBudgets() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('expense_budgets')
        .select('*')

    if (error) {
        console.error('Error fetching expense budgets:', error)
        return []
    }

    return data as ExpenseBudget[]
}

export async function addExpenseBudget(formData: FormData) {
    const supabase = await createClient()

    const rawFormData = {
        category: formData.get('category'),
        amount: formData.get('amount'),
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase.from('expense_budgets').insert({
        ...rawFormData,
        user_id: user.id,
    })

    if (error) {
        console.error('Error adding expense budget:', error)
        throw new Error('Failed to add expense budget')
    }

    revalidatePath('/')
    revalidatePath('/settings')
    return { success: true }
}

// Delete functions
export async function deleteCategory(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // First get the category to know its name
    const { data: category, error: fetchError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !category) {
        console.error('Error fetching category to delete:', fetchError)
        throw new Error('Failed to fetch category to delete')
    }

    // Delete the category
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting category:', error)
        throw new Error('Failed to delete category')
    }

    // Delete associated Budget Goals and Expense Budgets
    // We do this after (or before) deleting the category. 
    // Since there's no strict FK constraint preventing it, we can do it here.

    // Delete associated Budget Goals and Expense Budgets
    await supabase.from('budget_goals').delete().eq('category', category.name).eq('user_id', user.id)
    await supabase.from('expense_budgets').delete().eq('category', category.name).eq('user_id', user.id)

    // Delete associated Transactions
    await supabase.from('transactions').delete().eq('category', category.name).eq('user_id', user.id)

    revalidatePath('/')
    revalidatePath('/settings')
    revalidatePath('/add-transaction')
    return { success: true }
}

export async function deleteTag(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Get tag name first
    const { data: tag, error: fetchError } = await supabase
        .from('tags')
        .select('name')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !tag) {
        console.error('Error fetching tag to delete:', fetchError)
        throw new Error('Failed to fetch tag to delete')
    }

    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting tag:', error)
        throw new Error('Failed to delete tag')
    }

    // Remove this tag from any transactions that use it
    await supabase
        .from('transactions')
        .update({ tag: null })
        .eq('tag', tag.name)
        .eq('user_id', user.id)

    revalidatePath('/settings')
    revalidatePath('/add-transaction')
    return { success: true }
}

export async function deleteTransaction(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting transaction:', error)
        throw new Error('Failed to delete transaction')
    }

    revalidatePath('/')
    revalidatePath('/transactions')
    return { success: true }
}

export async function getDueRecurringTransactions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .lte('next_run_date', today)

    if (error) {
        console.error('Error fetching due recurring transactions:', error)
        return []
    }

    return data
}

export async function processRecurringTransaction(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    // Get the recurring transaction
    const { data: recurring, error: fetchError } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !recurring) {
        throw new Error('Recurring transaction not found')
    }

    // Insert new transaction
    const { error: insertError } = await supabase.from('transactions').insert({
        user_id: user.id,
        date: recurring.next_run_date, // Use the scheduled date
        entity_name: recurring.entity_name,
        category: recurring.category,
        amount: recurring.amount,
        type: recurring.type,
        status: recurring.type === 'Income' ? 'To bill' : 'To pay'
    })

    if (insertError) {
        console.error('Error generating transaction:', insertError)
        throw new Error('Failed to generate transaction')
    }

    // Calculate next run date
    const currentRunDate = new Date(recurring.next_run_date)
    let nextRunDate = new Date(currentRunDate)

    if (recurring.frequency === 'Monthly') {
        nextRunDate.setMonth(nextRunDate.getMonth() + 1)
    } else if (recurring.frequency === 'Yearly') {
        nextRunDate.setFullYear(nextRunDate.getFullYear() + 1)
    } else if (recurring.frequency === 'Weekly') {
        nextRunDate.setDate(nextRunDate.getDate() + 7)
    }

    // Update recurring transaction
    const { error: updateError } = await supabase
        .from('recurring_transactions')
        .update({
            last_run_date: recurring.next_run_date,
            next_run_date: nextRunDate.toISOString().split('T')[0]
        })
        .eq('id', id)

    if (updateError) {
        console.error('Error updating recurring transaction:', updateError)
        throw new Error('Failed to update recurring transaction')
    }

    revalidatePath('/')
    return { success: true }
}
