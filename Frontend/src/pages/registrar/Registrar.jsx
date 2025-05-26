import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Navbar from "../../components/Navbar";
import {
  Autocomplete,
  Button,
  Container,
  Dialog,
  DialogContent,
  Fab,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Home, Save } from "@material-ui/icons";
import Complaints from "./Complaints";
import ProgrammeComplaints from "./ProgrammeComplaints";
import { useSelector } from "react-redux";
import { getAuthInformation } from "../../model/tools/AuthReducer";

const Registrar = () => {
  const auth = useSelector(getAuthInformation);
  const navigate = useNavigate();
  const location = useLocation();

  return auth?.user?.role == "registrar" ? (
    <>
      <Navbar />
      <Container sx={{ mt: 12 }}>
        <Routes>
          <Route path="/" Component={Index} />
          <Route path="/complaints/:id" Component={Complaints} />
          <Route
            path="/programme/:id/complaints"
            Component={ProgrammeComplaints}
          />
        </Routes>
      </Container>

      {location.pathname != "/registrar" && (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: "10%", right: "5%" }}
        >
          <IconButton
            onClick={() => navigate("/registrar")}
            className="text-light"
          >
            <Home />
          </IconButton>
        </Fab>
      )}
    </>
  ) : (
    <Navigate to={"/"} />
  );
};

export default Registrar;
