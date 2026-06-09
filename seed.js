/**
 * EduOdisha — Full Database Seed Script
 * Seeds: Colleges, Courses, Exams, Scholarships, Users, Leads
 *
 * Run: node seed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import slugify from 'slugify';
import User from './models/User.js';
import College from './models/College.js';
import { Exam, Scholarship, Course, Lead } from './models/index.js';

dotenv.config();

// ─── COLLEGES ────────────────────────────────────────────────────────────────
const COLLEGES = [
  {
    name: 'KIIT University',
    shortName: 'KIIT',
    type: 'Deemed',
    category: 'Engineering',
    location: { city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', address: 'Campus-1, KIIT Road, Patia' },
    established: 1992,
    affiliation: 'Deemed to be University',
    naacGrade: 'A+',
    nirfRanking: 18,
    approvals: ['UGC', 'AICTE', 'NBA'],
    about: 'Kalinga Institute of Industrial Technology (KIIT) is a deemed-to-be university in Bhubaneswar, Odisha, India. Known for its engineering, medical, and management programs with excellent placements.',
    fees: { min: 180000, max: 320000 },
    placements: { averagePackage: 850000, highestPackage: 4500000, placementPercentage: 95, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Microsoft'] },
    facilities: { hostel: true, library: true, sports: true, canteen: true, wifi: true, lab: true, transport: true, medicalFacility: true, gym: true },
    contact: { phone: ['+91 674 2725113'], email: 'contact@kiit.ac.in', website: 'https://kiit.ac.in' },
    isActive: true, isFeatured: true, isVerified: true,
    views: 4820, inquiries: 312,
    rating: { average: 4.5, count: 124, breakdown: { academics: 4.6, infrastructure: 4.7, placements: 4.8, faculty: 4.4, value: 4.2 } },
  },
  {
    name: 'NIT Rourkela',
    shortName: 'NITRKL',
    type: 'Central',
    category: 'Engineering',
    location: { city: 'Rourkela', district: 'Sundargarh', state: 'Odisha', address: 'NIT Campus, Sundargarh' },
    established: 1961,
    affiliation: 'Institute of National Importance',
    naacGrade: 'A+',
    nirfRanking: 23,
    approvals: ['UGC', 'AICTE', 'NBA'],
    about: 'National Institute of Technology Rourkela is one of the premier engineering institutes in India. Established in 1961, it offers UG, PG and PhD programs in engineering and science.',
    fees: { min: 62000, max: 115000 },
    placements: { averagePackage: 1200000, highestPackage: 6800000, placementPercentage: 98, topRecruiters: ['Microsoft', 'Amazon', 'Goldman Sachs', 'Samsung', 'Qualcomm'] },
    facilities: { hostel: true, library: true, sports: true, canteen: true, wifi: true, lab: true, transport: false, medicalFacility: true, gym: true },
    contact: { phone: ['+91 661 2462022'], email: 'info@nitrkl.ac.in', website: 'https://nitrkl.ac.in' },
    isActive: true, isFeatured: true, isVerified: true,
    views: 6130, inquiries: 478,
    rating: { average: 4.7, count: 218, breakdown: { academics: 4.8, infrastructure: 4.6, placements: 4.9, faculty: 4.7, value: 4.5 } },
  },
  {
    name: 'VSSUT Burla',
    shortName: 'VSSUT',
    type: 'Government',
    category: 'Engineering',
    location: { city: 'Sambalpur', district: 'Sambalpur', state: 'Odisha', address: 'Burla, Sambalpur' },
    established: 1956,
    affiliation: 'State University',
    naacGrade: 'B++',
    nirfRanking: 156,
    approvals: ['UGC', 'AICTE'],
    about: 'Veer Surendra Sai University of Technology (VSSUT) is a state-level technical university in Burla, Odisha. It was converted from University College of Engineering, Burla to a full-fledged technical university in 2009.',
    fees: { min: 35000, max: 65000 },
    placements: { averagePackage: 450000, highestPackage: 1800000, placementPercentage: 82, topRecruiters: ['Wipro', 'TCS', 'Infosys', 'NALCO', 'SAIL'] },
    facilities: { hostel: true, library: true, sports: true, canteen: true, wifi: true, lab: true, transport: false, medicalFacility: false, gym: false },
    contact: { phone: ['+91 663 2430211'], email: 'registrar@vssut.ac.in', website: 'https://vssut.ac.in' },
    isActive: true, isFeatured: true, isVerified: true,
    views: 3240, inquiries: 198,
    rating: { average: 4.1, count: 87, breakdown: { academics: 4.2, infrastructure: 3.8, placements: 4.0, faculty: 4.3, value: 4.5 } },
  },
  {
    name: 'Ravenshaw University',
    shortName: 'RU',
    type: 'Government',
    category: 'Other',
    location: { city: 'Cuttack', district: 'Cuttack', state: 'Odisha', address: 'College Square, Cuttack' },
    established: 1868,
    affiliation: 'State University',
    naacGrade: 'A',
    nirfRanking: 98,
    approvals: ['UGC'],
    about: 'Ravenshaw University, established in 1868, is one of the oldest universities in India. It offers programs in Arts, Science, Commerce, and Management. Known for its historical campus and academic excellence.',
    fees: { min: 12000, max: 45000 },
    placements: { averagePackage: 320000, highestPackage: 800000, placementPercentage: 65, topRecruiters: ['ONGC', 'State Govt', 'Banks', 'Teaching'] },
    facilities: { hostel: true, library: true, sports: true, canteen: true, wifi: true, lab: true, transport: false, medicalFacility: false, gym: false },
    contact: { phone: ['+91 671 2301072'], email: 'info@ravenshawuniversity.ac.in', website: 'https://ravenshawuniversity.ac.in' },
    isActive: true, isFeatured: false, isVerified: true,
    views: 2100, inquiries: 130,
    rating: { average: 3.9, count: 64, breakdown: { academics: 4.2, infrastructure: 3.5, placements: 3.4, faculty: 4.1, value: 4.6 } },
  },
  {
    name: 'SOA University',
    shortName: 'SOA',
    type: 'Deemed',
    category: 'Medical',
    location: { city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', address: 'Shiksha Vihar, Kalinga Nagar, Ghatikia' },
    established: 1996,
    affiliation: 'Deemed to be University',
    naacGrade: 'A+',
    nirfRanking: 45,
    approvals: ['UGC', 'AICTE', 'MCI', 'NBA'],
    about: 'Siksha O Anusandhan (SOA) University is a deemed university offering programs in Engineering, Medical, Pharmacy, Nursing, and Management. Renowned for medical programs and research.',
    fees: { min: 85000, max: 1200000 },
    placements: { averagePackage: 600000, highestPackage: 2800000, placementPercentage: 88, topRecruiters: ['Apollo Hospitals', 'AIIMS', 'Fortis', 'Wipro', 'TCS'] },
    facilities: { hostel: true, library: true, sports: true, canteen: true, wifi: true, lab: true, transport: true, medicalFacility: true, gym: true },
    contact: { phone: ['+91 674 2350181'], email: 'info@soauniversity.ac.in', website: 'https://soauniversity.ac.in' },
    isActive: true, isFeatured: true, isVerified: true,
    views: 3980, inquiries: 267,
    rating: { average: 4.3, count: 108, breakdown: { academics: 4.4, infrastructure: 4.5, placements: 4.2, faculty: 4.3, value: 3.9 } },
  },
  {
    name: 'ITER Bhubaneswar',
    shortName: 'ITER',
    type: 'Deemed',
    category: 'Engineering',
    location: { city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', address: 'Jagamara, Khandagiri' },
    established: 1996,
    affiliation: 'SOA University',
    naacGrade: 'A+',
    nirfRanking: 68,
    approvals: ['UGC', 'AICTE', 'NBA'],
    about: 'Institute of Technical Education and Research (ITER) is the engineering college under SOA University. It offers B.Tech, M.Tech, and MCA programs with strong industry connections.',
    fees: { min: 120000, max: 180000 },
    placements: { averagePackage: 650000, highestPackage: 2400000, placementPercentage: 90, topRecruiters: ['Infosys', 'TCS', 'Wipro', 'Cognizant', 'HCL'] },
    facilities: { hostel: true, library: true, sports: true, canteen: true, wifi: true, lab: true, transport: true, medicalFacility: true, gym: false },
    contact: { phone: ['+91 674 2350181'], email: 'iter@soauniversity.ac.in', website: 'https://iter.ac.in' },
    isActive: true, isFeatured: false, isVerified: true,
    views: 2760, inquiries: 185,
    rating: { average: 4.2, count: 92, breakdown: { academics: 4.3, infrastructure: 4.4, placements: 4.3, faculty: 4.1, value: 4.0 } },
  },
  {
    name: 'IIT Bhubaneswar',
    shortName: 'IIT BBS',
    type: 'Central',
    category: 'Engineering',
    location: { city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', address: 'Argul, Jatni' },
    established: 2008,
    affiliation: 'Institute of National Importance',
    naacGrade: 'A',
    nirfRanking: 47,
    approvals: ['UGC', 'AICTE'],
    about: 'Indian Institute of Technology Bhubaneswar is a premier engineering institute established in 2008. Located in Argul, it offers B.Tech, M.Tech, and PhD programs.',
    fees: { min: 100000, max: 200000 },
    placements: { averagePackage: 1650000, highestPackage: 8500000, placementPercentage: 97, topRecruiters: ['Google', 'Amazon', 'Microsoft', 'DE Shaw', 'Uber', 'Flipkart'] },
    facilities: { hostel: true, library: true, sports: true, canteen: true, wifi: true, lab: true, transport: true, medicalFacility: true, gym: true },
    contact: { phone: ['+91 674 7135300'], email: 'admission@iitbbs.ac.in', website: 'https://iitbbs.ac.in' },
    isActive: true, isFeatured: true, isVerified: true,
    views: 7840, inquiries: 542,
    rating: { average: 4.8, count: 156, breakdown: { academics: 4.9, infrastructure: 4.7, placements: 4.9, faculty: 4.8, value: 4.4 } },
  },
  {
    name: 'Utkal University',
    shortName: 'UU',
    type: 'Government',
    category: 'Other',
    location: { city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', address: 'Vani Vihar, Bhubaneswar' },
    established: 1943,
    affiliation: 'State University',
    naacGrade: 'A',
    nirfRanking: 82,
    approvals: ['UGC'],
    about: 'Utkal University, established in 1943, is the oldest university in Odisha. Located in Vani Vihar, Bhubaneswar, it offers programs in Arts, Science, Commerce, and Management.',
    fees: { min: 8000, max: 35000 },
    placements: { averagePackage: 280000, highestPackage: 600000, placementPercentage: 55, topRecruiters: ['Govt Jobs', 'Banking', 'Teaching', 'Civil Services'] },
    facilities: { hostel: true, library: true, sports: false, canteen: true, wifi: false, lab: true, transport: false, medicalFacility: false, gym: false },
    contact: { phone: ['+91 674 2585271'], email: 'registrar@utkaluniversity.ac.in', website: 'https://utkaluniversity.ac.in' },
    isActive: true, isFeatured: false, isVerified: true,
    views: 1680, inquiries: 92,
    rating: { average: 3.7, count: 48, breakdown: { academics: 4.0, infrastructure: 3.2, placements: 3.1, faculty: 4.0, value: 4.8 } },
  },
];

// ─── EXAMS ────────────────────────────────────────────────────────────────────
const EXAMS = [
  {
    name: 'OJEE 2025',
    shortName: 'OJEE',
    type: 'State',
    conductedBy: 'Odisha Joint Entrance Examination Board',
    level: 'Undergraduate (UG)',
    description: 'OJEE (Odisha Joint Entrance Examination) is a state-level entrance test conducted for admission to Lateral Entry B.Tech, MBA, MCA, M.Tech, and M.Pharm programs in Odisha.',
    eligibility: { qualification: '12th passed with PCM', percentage: '45% marks', domicile: 'Odisha domicile preferred' },
    applicationFee: { general: 1000, sc_st: 700 },
    officialWebsite: 'https://ojee.nic.in',
    isActive: true, isFeatured: true, views: 3240,
  },
  {
    name: 'JEE Main 2025',
    shortName: 'JEE Main',
    type: 'National',
    conductedBy: 'National Testing Agency (NTA)',
    level: '12th',
    description: 'Joint Entrance Examination (Main) is a national-level engineering entrance exam for admission to NITs, IIITs, and other centrally funded technical institutions.',
    eligibility: { qualification: '12th with PCM', percentage: '75% for general (65% for reserved)', age: 'No age limit' },
    applicationFee: { general: 950, sc_st: 475 },
    officialWebsite: 'https://jeemain.nta.nic.in',
    isActive: true, isFeatured: true, views: 8920,
  },
  {
    name: 'NEET UG 2025',
    shortName: 'NEET',
    type: 'National',
    conductedBy: 'National Testing Agency (NTA)',
    level: '12th',
    description: 'National Eligibility cum Entrance Test (NEET) is the single entrance test for MBBS, BDS, BAMS, and other medical programs in India.',
    eligibility: { qualification: '12th with PCB', percentage: '50% for general', age: '17–25 years (general)' },
    applicationFee: { general: 1700, sc_st: 1000 },
    officialWebsite: 'https://neet.nta.nic.in',
    isActive: true, isFeatured: true, views: 9840,
  },
  {
    name: 'CUET UG 2025',
    shortName: 'CUET',
    type: 'National',
    conductedBy: 'National Testing Agency (NTA)',
    level: '12th',
    description: 'Common University Entrance Test is mandatory for admission to central universities across India for various UG programs.',
    eligibility: { qualification: '12th passed from any stream', percentage: '50% for general' },
    applicationFee: { general: 750, sc_st: 550 },
    officialWebsite: 'https://cuet.nta.nic.in',
    isActive: true, isFeatured: false, views: 4200,
  },
  {
    name: 'CAT 2025',
    shortName: 'CAT',
    type: 'National',
    conductedBy: 'IIMs (rotating)',
    level: 'Postgraduate (PG)',
    description: 'Common Admission Test is a national-level MBA entrance exam for admission to IIMs and other top management institutions.',
    eligibility: { qualification: 'Bachelor\'s degree', percentage: '50% for general (45% for reserved)' },
    applicationFee: { general: 2400, sc_st: 1200 },
    officialWebsite: 'https://iimcat.ac.in',
    isActive: true, isFeatured: false, views: 3100,
  },
  {
    name: 'OPSC OAS 2025',
    shortName: 'OAS',
    type: 'State',
    conductedBy: 'Odisha Public Service Commission (OPSC)',
    level: 'Undergraduate (UG)',
    description: 'Odisha Administrative Service exam for Group-A and Group-B posts in the Odisha government. Considered one of the most prestigious state exams.',
    eligibility: { qualification: 'Bachelor\'s degree', age: '21–38 years', domicile: 'Odisha domicile required' },
    applicationFee: { general: 500, sc_st: 250 },
    officialWebsite: 'https://opsc.gov.in',
    isActive: true, isFeatured: false, views: 2560,
  },
];

// ─── SCHOLARSHIPS ─────────────────────────────────────────────────────────────
const SCHOLARSHIPS = [
  {
    name: 'Pre Matric Scholarship for OBC Students, Odisha',
    provider: 'Government of Odisha — Social Welfare Department',
    type: 'Government',
    category: 'OBC',
    level: ['Any'],
    amount: { value: 10000, type: 'Annual' },
    description: 'Financial assistance to OBC students studying in Class 1 to 10 in recognized institutions in Odisha.',
    eligibility: { income: 'Annual family income below ₹2.5 lakh', category: ['OBC'], state: 'Odisha' },
    applicationLink: 'https://scholarship.odisha.gov.in',
    isActive: true, isFeatured: true, views: 1240,
  },
  {
    name: 'Post Matric Scholarship for SC/ST Students',
    provider: 'Government of Odisha — SC & ST Development Department',
    type: 'Government',
    category: 'SC/ST',
    level: ['12th', 'Undergraduate (UG)', 'Postgraduate (PG)'],
    amount: { value: 25000, type: 'Annual' },
    description: 'Scholarship for SC/ST students pursuing post-matriculation education in recognized institutions across India.',
    eligibility: { income: 'Annual family income below ₹2.5 lakh', category: ['SC', 'ST'], state: 'Odisha' },
    applicationLink: 'https://scholarship.odisha.gov.in',
    isActive: true, isFeatured: true, views: 2180,
  },
  {
    name: 'OPSC Merit Scholarship 2025',
    provider: 'Odisha Public Service Commission',
    type: 'Government',
    category: 'Merit',
    level: ['Undergraduate (UG)', 'Postgraduate (PG)'],
    amount: { value: 15000, type: 'Annual' },
    description: 'Merit-based scholarship for students who have secured high marks in board exams and are pursuing UG/PG courses in Odisha.',
    eligibility: { percentage: '85% in 12th board', state: 'Odisha' },
    applicationLink: 'https://opsc.gov.in/scholarship',
    isActive: true, isFeatured: true, views: 980,
  },
  {
    name: 'KIIT Merit Scholarship',
    provider: 'KIIT University',
    type: 'University',
    category: 'Merit',
    level: ['Undergraduate (UG)'],
    amount: { value: 50000, type: 'Annual' },
    description: 'Full and partial tuition fee waivers for students securing top ranks in JEE Main, KIITEE, and board examinations.',
    eligibility: { percentage: '90%+ in 12th or top JEE rank' },
    applicationLink: 'https://kiit.ac.in/scholarship',
    isActive: true, isFeatured: false, views: 1560,
  },
  {
    name: 'Prerana Scholarship — Girls in Engineering',
    provider: 'Government of Odisha — Higher Education Dept.',
    type: 'Government',
    category: 'Girls',
    level: ['Undergraduate (UG)'],
    amount: { value: 30000, type: 'Annual' },
    description: 'Scholarship for girl students pursuing B.Tech/B.E. in engineering colleges in Odisha to encourage female participation in STEM.',
    eligibility: { category: ['Girls'], state: 'Odisha', course: ['B.Tech', 'B.E.'] },
    applicationLink: 'https://dheodisha.gov.in',
    isActive: true, isFeatured: true, views: 1820,
  },
];

// ─── COURSES ──────────────────────────────────────────────────────────────────
const COURSES = [
  {
    name: 'Bachelor of Technology (B.Tech)',
    shortName: 'B.Tech',
    level: 'UG',
    stream: 'Engineering',
    duration: '4 Years',
    description: 'B.Tech is a 4-year undergraduate engineering program covering core engineering disciplines with practical training.',
    eligibility: '12th with PCM (Physics, Chemistry, Maths)',
    entranceExams: ['JEE Main', 'OJEE', 'CUET'],
    fees: { min: 35000, max: 320000 },
    careerScope: 'Software Development, Core Engineering, Research, Civil Services',
    jobRoles: ['Software Engineer', 'Data Scientist', 'Mechanical Engineer', 'Civil Engineer'],
    isActive: true, isFeatured: true, views: 5600,
  },
  {
    name: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
    shortName: 'MBBS',
    level: 'UG',
    stream: 'Medical',
    duration: '5.5 Years',
    description: 'MBBS is a 5.5-year undergraduate medical program leading to the degree of Doctor of Medicine and Surgery.',
    eligibility: '12th with PCB (Physics, Chemistry, Biology) and NEET qualification',
    entranceExams: ['NEET UG'],
    fees: { min: 50000, max: 1200000 },
    careerScope: 'Medical Practice, Specialization, Research, Public Health',
    jobRoles: ['General Physician', 'Surgeon', 'Medical Researcher', 'Public Health Officer'],
    isActive: true, isFeatured: true, views: 4200,
  },
  {
    name: 'Master of Business Administration (MBA)',
    shortName: 'MBA',
    level: 'PG',
    stream: 'Management',
    duration: '2 Years',
    description: 'MBA is a 2-year postgraduate management program focusing on business administration, finance, marketing, and leadership.',
    eligibility: "Bachelor's degree in any discipline",
    entranceExams: ['CAT', 'XAT', 'MAT', 'CMAT', 'OJEE'],
    fees: { min: 45000, max: 600000 },
    careerScope: 'Management, Consulting, Finance, Entrepreneurship',
    jobRoles: ['Business Analyst', 'Product Manager', 'Finance Manager', 'Marketing Manager'],
    isActive: true, isFeatured: true, views: 3800,
  },
  {
    name: 'Bachelor of Computer Applications (BCA)',
    shortName: 'BCA',
    level: 'UG',
    stream: 'Engineering',
    duration: '3 Years',
    description: 'BCA is a 3-year undergraduate program covering computer science fundamentals, programming, and software development.',
    eligibility: '12th from any stream (PCM preferred)',
    entranceExams: ['CUET', 'University exams'],
    fees: { min: 20000, max: 120000 },
    careerScope: 'Software Development, IT Support, Web Development, Database Admin',
    jobRoles: ['Software Developer', 'Web Developer', 'System Analyst', 'Database Admin'],
    isActive: true, isFeatured: false, views: 2800,
  },
  {
    name: 'Bachelor of Laws (LLB)',
    shortName: 'LLB',
    level: 'UG',
    stream: 'Other',
    duration: '3 Years',
    description: '3-year law program for graduates (or 5 years integrated BA LLB for 12th students). Covers constitutional, civil, criminal, and corporate law.',
    eligibility: "Bachelor's degree (3-yr LLB) or 12th (5-yr BA LLB)",
    entranceExams: ['CLAT', 'AILET', 'LSAT', 'University exams'],
    fees: { min: 15000, max: 180000 },
    careerScope: 'Legal Practice, Judiciary, Corporate Law, Human Rights',
    jobRoles: ['Advocate', 'Corporate Lawyer', 'Judge', 'Legal Advisor'],
    isActive: true, isFeatured: false, views: 1900,
  },
];

// ─── USERS (students) ─────────────────────────────────────────────────────────
const SAMPLE_USERS = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@student.com', password: 'student123', role: 'student', isEmailVerified: true, isActive: true },
  { name: 'Priya Nayak', email: 'priya.nayak@student.com', password: 'student123', role: 'student', isEmailVerified: true, isActive: true },
  { name: 'Rohan Patra', email: 'rohan.patra@student.com', password: 'student123', role: 'student', isEmailVerified: true, isActive: true },
  { name: 'Suman Dash', email: 'suman.dash@student.com', password: 'student123', role: 'student', isEmailVerified: true, isActive: true },
  { name: 'Ritu Mohapatra', email: 'ritu.mohapatra@student.com', password: 'student123', role: 'student', isEmailVerified: true, isActive: true },
  { name: 'Amit Behera', email: 'amit.behera@counsellor.com', password: 'counsellor123', role: 'counselor', isEmailVerified: true, isActive: true },
];

// ─── LEADS ────────────────────────────────────────────────────────────────────
const SAMPLE_LEADS = [
  { name: 'Subhashree Nayak', phone: '9876543210', email: 'subhashree@gmail.com', interestedCourse: 'B.Tech CSE', preferredCity: 'Bhubaneswar', source: 'Homepage', status: 'New' },
  { name: 'Priyanshu Mohanty', phone: '9812345678', email: 'priyanshu@gmail.com', interestedCourse: 'B.Tech EEE', preferredCity: 'Rourkela', source: 'College Page', status: 'Contacted' },
  { name: 'Ankita Das', phone: '9934567890', email: 'ankita.das@yahoo.com', interestedCourse: 'MBA', preferredCity: 'Bhubaneswar', source: 'Homepage', status: 'In Progress' },
  { name: 'Rajesh Kumar Sahoo', phone: '9845012345', email: 'rajesh.sahoo@gmail.com', interestedCourse: 'MBBS', preferredCity: 'Bhubaneswar', source: 'WhatsApp', status: 'Converted' },
  { name: 'Lipsa Pattnaik', phone: '9765432109', email: 'lipsa.p@gmail.com', interestedCourse: 'BCA', preferredCity: 'Bhubaneswar', source: 'Homepage', status: 'New' },
  { name: 'Deepak Rath', phone: '9823456701', email: 'deepak.rath@outlook.com', interestedCourse: 'B.Tech Mechanical', preferredCity: 'Cuttack', source: 'College Page', status: 'New' },
];

// ─── MAIN SEED FUNCTION ───────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB...\n');

    // ── Admin User ──
    console.log('👤 Seeding admin user...');
    const existing = await User.findOne({ email: 'eduodisha121@gmail.com' });
    if (!existing) {
      await User.create({
        name: 'Super Admin',
        email: 'eduodisha121@gmail.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      });
      console.log('   ✅ Admin created: eduodisha121@gmail.com / admin123');
    } else {
      console.log('   ℹ️  Admin already exists — skipping');
    }

    // ── Sample Users ──
    console.log('\n👥 Seeding sample users...');
    for (const u of SAMPLE_USERS) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`   ✅ ${u.role}: ${u.name}`);
      } else {
        console.log(`   ℹ️  ${u.name} — already exists`);
      }
    }

    // ── Colleges ──
    console.log('\n🏫 Seeding colleges...');
    for (const c of COLLEGES) {
      const exists = await College.findOne({ name: c.name });
      if (!exists) {
        const slug = slugify(c.name, { lower: true, strict: true });
        await College.create({ ...c, slug });
        console.log(`   ✅ ${c.name}`);
      } else {
        const slug = slugify(c.name, { lower: true, strict: true });
        await College.updateOne({ name: c.name }, { ...c, slug });
        console.log(`   🔄 Updated ${c.name}`);
      }
    }

    // ── Exams ──
    console.log('\n📋 Seeding exams...');
    for (const e of EXAMS) {
      const exists = await Exam.findOne({ name: e.name });
      if (!exists) {
        const slug = slugify(e.name, { lower: true, strict: true });
        await Exam.create({ ...e, slug });
        console.log(`   ✅ ${e.name}`);
      } else {
        const slug = slugify(e.name, { lower: true, strict: true });
        await Exam.updateOne({ name: e.name }, { ...e, slug });
        console.log(`   🔄 Updated ${e.name}`);
      }
    }

    // ── Scholarships ──
    console.log('\n🎓 Seeding scholarships...');
    await Scholarship.deleteMany({});
    for (const s of SCHOLARSHIPS) {
      const exists = await Scholarship.findOne({ name: s.name });
      if (!exists) {
        const slug = slugify(s.name, { lower: true, strict: true });
        await Scholarship.create({ ...s, slug });
        console.log(`   ✅ ${s.name}`);
      } else {
        console.log(`   ℹ️  ${s.name} — already exists`);
      }
    }

    // ── Courses ──
    console.log('\n📚 Seeding courses...');
    for (const c of COURSES) {
      const exists = await Course.findOne({ name: c.name });
      if (!exists) {
        const slug = slugify(c.name, { lower: true, strict: true });
        await Course.create({ ...c, slug });
        console.log(`   ✅ ${c.name}`);
      } else {
        const slug = slugify(c.name, { lower: true, strict: true });
        await Course.updateOne({ name: c.name }, { ...c, slug });
        console.log(`   🔄 Updated ${c.name}`);
      }
    }

    // ── Leads ──
    console.log('\n📬 Seeding sample leads...');
    for (const l of SAMPLE_LEADS) {
      const exists = await Lead.findOne({ phone: l.phone });
      if (!exists) {
        await Lead.create(l);
        console.log(`   ✅ Lead: ${l.name}`);
      } else {
        console.log(`   ℹ️  Lead ${l.name} — already exists`);
      }
    }

    console.log('\n✨ Database seeded successfully!\n');
    console.log('─────────────────────────────────────────');
    console.log('  Admin Login: eduodisha121@gmail.com');
    console.log('  Password:    admin123');
    console.log('─────────────────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
