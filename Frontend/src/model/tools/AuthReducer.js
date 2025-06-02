import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Load saved user data from localStorage
const loadSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Validate that we have the minimum required data
      if (parsedUser && parsedUser.tokens && parsedUser.tokens.access) {
        return parsedUser;
      }
    }
  } catch (error) {
    console.error("Error loading saved user:", error);
  }
  return null;
};

const savedUser = loadSavedUser();

const initialState = {
  // URL: "http://localhost:8000",
  URL: "https://tekjuicemail.pythonanywhere.com",
  loading: false,
  error: false,
  is_open: false,
  years: [],
  user: savedUser || {
    isLoggedIn: false,
    username: null,
    email: null,
    programme: null,
    user_id: null,
    has_profile: false,
    registration_number: null,
    student_number: null,
    role: null,
    tokens: {
      access: null,
      refresh: null,
    },
  },
};

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = savedUser?.tokens?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = savedUser?.tokens?.refresh;
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(
          `${initialState.URL}/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const { access } = response.data;
        // Update stored tokens
        if (savedUser) {
          savedUser.tokens.access = access;
          localStorage.setItem("user", JSON.stringify(savedUser));
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const SignIn = createAsyncThunk("auth/signin", async (credentials) => {
  const response = await fetch(initialState.URL + "/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }
  return {
    status: response.status,
    data: data,
  };
});

export const SignUp = createAsyncThunk("auth/signup", async (userData) => {
  const response = await fetch(initialState.URL + "/signup/", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Signup failed");
  }
  return {
    status: response.status,
    data: data,
  };
});

export const getYears = createAsyncThunk("auth/getYears", async () => {
  const response = await fetch(`${initialState.URL}/academic_years`);
  return await response.json();
});

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${initialState.URL}/forgot-password/`,
        { email }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to send reset instructions"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${initialState.URL}/reset-password/${token}/`,
        { password }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to reset password"
      );
    }
  }
);

export const AuthSlice = createSlice({
  initialState,
  name: "AuthSlice",
  reducers: {
    removeAuthError: (state) => {
      state.error = false;
    },
    toggle_is_open: (state) => {
      state.is_open = !state.is_open;
    },
    logout: (state) => {
      state.user = initialState.user;
      state.loading = false;
      state.error = false;
      state.is_open = false;
      state.years = [];
      localStorage.removeItem("user");
      window.location.href = "/login";
    },
    update_profile: (state, action) => {
      state.user.student_number = action.payload.student_number;
      state.user.registration_number = action.payload.registration_number;
      state.user.has_profile = true;
      state.user.programme = action.payload.programme;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    // Sign in
    builder.addCase(SignIn.pending, (state) => {
      state.loading = true;
      state.error = false;
    });

    builder.addCase(SignIn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;

      const userData = {
        email: action.payload.data.user.email,
        registration_number: action.payload.data.user.registration_number,
        student_number: action.payload.data.user.student_number,
        role: action.payload.data.user.role,
        user_id: action.payload.data.user.user_id,
        programme: action.payload.data.user.programme,
        username: action.payload.data.user.email.split("@")[0],
        tokens: {
          access: action.payload.data.access,
          refresh: action.payload.data.refresh,
        },
        has_profile: action.payload.data.user.has_profile === "true",
        isLoggedIn: true,
      };

      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
    });

    builder.addCase(SignIn.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    // Sign up
    builder.addCase(SignUp.pending, (state) => {
      state.loading = true;
      state.error = false;
    });

    builder.addCase(SignUp.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;

      // Automatically sign in the user after successful signup
      const userData = {
        email: action.payload.data.user.email,
        registration_number: action.payload.data.user.registration_number,
        student_number: action.payload.data.user.student_number,
        role: action.payload.data.user.role,
        user_id: action.payload.data.user.user_id,
        programme: action.payload.data.user.programme,
        username: action.payload.data.user.email.split("@")[0],
        tokens: {
          access: action.payload.data.access,
          refresh: action.payload.data.refresh,
        },
        has_profile: action.payload.data.user.has_profile === "true",
        isLoggedIn: true,
      };

      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
    });

    builder.addCase(SignUp.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    builder.addCase(getYears.fulfilled, (state, action) => {
      state.years = action.payload;
    });

    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const getAuthInformation = (state) => state.auth;

export const { removeAuthError, toggle_is_open, logout, update_profile } =
  AuthSlice.actions;

export default AuthSlice.reducer;
