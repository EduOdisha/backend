import User from '../models/User.js';

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
export const getUserDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedColleges', 'name slug logo location rating fees')
      .populate('savedCourses', 'name slug level stream image')
      .populate('examReminders', 'name slug examDates image type conductedBy');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Unsave college
// @route   POST /api/users/save-college/:id
export const saveCollege = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.savedColleges.indexOf(req.params.id);
    if (idx > -1) {
      user.savedColleges.splice(idx, 1);
    } else {
      user.savedColleges.push(req.params.id);
    }
    await user.save();
    res.json({ success: true, saved: idx === -1, savedColleges: user.savedColleges });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Unsave course
// @route   POST /api/users/save-course/:id
export const saveCourse = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.savedCourses.indexOf(req.params.id);
    if (idx > -1) {
      user.savedCourses.splice(idx, 1);
    } else {
      user.savedCourses.push(req.params.id);
    }
    await user.save();
    res.json({ success: true, saved: idx === -1, savedCourses: user.savedCourses });
  } catch (error) {
    next(error);
  }
};

// @desc    Set/Unset exam reminder
// @route   POST /api/users/exam-reminder/:id
export const examReminder = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.examReminders.indexOf(req.params.id);
    if (idx > -1) {
      user.examReminders.splice(idx, 1);
    } else {
      user.examReminders.push(req.params.id);
    }
    await user.save();
    res.json({ success: true, reminded: idx === -1, examReminders: user.examReminders });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
export const readNotification = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id, 'notifications._id': req.params.id },
      { $set: { 'notifications.$.isRead': true } }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
