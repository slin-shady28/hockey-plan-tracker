import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { validatePlanRequest } from './middleware/validate';
import { handleGeneratePlan } from './routes/generatePlan';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/generate-plan', validatePlanRequest, handleGeneratePlan);

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

export { app };
