USE employee_db;

INSERT INTO department (name)
VALUES ('Sales'), ('Development'), ('Warehouse');

INSERT INTO role (title, salary, department_id)
VALUES ('Jogger', 30000, 3),
  ('Forklift', 35000, 3),
  ('Intern', 40000, 2),
  ('Manager', 60000, 2),
  ('Dev Lead', 100000, 2),
  ('Sales Person', 50000, 1),
  ('Sr Developer', 100000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Manager', 'Man', 4, NULL),
  ('Some', 'college Guy', 3, 1),
  ('Jack', 'Daniels', 5, 1),
  ('James', 'Bond', 7, NULL),
  ('Joe', 'Biden', 2, NULL),
  ('Cheesy', 'Skittles', 1, 5),
  ('Cat', 'Man', 6, NULL);