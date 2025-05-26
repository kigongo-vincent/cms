import { ArrowRight, Search } from "@material-ui/icons";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  colors,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getAuthInformation } from "../../model/tools/AuthReducer";
import { AnimatePresence, motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const NotFound = () => {
  const navigate = useNavigate();
  const auth = useSelector(getAuthInformation);

  if (auth?.user?.isLoggedIn) {
    return <Navigate to={`/${auth?.user?.role}`} />;
  }

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
              <Typography variant="h1" sx={{ fontSize: "6rem", mb: 2 }}>
                404
              </Typography>
              <Typography
                variant="h4"
                fontWeight={"light"}
                color={colors.grey[400]}
              >
                404 | Not found
              </Typography>
              <Typography sx={{ my: 1 }}>
                This page is not available on this server
              </Typography>
              <Link to={"/"}>
                <Button
                  variant="outlined"
                  sx={{ mt: 3 }}
                  endIcon={<ArrowRight />}
                >
                  Return to working page
                </Button>
              </Link>
            </Paper>
          </Container>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotFound;
