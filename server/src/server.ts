import express from 'express';
import routes from "./routes/routes";
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/users", routes);
app.use("/patients", routes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
