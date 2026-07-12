import {
    registerUser,
    loginUser,
    getAllRoles,
} from "../services/auth.service.js";

export const listRoles = async (req, res) => {
    try {
        const roles = await getAllRoles();

        return res.status(200).json({
            success: true,
            data: roles,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;

        const user = await registerUser(
            name,
            email,
            password,
            role_id
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await loginUser(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: result.token,
            user: result.user,
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message,
        });

    }
};