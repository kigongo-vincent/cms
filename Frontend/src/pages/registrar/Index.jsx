import {
  Box,
  Paper,
  TextField,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Container,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import {
  PlusOne,
  Save,
  Close,
  ArrowRight,
  School,
  CalendarToday,
  Visibility,
} from "@material-ui/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AddProgramme,
  allProgrammes,
} from "../../model/tools/ProgrammesReducer";
import { getAuthInformation, getYears } from "../../model/tools/AuthReducer";
import { motion } from "framer-motion";

const Index = () => {
  const [open, setOpen] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const [yearTitle, setYearTitle] = useState("");
  const [yearError, setYearError] = useState(false);
  const [yearLoading, setYearLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useSelector(getAuthInformation);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [NOY, setNOY] = useState(3);
  const courses = useSelector(allProgrammes);
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const addProgramme = async () => {
    setLoading(true);
    const response = await fetch(`${auth.URL}/programmes/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        number_of_years: NOY,
      }),
    });

    if (response.status == 201) {
      const data = await response.json();
      dispatch(AddProgramme(data));
      setLoading(false);
      setOpen(false);
    } else {
      setLoading(false);
      setError(true);
    }
  };

  const addAcademicYear = async () => {
    setYearLoading(true);
    const response = await fetch(`${auth.URL}/academic_years/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: yearTitle,
      }),
    });

    if (response.status == 201) {
      dispatch(getYears());
      setYearLoading(false);
      setOpenYear(false);
      setYearTitle("");
    } else {
      setYearLoading(false);
      setYearError(true);
    }
  };

  useEffect(() => {
    dispatch(getYears());
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        {/* Programmes Section */}
        <Paper elevation={0} sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Programmes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage academic programmes and view complaints
              </Typography>
            </Box>
            <Button
              startIcon={<PlusOne />}
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Add Programme
            </Button>
          </Box>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {courses?.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        // border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          transition: "all 0.3s ease-in-out",
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          mb={2}
                        >
                          <School color="primary" />
                          <Typography variant="h6" component="div">
                            {course.name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} mb={2}>
                          <Chip
                            icon={<CalendarToday />}
                            label={`${course.number_of_years} Years`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ px: 1 }}
                          />
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          endIcon={<Visibility />}
                          onClick={() =>
                            navigate(`/registrar/complaints/${course.id}`)
                          }
                        >
                          View Complaints
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Paper>

        {/* Academic Years Section */}
        <Paper elevation={0} sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Academic Years
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage academic years and their status
              </Typography>
            </Box>
            <Button
              startIcon={<PlusOne />}
              variant="contained"
              onClick={() => setOpenYear(true)}
            >
              Add Academic Year
            </Button>
          </Box>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {auth.years?.map((year) => (
                <Grid item xs={12} sm={6} md={4} key={year.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={50}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        // border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          transform: "translateY(-4px)",
                          transition: "all 0.3s ease-in-out",
                        },
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarToday color="secondary" />
                          <Typography variant="h6" component="div">
                            {year.title}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Created: {new Date(year.created).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Paper>
      </Box>

      {/* Add Programme Dialog */}
      <Dialog open={open}>
        <DialogContent>
          <Typography variant="h6" mb={2}>
            Add Programme
          </Typography>
          <TextField
            fullWidth
            label="Programme Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Number of Years"
            type="number"
            value={NOY}
            onChange={(e) => setNOY(parseInt(e.target.value))}
            sx={{ mb: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to add programme
            </Alert>
          )}
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={addProgramme}
              disabled={loading || !name}
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Add Academic Year Dialog */}
      <Dialog open={openYear}>
        <DialogContent>
          <Typography variant="h6" mb={2}>
            Add Academic Year
          </Typography>
          <TextField
            fullWidth
            label="Academic Year Title"
            value={yearTitle}
            onChange={(e) => setYearTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          {yearError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to add academic year
            </Alert>
          )}
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setOpenYear(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={addAcademicYear}
              disabled={yearLoading || !yearTitle}
              startIcon={
                yearLoading ? <CircularProgress size={20} /> : <Save />
              }
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Index;
