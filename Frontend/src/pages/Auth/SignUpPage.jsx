import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../../assets/svgs/muk.svg";
import { ArrowRight } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { getAuthInformation, SignUp } from "../../model/tools/AuthReducer";
import { motion, AnimatePresence } from "framer-motion";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    registrationNumber: "",
    studentNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector(getAuthInformation);

  // Show success message if redirected from somewhere
  const [successMessage, setSuccessMessage] = useState(location.state?.message);

  useEffect(() => {
    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      dispatch({
        type: "auth/setError",
        payload: "Passwords do not match",
      });
      return;
    }

    if (formData.password.length < 8) {
      dispatch({
        type: "auth/setError",
        payload: "Password must be at least 8 characters long",
      });
      return;
    }

    try {
      const result = await dispatch(SignUp(formData)).unwrap();
      // After successful signup and auto-login, redirect to the appropriate dashboard
      const intendedDestination =
        location.state?.from || `/${result.data.user.role}`;
      navigate(intendedDestination, { replace: true });
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        style={{ width: "100%", height: "100%" }}
      >
        <Box
          height={"100vh"}
          width={"100vw"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          bgcolor="background.default"
        >
          <Container maxWidth={"sm"}>
            <Paper
              className="p-5 rounded text-center"
              elevation={0}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <img src={Logo} alt="Logo" style={{ width: "100px" }} />
                <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                  Create Account
                </Typography>

                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {successMessage}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ... rest of the form ... */}
              </motion.div>
            </Paper>
          </Container>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUpPage;
