// Defines the tools (function-calling schema + implementations) available
// to the STAFF chat assistant. Each implementation is scoped to the
// current request's tenant models (req.tenantModels), so a staff member
// at one school can never see another school's data.

export const chatToolDefinitions = [
  {
    type: "function",
    function: {
      name: "get_dashboard_stats",
      description: "Get overall school stats: total students, teachers, classes, and notices.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "search_students",
      description:
        "Search for students by name or admission number. Returns a short list of matches with their class and status.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Name or admission number to search for" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_student_attendance_summary",
      description:
        "Get a specific student's attendance summary (present/absent/late/excused counts and attendance percentage). Requires the student's admission number.",
      parameters: {
        type: "object",
        properties: {
          admissionNumber: { type: "string", description: "The student's admission number" },
        },
        required: ["admissionNumber"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_student_fee_status",
      description:
        "Get a specific student's fee records (amount due, amount paid, status per term). Requires the student's admission number.",
      parameters: {
        type: "object",
        properties: {
          admissionNumber: { type: "string", description: "The student's admission number" },
        },
        required: ["admissionNumber"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_overdue_fees",
      description: "List all fee records across the school that are currently overdue or pending.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "list_recent_notices",
      description: "List the most recent school notices/announcements.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
];

export const buildChatToolImplementations = (tenantModels) => {
  const { Student, Teacher, ClassRoom, Notice, Attendance, Fee } = tenantModels;

  const findStudentByAdmissionNumber = async (admissionNumber) => {
    if (!admissionNumber) return null;
    return Student.findOne({ admissionNumber: new RegExp(`^${admissionNumber}$`, "i") }).populate(
      "classRoom",
      "name section"
    );
  };

  return {
    get_dashboard_stats: async () => {
      const [studentCount, teacherCount, classCount, noticeCount] = await Promise.all([
        Student.countDocuments(),
        Teacher.countDocuments(),
        ClassRoom.countDocuments(),
        Notice.countDocuments(),
      ]);
      return { studentCount, teacherCount, classCount, noticeCount };
    },

    search_students: async ({ query }) => {
      const students = await Student.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { admissionNumber: { $regex: query, $options: "i" } },
        ],
      })
        .populate("classRoom", "name section")
        .limit(10);

      return students.map((s) => ({
        admissionNumber: s.admissionNumber,
        name: `${s.firstName} ${s.lastName}`,
        class: s.classRoom ? `${s.classRoom.name} - ${s.classRoom.section}` : "Unassigned",
        status: s.status,
      }));
    },

    get_student_attendance_summary: async ({ admissionNumber }) => {
      const student = await findStudentByAdmissionNumber(admissionNumber);
      if (!student) return { error: "No student found with that admission number" };

      const records = await Attendance.find({ student: student._id });
      const total = records.length;
      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      const late = records.filter((r) => r.status === "late").length;
      const excused = records.filter((r) => r.status === "excused").length;
      const percentage = total ? ((present / total) * 100).toFixed(1) : "0.0";

      return {
        student: `${student.firstName} ${student.lastName}`,
        totalRecords: total,
        present,
        absent,
        late,
        excused,
        attendancePercentage: percentage,
      };
    },

    get_student_fee_status: async ({ admissionNumber }) => {
      const student = await findStudentByAdmissionNumber(admissionNumber);
      if (!student) return { error: "No student found with that admission number" };

      const fees = await Fee.find({ student: student._id });
      return {
        student: `${student.firstName} ${student.lastName}`,
        fees: fees.map((f) => ({
          term: f.term,
          academicYear: f.academicYear,
          amountDue: f.amountDue,
          amountPaid: f.amountPaid,
          status: f.status,
        })),
      };
    },

    list_overdue_fees: async () => {
      const fees = await Fee.find({ status: { $in: ["overdue", "pending"] } }).populate(
        "student",
        "firstName lastName admissionNumber"
      );
      return fees.slice(0, 20).map((f) => ({
        student: f.student ? `${f.student.firstName} ${f.student.lastName}` : "Unknown",
        admissionNumber: f.student?.admissionNumber,
        term: f.term,
        amountDue: f.amountDue,
        amountPaid: f.amountPaid,
        status: f.status,
      }));
    },

    list_recent_notices: async () => {
      const notices = await Notice.find().sort({ pinned: -1, createdAt: -1 }).limit(5);
      return notices.map((n) => ({
        title: n.title,
        audience: n.audience,
        pinned: n.pinned,
        postedAt: n.createdAt,
      }));
    },
  };
};
