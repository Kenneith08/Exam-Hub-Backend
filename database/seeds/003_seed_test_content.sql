INSERT INTO courses (id, code, name, description) VALUES
  ('0b3acd0b-255a-44f1-80b1-151c0e216716', 'PROG2', 'Programmation 2', 'Programmation orientée objet en Java'),
  ('bd568fe3-94ba-4eeb-968e-528dcdbb71aa', 'RESEAU1', 'Réseaux 1', 'Notions de base des réseaux et du modèle OSI')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exams (id, course_id, title, description, opens_at, closes_at) VALUES
  ('bb5075f1-d2dd-430d-8747-853a016aaf44', '0b3acd0b-255a-44f1-80b1-151c0e216716',
   'QCM Programmation 2 — Contrôle 1', 'Bases de la POO en Java',
   now() - interval '1 hour', now() + interval '7 days'),
  ('76f370b2-d985-4fe5-addf-fe7191523c54', 'bd568fe3-94ba-4eeb-968e-528dcdbb71aa',
   'QCM Réseaux 1 — Partiel', 'Modèle OSI et protocoles de base',
   now() - interval '10 days', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (id, exam_id, statement, points, position) VALUES
  ('81bd4cb5-dd5f-40df-92e0-35dae9728e39', 'bb5075f1-d2dd-430d-8747-853a016aaf44',
   'Quelle est la complexité de la recherche dichotomique sur un tableau trié ?', 2, 0),
  ('547c67ed-76bb-430d-8b8f-bff473570519', 'bb5075f1-d2dd-430d-8747-853a016aaf44',
   'Quel mot-clé permet à une classe Java d''hériter d''une autre classe ?', 2, 1),
  ('15d74cd7-100d-455c-b5c1-5f2ba90f9cc4', 'bb5075f1-d2dd-430d-8747-853a016aaf44',
   'Que renvoie une méthode Java déclarée avec le type de retour "void" ?', 2, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO choices (id, question_id, label, is_correct, position) VALUES
  ('a1e62c7a-0c3d-40e3-8178-7ee49580a33d', '81bd4cb5-dd5f-40df-92e0-35dae9728e39', 'O(n)', FALSE, 0),
  ('46c39e72-b210-45c5-8a1c-4f2abd39a867', '81bd4cb5-dd5f-40df-92e0-35dae9728e39', 'O(log n)', TRUE, 1),
  ('ac79d30f-2ef0-4d16-9243-e1c884855e64', '81bd4cb5-dd5f-40df-92e0-35dae9728e39', 'O(n²)', FALSE, 2),
  ('cde3fa59-6865-4d23-a662-c7e4a45bd54c', '81bd4cb5-dd5f-40df-92e0-35dae9728e39', 'O(1)', FALSE, 3),

  ('631a0e9f-5008-4e4e-97ac-3d57376010ec', '547c67ed-76bb-430d-8b8f-bff473570519', 'implements', FALSE, 0),
  ('e55d49fe-3b91-4f81-ba16-939f36643cb5', '547c67ed-76bb-430d-8b8f-bff473570519', 'extends', TRUE, 1),
  ('a005eaf9-2b99-4e3e-adc2-d9375e8b00af', '547c67ed-76bb-430d-8b8f-bff473570519', 'inherits', FALSE, 2),
  ('3882f52b-110a-4c4a-8b96-129e232a8a78', '547c67ed-76bb-430d-8b8f-bff473570519', 'super', FALSE, 3),

  ('1ca5c435-9d36-4e48-b714-ff73c5116f5d', '15d74cd7-100d-455c-b5c1-5f2ba90f9cc4', 'Rien, la méthode ne renvoie aucune valeur', TRUE, 0),
  ('299b1948-c8ff-4042-9443-9a77ae745f0f', '15d74cd7-100d-455c-b5c1-5f2ba90f9cc4', '0', FALSE, 1),
  ('a23ff50e-eab9-4bdb-b620-9122d50bedc0', '15d74cd7-100d-455c-b5c1-5f2ba90f9cc4', 'null', FALSE, 2),
  ('77ef1a4f-1c14-4add-b77c-fb1f1fa3ba77', '15d74cd7-100d-455c-b5c1-5f2ba90f9cc4', 'Une exception', FALSE, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO questions (id, exam_id, statement, points, position) VALUES
  ('53ccf660-b173-4a1f-9648-3515833b93c1', '76f370b2-d985-4fe5-addf-fe7191523c54',
   'Quel protocole permet de résoudre un nom de domaine en adresse IP ?', 3, 0),
  ('e4ea15f4-24fa-4749-a5fc-ef622d1e46f1', '76f370b2-d985-4fe5-addf-fe7191523c54',
   'Dans le modèle OSI, quelle couche gère l''adressage IP et le routage ?', 2, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO choices (id, question_id, label, is_correct, position) VALUES
  ('c9072c46-6ac2-493f-b121-354eea1ace31', '53ccf660-b173-4a1f-9648-3515833b93c1', 'DNS', TRUE, 0),
  ('bb2c2c83-8414-4043-8809-2c8f2a82ab06', '53ccf660-b173-4a1f-9648-3515833b93c1', 'HTTP', FALSE, 1),
  ('db6b98f5-759b-4658-bf84-f8d4c0629f26', '53ccf660-b173-4a1f-9648-3515833b93c1', 'FTP', FALSE, 2),
  ('e069a82e-cf63-4108-8f42-715198916b8a', '53ccf660-b173-4a1f-9648-3515833b93c1', 'SMTP', FALSE, 3),

  ('6fdde326-c1f0-4c79-beef-b69aee948df8', 'e4ea15f4-24fa-4749-a5fc-ef622d1e46f1', 'Couche physique', FALSE, 0),
  ('98781b0f-4b56-4b90-996f-805a5b1b9b89', 'e4ea15f4-24fa-4749-a5fc-ef622d1e46f1', 'Couche réseau', TRUE, 1),
  ('a40c8c65-8ef1-4ef5-b3be-c73acd6e0a57', 'e4ea15f4-24fa-4749-a5fc-ef622d1e46f1', 'Couche transport', FALSE, 2),
  ('c10cad30-469b-4628-8357-5cdb9e48b6b1', 'e4ea15f4-24fa-4749-a5fc-ef622d1e46f1', 'Couche application', FALSE, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO attempts (id, student_id, exam_id, started_at, submitted_at, score)
SELECT 'eebe42fd-09c7-4ba0-a80f-1460f67f2886', id, '76f370b2-d985-4fe5-addf-fe7191523c54',
       now() - interval '5 days', now() - interval '5 days' + interval '12 minutes', 3
FROM users WHERE email = 'rina@hei.mg'
ON CONFLICT (student_id, exam_id) DO NOTHING;

INSERT INTO attempts (id, student_id, exam_id, started_at, submitted_at, score)
SELECT '1a0f2943-1871-4d99-8fc5-a1c4a562e248', id, '76f370b2-d985-4fe5-addf-fe7191523c54',
       now() - interval '4 days', now() - interval '4 days' + interval '9 minutes', 5
FROM users WHERE email = 'tojo@hei.mg'
ON CONFLICT (student_id, exam_id) DO NOTHING;

INSERT INTO answers (attempt_id, question_id, choice_id) VALUES
  ('eebe42fd-09c7-4ba0-a80f-1460f67f2886', '53ccf660-b173-4a1f-9648-3515833b93c1', 'c9072c46-6ac2-493f-b121-354eea1ace31'), -- Rina : DNS (correct)
  ('eebe42fd-09c7-4ba0-a80f-1460f67f2886', 'e4ea15f4-24fa-4749-a5fc-ef622d1e46f1', 'a40c8c65-8ef1-4ef5-b3be-c73acd6e0a57'), -- Rina : Couche transport (faux)

  ('1a0f2943-1871-4d99-8fc5-a1c4a562e248', '53ccf660-b173-4a1f-9648-3515833b93c1', 'c9072c46-6ac2-493f-b121-354eea1ace31'), -- Tojo : DNS (correct)
  ('1a0f2943-1871-4d99-8fc5-a1c4a562e248', 'e4ea15f4-24fa-4749-a5fc-ef622d1e46f1', '98781b0f-4b56-4b90-996f-805a5b1b9b89')  -- Tojo : Couche réseau (correct)
ON CONFLICT (attempt_id, question_id) DO NOTHING;
