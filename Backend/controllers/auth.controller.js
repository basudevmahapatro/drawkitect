import { otpModel } from "../models/otp.model.js";
import { userModel } from "../models/user.model.js"
import { generateOTP, getEmailHTML } from "../utils/utils.js"
import { sendEmail } from "../services/email.service.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../src/config/config.js";
import { sessionModel } from "../models/session.model.js";
import crypto from "crypto"

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    let user = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (user) {
        if (user.verified) return res.status(409).json({ message: "User is already registered and verified. Please proceed to login." });
        else await userModel.deleteMany({ email });
    }

    user = await userModel.create({
        username,
        email,
        password,
    });

    const otp = generateOTP();
    await otpModel.deleteMany({ email });
    await otpModel.create({
        email,
        user: user._id,
        otp: otp
    });

    const html = getEmailHTML({ OTP: otp });
    await sendEmail(email, "Drawkitect - Verify your email", `Your OTP is ${otp}`, html);

    return res.status(201).json({
        message: "User is registered successfully",
        user: {
            username,
            email,
            verified: false
        }
    })
}

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const userOtp = await otpModel.findOne({ email });
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "No such user exists."
        })
    }

    if (user.verified) {
        return res.status(400).json({
            message: "This account is already verified. Please log in."
        });
    }

    if (!userOtp) {
        return res.status(400).json({
            message: "Invalid or expired otp."
        })
    }

    const isValid = await bcrypt.compare(otp, userOtp.otp);
    if (!isValid) {
        return res.status(400).json({
            message: "Invalid otp."
        })
    }

    await userModel.findByIdAndUpdate(user._id, { verified: true });
    await otpModel.deleteMany({ email });

    return res.status(200).json({
        message: "Email verified successfully.",
        user: {
            username: user.username,
            email: user.email,
            verified: true
        }
    });
};

export const resendOtp = async (req, res) => {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "No such user exists."
        });
    }

    if (user.verified) {
        return res.status(400).json({
            message: "This account is already verified. Please log in."
        });
    }

    const otp = generateOTP();
    await otpModel.deleteMany({ email });
    await otpModel.create({
        email,
        user: user._id,
        otp: otp
    });

    const html = getEmailHTML({ OTP: otp });
    await sendEmail(email, "Drawkitect - Verify your email", `Your OTP is ${otp}`, html);

    return res.status(200).json({
        message: "OTP resent successfully.",
        user: {
            username: user.username,
            email: user.email,
            verified: false
        }
    });
};

export const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: "Please provide an email/username and a password." });
    }

    const user = await userModel.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
        return res.status(401).json({
            message: "No such user found. Kindly register."
        });
    }

    if (!user.verified) {
        return res.status(401).json({
            message: "Email is not verified yet. Verify it first."
        });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({
            message: "Incorrect password."
        });
    }

    const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshToken: refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        revoked: false
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    },
        config.JWT_SECRET,
        {
            expiresIn: 60
        });

    res.status(201).json({
        message: "User is logged in successfully",
        user: {
            username: user.username,
            email: user.email,
            _id: user._id
        },
        accessToken
    })
};

export const getMe = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Token not provided"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token."
        });
    }

    const session = await sessionModel.findOne({
        _id: decoded.sessionId,
        revoked: false
    });

    if (!session) {
        return res.status(401).json({
            message: "Session is revoked. Please login again."
        });
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
        return res.status(404).json({
            message: "user not found"
        })
    }

    res.status(201).json({
        message: "user fetched successfully",
        user: {
            username: user.username,
            email: user.email,
            _id: user._id
        }
    });
}

export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({
            "message": "Refresh token is not attached."
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message: "User is not authorised."
        });
    }

    const refreshTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const session = await sessionModel.findOne({
        refreshToken: refreshTokenHash,
        user: decoded.id,
        revoked: false
    });

    if (!session) {
        return res.status(401).json({
            message: "User is not authorised."
        });
    }

    const newRefreshToken = jwt.sign({ id: session.user }, config.JWT_SECRET, { expiresIn: "7d" });
    session.refreshToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    await session.save();
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = jwt.sign({ id: session.user, sessionId: session._id }, config.JWT_SECRET, { expiresIn: 60 });
    res.status(201).json({
        message: "Access token refreshed successfully.",
        accessToken: accessToken
    });
};

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is not attached"
        });
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshToken: refreshTokenHash,
        revoked: false
    });

    if (!session) {
        return res.status(401).json({
            message: "Invalid refresh Token."
        });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    res.status(201).json({
        message: "Logged out successfully"
    });
};

export const logoutAll = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is not attached."
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message: "User is not authorised."
        })
    }

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    },
        {
            revoked: true
        });

    res.clearCookie("refreshToken");

    res.status(201).json({
        message: "User logged out successfully from all devices."
    });
};