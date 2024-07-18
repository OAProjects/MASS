import express from "express";
import userRoutes from "./routes/userRoutes";
import patientRoutes from "./routes/patientRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import cors from "cors";
import { authenticateToken } from "./middleware/authMiddleware";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", authenticateToken, appointmentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
