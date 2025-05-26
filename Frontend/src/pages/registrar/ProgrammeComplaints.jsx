import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close,
  Search,
  FilterList,
  School,
  Person,
  CalendarToday,
  Assignment,
} from "@material-ui/icons";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthInformation } from "../../model/tools/AuthReducer";
import { motion, AnimatePresence } from "framer-motion";

const ProgrammeComplaints = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector(getAuthInformation);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(`${auth.URL}/reg_complaints/${id}`);
        if (response.ok) {
          const data = await response.json();
          setComplaints(data);
        } else {
          setError("Failed to fetch complaints");
        }
      } catch (err) {
        setError("An error occurred while fetching complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [id, auth.URL]);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.registration_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      complaint.student_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || complaint.status === filterStatus;

    const matchesYear = filterYear === "all" || complaint.year === filterYear;

    return matchesSearch && matchesStatus && matchesYear;
  });

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "resolved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" gutterBottom>
              Programme Complaints
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage student complaints
            </Typography>
          </Box>
          <IconButton onClick={() => navigate(-1)}>
            <Close />
          </IconButton>
        </Box>

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  value={filterYear}
                  label="Academic Year"
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <MenuItem value="all">All Years</MenuItem>
                  {[...new Set(complaints.map((c) => c.year))].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Complaints Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredComplaints.map((complaint) => (
                <Grid item xs={12} md={6} key={complaint.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          transform: "translateY(-4px)",
                          transition: "all 0.3s ease-in-out",
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Typography variant="h6" component="div">
                              {complaint.subject}
                            </Typography>
                            <Chip
                              label={complaint.status}
                              color={getStatusColor(complaint.status)}
                              size="small"
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            {complaint.details}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            gap={1}
                          >
                            <Chip
                              icon={<Person />}
                              label={`${complaint.registration_number}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<School />}
                              label={`Year ${complaint.year_of_study}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<CalendarToday />}
                              label={complaint.year}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>

                          <Typography variant="caption" color="text.secondary">
                            Submitted:{" "}
                            {new Date(complaint.created).toLocaleString()}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {filteredComplaints.length === 0 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <Typography color="text.secondary">
                No complaints found matching your criteria
              </Typography>
            </Box>
          )}
        </motion.div>
      </Box>
    </Container>
  );
};

export default ProgrammeComplaints;
