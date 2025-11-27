-- ============================================
-- SCRIPT SQL POUR DÉSACTIVER RLS
-- ============================================
-- Exécutez ce script APRÈS avoir créé les tables
-- pour désactiver la sécurité Row Level Security
-- (car vous êtes seul à utiliser l'app, pas besoin de RLS)
-- ============================================

ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE budget_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE expense_budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
