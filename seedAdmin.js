import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB for seeding...');

    const adminEmail = 'admin@eduodisha.com';
    const adminPassword = 'adminpassword123';

    // 2. Check if admin already exists
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log(`ℹ️ Updating existing admin user: ${adminEmail}`);
      user.name = 'Super Admin';
      user.password = adminPassword;
      user.role = 'admin';
      user.isEmailVerified = true;
      user.isActive = true;
      await user.save();
      console.log('✅ Admin user updated with fresh credentials!');
    } else {
      // 3. Create new Admin user
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      });
      console.log('🚀 New Admin user created successfully!');
    }

    console.log(`📧 Login Email: ${adminEmail}`);
    console.log(`🔑 Login Password: ${adminPassword}`);
    console.log('✨ Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();