import pool from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

// Public — lets the Register form populate a role dropdown with real
// DB-backed role_id values instead of hardcoding/guessing the seed order.
export const getAllRoles = async () => {
    const result = await pool.query(
        `SELECT id, role_name FROM roles ORDER BY id`
    );
    return result.rows;
};

export const registerUser = async (
    name,
    email,
    password,
    role_id
) => {
    // Check if email already exists
    const existingUser = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const result = await pool.query(
        `INSERT INTO users
        (name, email, password, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role_id, created_at`,
        [name, email, hashedPassword, role_id]
    );

    return result.rows[0];
};

export const loginUser = async (
    email,
    password
) => {

    const result = await pool.query(
        `SELECT
            users.id,
            users.name,
            users.email,
            users.password,
            roles.role_name
        FROM users
        JOIN roles
            ON users.role_id = roles.id
        WHERE users.email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    const isPasswordCorrect = await comparePassword(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken({
        id: user.id,
        role: user.role_name
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role_name
        }
    };
};