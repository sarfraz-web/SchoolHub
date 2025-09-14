// Mock API service for localStorage operations
const STORAGE_KEYS = {
  USERS: 'sms_users',
  STUDENTS: 'sms_students',
  ATTENDANCE: 'sms_attendance',
  EXAMS: 'sms_exams',
  MARKS: 'sms_marks',
  NOTICES: 'sms_notices',
  FEES: 'sms_fees',
  TOKEN: 'sms_token'
};

// Generate a simple JWT-like token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

// Decode token
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

// Generic CRUD operations
const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// User operations
export const userApi = {
  login: (email, password) => {
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const token = generateToken(user);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      return { success: true, user, token };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  register: (userData) => {
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    
    const token = generateToken(newUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    
    return { success: true, user: newUser, token };
  },

  getCurrentUser: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return null;
    
    const decoded = decodeToken(token);
    if (!decoded || decoded.exp < Date.now()) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      return null;
    }
    
    const users = getFromStorage(STORAGE_KEYS.USERS);
    return users.find(u => u.id === decoded.id);
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

// Student operations
export const studentApi = {
  getAll: () => getFromStorage(STORAGE_KEYS.STUDENTS),
  
  getById: (id) => {
    const students = getFromStorage(STORAGE_KEYS.STUDENTS);
    return students.find(s => s.id === id);
  },
  
  create: (studentData) => {
    const students = getFromStorage(STORAGE_KEYS.STUDENTS);
    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
      createdAt: new Date().toISOString()
    };
    students.push(newStudent);
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
    return newStudent;
  },
  
  update: (id, studentData) => {
    const students = getFromStorage(STORAGE_KEYS.STUDENTS);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
      saveToStorage(STORAGE_KEYS.STUDENTS, students);
      return students[index];
    }
    return null;
  },
  
  delete: (id) => {
    const students = getFromStorage(STORAGE_KEYS.STUDENTS);
    const filtered = students.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.STUDENTS, filtered);
    return true;
  }
};

// Attendance operations
export const attendanceApi = {
  getAll: () => getFromStorage(STORAGE_KEYS.ATTENDANCE),
  
  getByStudent: (studentId) => {
    const attendance = getFromStorage(STORAGE_KEYS.ATTENDANCE);
    return attendance.filter(a => a.studentId === studentId);
  },
  
  markAttendance: (attendanceData) => {
    const attendance = getFromStorage(STORAGE_KEYS.ATTENDANCE);
    const existingIndex = attendance.findIndex(
      a => a.studentId === attendanceData.studentId && a.date === attendanceData.date
    );
    
    if (existingIndex !== -1) {
      attendance[existingIndex] = { ...attendance[existingIndex], ...attendanceData };
    } else {
      attendance.push({
        id: Date.now().toString(),
        ...attendanceData,
        createdAt: new Date().toISOString()
      });
    }
    
    saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance);
    return true;
  }
};

// Exam operations
export const examApi = {
  getAll: () => getFromStorage(STORAGE_KEYS.EXAMS),
  
  create: (examData) => {
    const exams = getFromStorage(STORAGE_KEYS.EXAMS);
    const newExam = {
      id: Date.now().toString(),
      ...examData,
      createdAt: new Date().toISOString()
    };
    exams.push(newExam);
    saveToStorage(STORAGE_KEYS.EXAMS, exams);
    return newExam;
  },
  
  update: (id, examData) => {
    const exams = getFromStorage(STORAGE_KEYS.EXAMS);
    const index = exams.findIndex(e => e.id === id);
    if (index !== -1) {
      exams[index] = { ...exams[index], ...examData };
      saveToStorage(STORAGE_KEYS.EXAMS, exams);
      return exams[index];
    }
    return null;
  },
  
  delete: (id) => {
    const exams = getFromStorage(STORAGE_KEYS.EXAMS);
    const filtered = exams.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.EXAMS, filtered);
    return true;
  }
};

// Marks operations
export const marksApi = {
  getAll: () => getFromStorage(STORAGE_KEYS.MARKS),
  
  getByStudent: (studentId) => {
    const marks = getFromStorage(STORAGE_KEYS.MARKS);
    return marks.filter(m => m.studentId === studentId);
  },
  
  getByExam: (examId) => {
    const marks = getFromStorage(STORAGE_KEYS.MARKS);
    return marks.filter(m => m.examId === examId);
  },
  
  create: (marksData) => {
    const marks = getFromStorage(STORAGE_KEYS.MARKS);
    const existingIndex = marks.findIndex(
      m => m.studentId === marksData.studentId && m.examId === marksData.examId
    );
    
    if (existingIndex !== -1) {
      marks[existingIndex] = { ...marks[existingIndex], ...marksData };
    } else {
      marks.push({
        id: Date.now().toString(),
        ...marksData,
        createdAt: new Date().toISOString()
      });
    }
    
    saveToStorage(STORAGE_KEYS.MARKS, marks);
    return true;
  }
};

// Notice operations
export const noticeApi = {
  getAll: () => getFromStorage(STORAGE_KEYS.NOTICES),
  
  create: (noticeData) => {
    const notices = getFromStorage(STORAGE_KEYS.NOTICES);
    const newNotice = {
      id: Date.now().toString(),
      ...noticeData,
      createdAt: new Date().toISOString()
    };
    notices.push(newNotice);
    saveToStorage(STORAGE_KEYS.NOTICES, notices);
    return newNotice;
  },
  
  update: (id, noticeData) => {
    const notices = getFromStorage(STORAGE_KEYS.NOTICES);
    const index = notices.findIndex(n => n.id === id);
    if (index !== -1) {
      notices[index] = { ...notices[index], ...noticeData };
      saveToStorage(STORAGE_KEYS.NOTICES, notices);
      return notices[index];
    }
    return null;
  },
  
  delete: (id) => {
    const notices = getFromStorage(STORAGE_KEYS.NOTICES);
    const filtered = notices.filter(n => n.id !== id);
    saveToStorage(STORAGE_KEYS.NOTICES, filtered);
    return true;
  }
};

// Fees operations
export const feesApi = {
  getAll: () => getFromStorage(STORAGE_KEYS.FEES),
  
  getByStudent: (studentId) => {
    const fees = getFromStorage(STORAGE_KEYS.FEES);
    return fees.filter(f => f.studentId === studentId);
  },
  
  create: (feesData) => {
    const fees = getFromStorage(STORAGE_KEYS.FEES);
    const newFee = {
      id: Date.now().toString(),
      ...feesData,
      createdAt: new Date().toISOString()
    };
    fees.push(newFee);
    saveToStorage(STORAGE_KEYS.FEES, fees);
    return newFee;
  },
  
  markAsPaid: (id) => {
    const fees = getFromStorage(STORAGE_KEYS.FEES);
    const index = fees.findIndex(f => f.id === id);
    if (index !== -1) {
      fees[index].isPaid = true;
      fees[index].paidAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.FEES, fees);
      return fees[index];
    }
    return null;
  }
};

// Initialize demo data
export const initializeDemoData = () => {
  // Demo users
  const demoUsers = [
    {
      id: '1',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
      phone: '123-456-7890'
    },
    {
      id: '2',
      email: 'teacher@school.com',
      password: 'teacher123',
      role: 'teacher',
      name: 'John Teacher',
      phone: '123-456-7891',
      subject: 'Mathematics'
    },
    {
      id: '3',
      email: 'student@school.com',
      password: 'student123',
      role: 'student',
      name: 'Alice Student',
      phone: '123-456-7892',
      studentId: 'STU001',
      class: 'Grade 10',
      parentEmail: 'parent@school.com'
    },
    {
      id: '4',
      email: 'parent@school.com',
      password: 'parent123',
      role: 'parent',
      name: 'Bob Parent',
      phone: '123-456-7893',
      studentEmail: 'student@school.com'
    }
  ];

  // Demo students
  const demoStudents = [
    {
      id: '1',
      name: 'Alice Student',
      email: 'student@school.com',
      studentId: 'STU001',
      class: 'Grade 10',
      phone: '123-456-7892',
      address: '123 Main St, City',
      parentName: 'Bob Parent',
      parentEmail: 'parent@school.com',
      parentPhone: '123-456-7893',
      dateOfBirth: '2008-05-15',
      admissionDate: '2023-09-01'
    },
    {
      id: '2',
      name: 'Charlie Brown',
      email: 'charlie@school.com',
      studentId: 'STU002',
      class: 'Grade 9',
      phone: '123-456-7894',
      address: '456 Oak Ave, City',
      parentName: 'Jane Brown',
      parentEmail: 'jane@school.com',
      parentPhone: '123-456-7895',
      dateOfBirth: '2009-03-22',
      admissionDate: '2023-09-01'
    }
  ];

  // Demo notices
  const demoNotices = [
    {
      id: '1',
      title: 'School Holiday Notice',
      content: 'School will be closed on December 25th for Christmas holiday.',
      priority: 'high',
      targetRoles: ['all'],
      createdBy: '1'
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting',
      content: 'Parent-teacher meeting scheduled for next Friday at 2 PM.',
      priority: 'medium',
      targetRoles: ['parent', 'teacher'],
      createdBy: '1'
    }
  ];

  // Demo fees
  const demoFees = [
    {
      id: '1',
      studentId: '1',
      studentName: 'Alice Student',
      description: 'Monthly Tuition Fee',
      amount: 500,
      dueDate: '2024-01-15',
      isPaid: false
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Charlie Brown',
      description: 'Monthly Tuition Fee',
      amount: 500,
      dueDate: '2024-01-15',
      isPaid: true,
      paidAt: '2024-01-10T10:30:00Z'
    }
  ];

  // Initialize data if not exists
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, demoUsers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    saveToStorage(STORAGE_KEYS.STUDENTS, demoStudents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
    saveToStorage(STORAGE_KEYS.NOTICES, demoNotices);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEES)) {
    saveToStorage(STORAGE_KEYS.FEES, demoFees);
  }
};
