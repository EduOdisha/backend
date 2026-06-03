export const verificationEmailTemplate = (name, verifyUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #1e3a5f, #0ea5e9); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">EduOdisha</h1>
      <p style="color: #e0f2fe; margin: 5px 0;">Odisha's Smart Education Platform</p>
    </div>
    <div style="padding: 30px; background: #f8fafc;">
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background: #0ea5e9; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">This link expires in 24 hours.</p>
    </div>
  </div>
`;

export const otpEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px;">
    <h2 style="color: #1e3a5f;">Your OTP Code</h2>
    <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
      <p style="font-size: 48px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; margin: 0;">${otp}</p>
    </div>
    <p style="color: #64748b;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
  </div>
`;

export const resetPasswordEmailTemplate = (resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
    <h2>Reset Your Password</h2>
    <p>Click below to reset your password. This link expires in 30 minutes.</p>
    <a href="${resetUrl}" style="background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Reset Password</a>
    <p style="color: #64748b; font-size: 12px;">If you did not request this, ignore this email.</p>
  </div>
`;
