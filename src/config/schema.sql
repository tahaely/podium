-- Database Schema

CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50) DEFAULT '#000000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    user_id INT UNIQUE, -- Link to users table
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- e.g., 'leader', 'member' within the team context
    avatar_url VARCHAR(255),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    member_id INT, -- Assigned member
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INT DEFAULT 0,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('todo', 'doing', 'done', 'validated') DEFAULT 'todo',
    deadline TIMESTAMP NULL,
    proof_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    validated_at TIMESTAMP NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS points_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    member_id INT NOT NULL,
    task_id INT,
    points_added INT NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);
