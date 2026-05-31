import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

// Helper to send token response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    profile: user.profile,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    token,
    user: userResponse,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, phone, password });

    // Send verification email
    try {
      const verifyToken = user.getEmailVerifyToken();
      await user.save({ validateBeforeSave: false });

      const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
      await sendEmail({
        email: user.email,
        subject: 'EduOdisha - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e3a5f, #0ea5e9); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">EduOdisha</h1>
              <p style="color: #e0f2fe; margin: 5px 0;">Odisha's Smart Education Platform</p>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2>Welcome, ${user.name}!</h2>
              <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background: #0ea5e9; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
              </div>
              <p style="color: #64748b; font-size: 14px;">This link expires in 24 hours.</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
    }

    sendTokenResponse(user, 201, res, 'Registration successful! Please verify your email.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated. Contact support.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedColleges', 'name logo location rating fees slug')
      .populate('savedCourses', 'name slug level stream');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
export const updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profile: req.body.profile,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, message: 'Password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
export const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: 'EduOdisha - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px;">
          <h2 style="color: #1e3a5f;">Your OTP Code</h2>
          <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
            <p style="font-size: 48px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; margin: 0;">${otp}</p>
          </div>
          <p style="color: #64748b;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account with that email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: 'EduOdisha - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
          <h2>Reset Your Password</h2>
          <p>Click below to reset your password. This link expires in 30 minutes.</p>
          <a href="${resetUrl}" style="background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Reset Password</a>
          <p style="color: #64748b; font-size: 12px;">If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const verifyToken = user.getEmailVerifyToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    await sendEmail({
      email: user.email,
      subject: 'EduOdisha - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #0ea5e9); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">EduOdisha</h1>
            <p style="color: #e0f2fe; margin: 5px 0;">Odisha's Smart Education Platform</p>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2>Welcome, ${user.name}!</h2>
            <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: #0ea5e9; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
            </div>
            <p style="color: #64748b; font-size: 14px;">This link expires in 24 hours.</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};