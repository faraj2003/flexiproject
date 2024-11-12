const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");

// Teacher Registration
const teacherRegister = async (req, res) => {
  const { name, email, password, role, school, teachSubject, teachSclass } =
    req.body;

  try {
    // Check if the teacher with the same email already exists
    const existingTeacherByEmail = await Teacher.findOne({ email });

    if (existingTeacherByEmail) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Proceed with password hashing and teacher creation
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      role,
      school,
      teachSubject,
      teachSclass,
    });

    // Save the teacher
    let result = await teacher.save();

    // Update the subject with the teacher's ID
    await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });

    // Exclude the password from the result before sending the response
    result.password = undefined; // Don't send the password in the response
    res.status(201).send(result); // 201 for successful resource creation
  } catch (err) {
    console.error(err); // Logging error details for better tracking
    res.status(500).json({ message: "Server error while registering teacher" });
  }
};

// Teacher Login
const teacherLogIn = async (req, res) => {
  try {
    let teacher = await Teacher.findOne({ email: req.body.email })
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");

    if (teacher) {
      const validated = await bcrypt.compare(
        req.body.password,
        teacher.password
      );
      if (validated) {
        teacher.password = undefined;
        res.status(200).send(teacher); // 200 OK response
      } else {
        res.status(400).send({ message: "Invalid password" });
      }
    } else {
      res.status(404).send({ message: "Teacher not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get all Teachers for a specific school
const getTeachers = async (req, res) => {
  try {
    let teachers = await Teacher.find({ school: req.params.id })
      .populate("teachSubject", "subName")
      .populate("teachSclass", "sclassName");

    if (teachers.length > 0) {
      let modifiedTeachers = teachers.map((teacher) => {
        return { ...teacher._doc, password: undefined };
      });
      res.status(200).send(modifiedTeachers);
    } else {
      res.status(404).send({ message: "No teachers found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching teachers" });
  }
};

// Get a single teacher's details
const getTeacherDetail = async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id)
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");

    if (teacher) {
      teacher.password = undefined;
      res.status(200).send(teacher);
    } else {
      res.status(404).send({ message: "No teacher found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching teacher details" });
  }
};

// Update Teacher's Subject
const updateTeacherSubject = async (req, res) => {
  const { teacherId, teachSubject } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teachSubject },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    await Subject.findByIdAndUpdate(teachSubject, {
      teacher: updatedTeacher._id,
    });

    res.status(200).send(updatedTeacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating teacher subject" });
  }
};

// Delete a Teacher
const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    await Subject.updateOne(
      { teacher: deletedTeacher._id, teacher: { $exists: true } },
      { $unset: { teacher: 1 } }
    );

    res.status(200).send(deletedTeacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting teacher" });
  }
};

// Delete Multiple Teachers by School ID
const deleteTeachers = async (req, res) => {
  try {
    const deletedTeachers = await Teacher.find({ school: req.params.id });
    if (!deletedTeachers.length) {
      return res.status(404).send({ message: "No teachers found to delete" });
    }

    await Teacher.deleteMany({ school: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" } }
    );

    res.status(200).send({ message: "Teachers deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting teachers" });
  }
};

// Delete Teachers by Class
const deleteTeachersByClass = async (req, res) => {
  try {
    const deletedTeachers = await Teacher.find({ teachSclass: req.params.id });
    if (!deletedTeachers.length) {
      return res
        .status(404)
        .send({ message: "No teachers found to delete for the class" });
    }

    await Teacher.deleteMany({ teachSclass: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" } }
    );

    res.status(200).send({ message: "Teachers deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting teachers by class" });
  }
};

// Teacher Attendance
const teacherAttendance = async (req, res) => {
  const { status, date } = req.body;

  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating attendance" });
  }
};

module.exports = {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherSubject,
  deleteTeacher,
  deleteTeachers,
  deleteTeachersByClass,
  teacherAttendance,
};
