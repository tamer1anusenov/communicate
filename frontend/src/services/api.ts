import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    inn: string;
    phone: string;
    role: 'PATIENT' | 'DOCTOR';
    specialization?: string;
    education?: string;
    experience?: string;
    description?: string;
    address?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Doctor endpoints
export const doctors = {
  getAll: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  getBySpecialization: async (specialization: string) => {
    const response = await api.get(`/doctors/specialization/${specialization}`);
    return response.data;
  },

  getAvailableSlots: async (doctorId: string, date: string) => {
    const response = await api.get(`/time-slots/available/${doctorId}`, {
      params: { date },
    });
    return response.data;
  },

  getAllTimeSlots: async (doctorId: string, date?: string) => {
    const params = date ? { date } : {};
    const response = await api.get(`/time-slots/doctor/${doctorId}`, { params });
    return response.data;
  },

  generateTimeSlots: async (doctorId: string, days: number = 1) => {
    const response = await api.post(`/time-slots/generate-days/${doctorId}`, { days });
    return response.data;
  },

  updateSlotStatus: async (slotId: string, status: 'AVAILABLE' | 'UNAVAILABLE') => {
    const response = await api.put(`/time-slots/${slotId}/status`, { status });
    return response.data;
  },

  markMultipleSlotsAsUnavailable: async (slotIds: string[]) => {
    const response = await api.post('/time-slots/unavailable', { slotIds });
    return response.data;
  },
};

// Appointment endpoints
export const appointments = {
  book: async (appointmentData: {
    patientId: string;
    doctorId: string;
    timeSlotId: string;
    notes?: string;
  }) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getMyAppointments: async (userId: string, role: 'PATIENT' | 'DOCTOR') => {
    const endpoint = role === 'PATIENT' 
      ? `/appointments/patient/${userId}` 
      : `/appointments/doctor/${userId}`;
    const response = await api.get(endpoint);
    return response.data;
  },

  getAllAppointments: async (filters?: {
    doctorId?: string;
    patientId?: string;
    status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => {
    const response = await api.get('/appointments', { params: filters });
    return response.data;
  },

  updateStatus: async (appointmentId: string, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') => {
    const response = await api.put(`/appointments/${appointmentId}/status`, { status });
    return response.data;
  },

  getById: async (appointmentId: string) => {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  },

  cancel: async (appointmentId: string) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, { status: 'CANCELLED' });
    return response.data;
  },

  delete: async (appointmentId: string) => {
    const response = await api.delete(`/appointments/${appointmentId}`);
    return response.data;
  },

  addNotes: async (appointmentId: string, notes: string) => {
    const response = await api.put(`/appointments/${appointmentId}/notes`, { notes });
    return response.data;
  },
};

// Test result endpoints
export const testResults = {
  getMyResults: async (patientId: string) => {
    const response = await api.get(`/test-results/patient/${patientId}`);
    return response.data;
  },

  getResultById: async (resultId: string) => {
    const response = await api.get(`/test-results/${resultId}`);
    return response.data;
  },

  create: async (testData: {
    patientId: string;
    doctorId: string;
    testName: string;
    result: string;
    description?: string;
  }) => {
    const response = await api.post('/test-results', testData);
    return response.data;
  },
};

// Profile endpoints
export const profile = {
  get: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  update: async (profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/profile/password', passwordData);
    return response.data;
  },
};

export default api;