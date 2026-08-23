-- ============================================================
-- Exam Hub — schéma initial
-- Postgres, SQL brut (aucun ORM)
--
-- Choix de modélisation : une seule table `users` avec une colonne
-- `role` (CHECK IN admin/student) plutôt que deux tables séparées
-- administrateurs/étudiants. Ça garantit "un seul rôle par
-- utilisateur" nativement (contrainte demandée par le sujet) et
-- évite de dupliquer email/mot de passe/authentification sur deux
-- tables. "Matière" = table `courses`, "examen" = table `exams`.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. USERS (administrateurs + étudiants)
-- ------------------------------------------------------------
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'student')),
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,   -- RG-10 / RG-11
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 2. COURSES (matières)
-- ------------------------------------------------------------
CREATE TABLE courses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(50) NOT NULL UNIQUE,        -- ex. PROG2
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 3. EXAMS
-- RG-09 : un cours qui a des examens ne peut pas être supprimé.
-- Pas de ON DELETE CASCADE ici : le comportement par défaut d'une
-- FK (NO ACTION) bloque déjà la suppression du cours tant qu'il a
-- des examens, ce qui applique la règle directement en base.
-- ------------------------------------------------------------
CREATE TABLE exams (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id    UUID NOT NULL REFERENCES courses(id),
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    opens_at     TIMESTAMPTZ NOT NULL,
    closes_at    TIMESTAMPTZ NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT exam_window_valid CHECK (closes_at > opens_at)
);

CREATE INDEX idx_exams_course_id ON exams(course_id);

-- ------------------------------------------------------------
-- 4. QUESTIONS
-- RG-08 (verrouillage dès qu'il y a une tentative) est vérifié
-- côté serveur, pas en base.
-- ------------------------------------------------------------
CREATE TABLE questions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id    UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    statement  TEXT NOT NULL,
    points     NUMERIC(5, 2) NOT NULL CHECK (points > 0),
    position   INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_exam_id ON questions(exam_id);

-- ------------------------------------------------------------
-- 5. CHOICES — 2 à 6 par question (vérifié côté Service),
-- exactement un correct (RG-04), garanti ici en base par un
-- index unique PARTIEL : il ne porte que sur les lignes
-- is_correct = TRUE, donc ne peut contenir qu'une ligne par
-- question_id.
-- ------------------------------------------------------------
CREATE TABLE choices (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    label       TEXT NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
    position    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_choices_question_id ON choices(question_id);

CREATE UNIQUE INDEX uq_one_correct_choice_per_question
    ON choices(question_id)
    WHERE is_correct;

-- ------------------------------------------------------------
-- 6. ATTEMPTS
-- RG-02 : un étudiant ne passe un examen qu'une fois, garanti en
-- base par UNIQUE(student_id, exam_id) ET revérifié côté serveur.
-- RG-09 : un examen qui a des tentatives ne peut pas être supprimé
-- -> pas de CASCADE depuis exams, comportement par défaut = blocage.
-- ------------------------------------------------------------
CREATE TABLE attempts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID NOT NULL REFERENCES users(id),
    exam_id      UUID NOT NULL REFERENCES exams(id),
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ,                 -- NULL tant que non soumis
    score        NUMERIC(6, 2),               -- calculé côté serveur (RG-06)
    CONSTRAINT uq_one_attempt_per_student_per_exam UNIQUE (student_id, exam_id)
);

CREATE INDEX idx_attempts_exam_id ON attempts(exam_id);
CREATE INDEX idx_attempts_student_id ON attempts(student_id);

-- ------------------------------------------------------------
-- 7. ANSWERS
-- RG-05 : une question sans réponse vaut 0 -> choice_id nullable.
-- ------------------------------------------------------------
CREATE TABLE answers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id  UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    choice_id   UUID REFERENCES choices(id),
    CONSTRAINT uq_one_answer_per_question_per_attempt UNIQUE (attempt_id, question_id)
);

CREATE INDEX idx_answers_attempt_id ON answers(attempt_id);

-- ------------------------------------------------------------
-- updated_at automatique
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
