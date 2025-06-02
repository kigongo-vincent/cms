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
import { ArrowRight, Close } from "@material-ui/icons";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  getAuthInformation,
  SignUp,
  SignIn,
  removeAuthError,
} from "../../model/tools/AuthReducer";
import { motion, AnimatePresence } from "framer-motion";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(getAuthInformation);

  const validateEmail = (email) => {
    const allowedDomains = ["students.mak.ac.ug", "cit.mak.ac.ug"];
    const domain = email.split("@")[1];
    if (!email) {
      return "Email is required";
    }
    if (!allowedDomains.includes(domain)) {
      return "Email must be from students.mak.ac.ug or cit.mak.ac.ug";
    }
    return "";
  };

  const validatePassword = (password) => {
    const errors = [];
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)"
      );
    }
    return errors.join(". ");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError =
      password !== confirmPassword ? "Passwords do not match" : "";

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);

    // If there are any validation errors, don't submit
    if (
      emailValidationError ||
      passwordValidationError ||
      confirmPasswordValidationError
    ) {
      return;
    }

    try {
      // First sign up
      const signupResult = await dispatch(SignUp({ email, password })).unwrap();

      // Then sign in to get the tokens
      const signinResult = await dispatch(SignIn({ email, password })).unwrap();

      // Navigate to the appropriate dashboard
      navigate(`/${signinResult.data.user.role}`, { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      // Error is handled by the reducer
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
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
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src={Logo}
                alt="Makerere University Logo"
                style={{
                  width: "180px",
                  height: "auto",
                  marginBottom: "1rem",
                  filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mt: 2,
                    mb: 1,
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                >
                  Create Account
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Sign up to get started with your account
                </Typography>
              </motion.div>

              <form
                onSubmit={handleSubmit}
                autoComplete="off"
                onClick={() => console.log("Form clicked")}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <TextField
                    value={email}
                    onChange={handleEmailChange}
                    error={!!emailError}
                    helperText={
                      emailError ||
                      "Enter your email address (students.mak.ac.ug or cit.mak.ac.ug)"
                    }
                    label="Email"
                    type="email"
                    required
                    fullWidth
                    className="mt-4"
                    autoComplete="off"
                    disabled={auth.loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderWidth: "1px",
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <TextField
                    value={password}
                    onChange={handlePasswordChange}
                    error={!!passwordError}
                    helperText={
                      passwordError || "Enter a password (minimum 8 characters)"
                    }
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    fullWidth
                    className="mt-4"
                    autoComplete="new-password"
                    disabled={auth.loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderWidth: "1px",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={auth.loading}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <TextField
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={!!confirmPasswordError}
                    helperText={confirmPasswordError || "Confirm your password"}
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    fullWidth
                    className="mt-4"
                    autoComplete="new-password"
                    disabled={auth.loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderWidth: "1px",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            disabled={auth.loading}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Button
                    type="submit"
                    disabled={auth.loading}
                    variant="contained"
                    size="large"
                    fullWidth
                    disableElevation
                    sx={{ mt: 3 }}
                    endIcon={<ArrowRight />}
                    onClick={() => console.log("Button clicked")}
                  >
                    {auth.loading ? <CircularProgress size={20} /> : "Sign Up"}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{" "}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/login", { replace: true });
                        }}
                        sx={{ textDecoration: "none" }}
                      >
                        Sign In
                      </Link>
                    </Typography>
                  </Box>
                </motion.div>
              </form>

              <AnimatePresence>
                {auth.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      severity="error"
                      sx={{ mt: 3 }}
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => dispatch(removeAuthError())}
                        >
                          <Close fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      {auth.error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </Paper>
          </Container>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUpPage;
