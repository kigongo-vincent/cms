import { ArrowRight } from "@material-ui/icons";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/svgs/muk.svg";
import { useEffect } from "react";

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

const SplashScreen = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Only navigate after a delay
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
          sx={{
            minHeight: "100vh",
            width: "100vw",
            backgroundImage: `url(${"https://images.pexels.com/photos/8892/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.28)",
              zIndex: 1,
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              position: "relative",
              zIndex: 2,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ width: "100%", maxWidth: isMobile ? "100%" : "600px" }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 3 : 5,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  component="img"
                  src={Logo}
                  alt="Makerere University Logo"
                  sx={{
                    width: isMobile ? "120px" : "250px",
                    height: "auto",
                    display: "block",
                    margin: "0 auto 2rem",
                  }}
                />

                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    textAlign: "center",
                    mb: 2,
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  Welcome to WBCMS
                </Typography>

                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    textAlign: "center",
                    mb: 3,
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  }}
                >
                  Web-based Complaint Monitoring System
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    mb: 4,
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                  }}
                >
                  A comprehensive platform for managing and tracking academic
                  and administrative complaints at Makerere University.
                  Streamline your complaint process and ensure timely resolution
                  of issues.
                </Typography>

                <Button
                  onClick={() => navigate("/login")}
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<ArrowRight />}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    borderRadius: "8px",
                  }}
                >
                  Get Started
                </Button>
              </Paper>
            </motion.div>
          </Container>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
