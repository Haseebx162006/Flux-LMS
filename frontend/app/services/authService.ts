import api from "./api";

export interface UserData {
  email: string;
  password: string;
  name?: string;
  role?: 'STUDENT' | 'ADMIN';
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: 'STUDENT' | 'ADMIN';
  };
}

/**
 * Sign In user with credentials
 */
export const login = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/signin", userData);
    const { token, user } = response.data;

    if (token && typeof window !== "undefined") {
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    }

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

/**
 * Sign Up new user account
 */
export const signUp = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("SignUp failed:", error);
    throw error;
  }
};

/**
 * Verify OTP sent to user email
 */
export const verifyOtp = async (email: string, otp: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("OTP Verification failed:", error);
    throw error;
  }
};

/**
 * Admin: Fetch all registered users
 */
export const getAllUsers = async (): Promise<ManagedUser[]> => {
  try {
    const response = await api.get<{ users: ManagedUser[] }>("/auth/users");
    return response.data?.users || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

/**
 * Admin: Toggle user block status (Block / Unblock)
 */
export const toggleBlockUser = async (userId: number): Promise<boolean> => {
  try {
    await api.put(`/auth/users/${userId}/block`);
    return true;
  } catch (error) {
    console.error(`Failed to toggle block status for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Request password reset link/OTP
 */
export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

/**
 * Reset password using OTP/Token
 */
export const resetPassword = async (data: ResetPasswordData) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

/**
 * Sign out and clear stored session token
 */
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

/**
 * Get stored session user from localStorage
 */
export const getStoredUser = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};