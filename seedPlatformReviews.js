import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import PlatformReview from './models/PlatformReview.js';

dotenv.config();

const realReviews = [
  {
    email: 'aarav.sharma@student.com',
    rating: 5,
    subRatings: { counselling: 5, information: 5, easeOfUse: 5 },
    usedFor: 'Counselling',
    role: 'B.Tech Aspirant',
    location: 'Bhubaneswar, Odisha',
    title: 'Extremely helpful counselling support!',
    review: 'I was really confused about my OJEE options, but the free counselling session here saved my year. The counsellor was very professional and explained exactly which engineering colleges I could get based on my rank. No pushy sales pitch, just honest guidance.',
    isApproved: true,
    isFeatured: true,
  },
  {
    email: 'priya.nayak@student.com',
    rating: 5,
    subRatings: { counselling: 4, information: 5, easeOfUse: 5 },
    usedFor: 'College Search',
    role: 'Medical Student',
    location: 'Cuttack, Odisha',
    title: 'Clean comparison tool and accurate fee details',
    review: 'Most national sites have outdated fee structures for Odisha medical colleges, but EduOdisha has accurate and verified information. The comparison tool is super smooth, and I could easily compare placements and hostel facilities across 3 colleges.',
    isApproved: true,
    isFeatured: true,
  },
  {
    email: 'rohan.patra@student.com',
    rating: 4,
    subRatings: { counselling: 5, information: 4, easeOfUse: 5 },
    usedFor: 'Scholarship',
    role: 'B.Sc Physics Student',
    location: 'Sambalpur, Odisha',
    title: 'Detailed guide on State Scholarships',
    review: 'The scholarship updates are excellent. I found the Prerana and Post-Matric scholarship eligibility requirements clearly listed. The links and documents list helped me apply without making mistakes.',
    isApproved: true,
    isFeatured: true,
  },
  {
    email: 'suman.dash@student.com',
    rating: 5,
    subRatings: { counselling: 5, information: 5, easeOfUse: 4 },
    usedFor: 'Exam Info',
    role: 'MCA Student',
    location: 'Balasore, Odisha',
    title: 'Highly recommend for OJEE aspirants',
    review: 'The exam countdowns and eligibility details for OJEE and NIMCET are very structured. The counsellors also guided me on how to prepare for the syllabus and select colleges during choice-filling.',
    isApproved: true,
    isFeatured: true,
  },
  {
    email: 'ritu.mohapatra@student.com',
    rating: 5,
    subRatings: { counselling: 5, information: 5, easeOfUse: 5 },
    usedFor: 'Course Selection',
    role: 'Parent',
    location: 'Rourkela, Odisha',
    title: 'Trusted portal for parents too',
    review: 'As a parent, I was worried about my daughter’s admissions. The counsellor called back within hours and guided us through B.Tech vs. BCA options. Excellent service and highly informative website.',
    isApproved: true,
    isFeatured: true,
  }
];

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB for seeding platform reviews...');

    // Clear existing platform reviews
    await PlatformReview.deleteMany({});
    console.log('🗑️  Cleared existing platform reviews.');

    for (const r of realReviews) {
      const user = await User.findOne({ email: r.email });
      if (!user) {
        console.log(`⚠️  User with email ${r.email} not found. Skipping.`);
        continue;
      }
      
      const { email, ...reviewData } = r;
      await PlatformReview.create({
        ...reviewData,
        user: user._id,
      });
      console.log(`✅ Seeded review by ${user.name}`);
    }

    console.log('✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error.message);
    process.exit(1);
  }
};

seedReviews();
