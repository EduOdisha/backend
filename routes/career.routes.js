import express from 'express';

const router = express.Router();

const careerData = {
  after10: {
    science: {
      title: 'Science after 10th',
      paths: ['Engineering (PCM)', 'Medical (PCB)', 'Architecture', 'Research'],
      courses: ['Class 11-12 Science', 'Polytechnic Diploma', 'ITI'],
      exams: ['JEE Main', 'NEET', 'OJEE Diploma'],
      salary: 'Entry: ₹3-5 LPA | Mid: ₹6-12 LPA | Senior: ₹15+ LPA',
    },
    commerce: {
      title: 'Commerce after 10th',
      paths: ['CA/CS', 'MBA', 'Banking', 'Finance', 'Economics'],
      courses: ['Class 11-12 Commerce', 'BBA', 'B.Com'],
      exams: ['CUET', 'CA Foundation', 'CLAT'],
      salary: 'Entry: ₹2.5-4 LPA | Mid: ₹5-10 LPA | Senior: ₹12+ LPA',
    },
    arts: {
      title: 'Arts after 10th',
      paths: ['Law', 'Journalism', 'Social Work', 'Teaching', 'Design'],
      courses: ['Class 11-12 Arts', 'BA', 'Mass Communication'],
      exams: ['CUET', 'CLAT', 'NDA'],
      salary: 'Entry: ₹2-3.5 LPA | Mid: ₹4-8 LPA | Senior: ₹10+ LPA',
    },
  },
  after12: {
    engineering: {
      title: 'Engineering after 12th',
      paths: ['B.Tech/BE', 'B.Sc Engineering', 'Integrated M.Tech'],
      courses: ['B.Tech', 'B.Arch', 'B.Plan'],
      exams: ['JEE Main', 'OJEE', 'CUET'],
      salary: 'Entry: ₹3.5-6 LPA | Mid: ₹8-18 LPA | Senior: ₹20+ LPA',
    },
    medical: {
      title: 'Medical after 12th',
      paths: ['MBBS', 'BDS', 'BAMS', 'Nursing', 'Pharmacy', 'Physiotherapy'],
      courses: ['MBBS', 'BDS', 'B.Sc Nursing', 'B.Pharm'],
      exams: ['NEET-UG', 'AIIMS BSc'],
      salary: 'Entry: ₹4-8 LPA | Mid: ₹10-25 LPA | Senior: ₹30+ LPA',
    },
    management: {
      title: 'Management & Commerce after 12th',
      paths: ['BBA', 'B.Com', 'CA', 'CMA', 'Banking'],
      courses: ['BBA', 'B.Com', 'BCA', 'B.Sc Economics'],
      exams: ['CUET', 'IPMAT', 'CA Foundation'],
      salary: 'Entry: ₹3-5 LPA | Mid: ₹7-15 LPA | Senior: ₹20+ LPA',
    },
  }
};

router.get('/', (req, res) => {
  res.json({ success: true, data: careerData });
});

router.get('/after10/:stream', (req, res) => {
  const data = careerData.after10[req.params.stream];
  if (!data) return res.status(404).json({ success: false, message: 'Career path not found' });
  res.json({ success: true, data });
});

router.get('/after12/:field', (req, res) => {
  const data = careerData.after12[req.params.field];
  if (!data) return res.status(404).json({ success: false, message: 'Career path not found' });
  res.json({ success: true, data });
});

export default router;
