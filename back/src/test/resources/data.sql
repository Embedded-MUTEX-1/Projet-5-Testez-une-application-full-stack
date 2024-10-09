INSERT INTO users (
    id, email, last_name, first_name, password, admin, created_at, updated_at
)
VALUES
    (1, 'test1@test.com', 'John', 'Matthew', '$2y$10$oO/j5GGSyHh7Rh59nWdtnejKg0xbPHXvff8OSuF/Y5kUAaZx.968u', false, '2021-10-04 18:09:38.076245', '2021-10-04 18:09:38.076245');

INSERT INTO users (
    id, email, last_name, first_name, password, admin, created_at, updated_at
)
VALUES
    (2, 'test2@test.com', 'Toto', 'Tata', '$2y$10$oO/j5GGSyHh7Rh59nWdtnejKg0xbPHXvff8OSuF/Y5kUAaZx.968u', false, '2021-10-04 18:09:38.076245', '2021-10-04 18:09:38.076245');


INSERT INTO sessions (
    id, name, date, description, teacher_id, created_at, updated_at
)
VALUES
    (1, 'Session', '2024-10-09 15:15:26.946000', 'desc', null, '2021-10-04 18:09:38.076245', '2021-10-04 18:09:38.076245');

INSERT INTO sessions (
    id, name, date, description, teacher_id, created_at, updated_at
)
VALUES
    (2, 'Session', '2024-10-09 15:15:26.946000', 'desc', null, '2021-10-04 18:09:38.076245', '2021-10-04 18:09:38.076245');

INSERT INTO participate (
    session_id, user_id
)
VALUES
    (2, 1);

INSERT INTO teachers (
    id, last_name, first_name, created_at, updated_at
)
VALUES
    (1, 'teacher1', 'teacher1','2021-10-04 18:09:38.076245', '2021-10-04 18:09:38.076245');

INSERT INTO teachers (
    id, last_name, first_name, created_at, updated_at
)
VALUES
    (2, 'teacher2', 'teacher2','2021-10-04 18:09:38.076245', '2021-10-04 18:09:38.076245');
