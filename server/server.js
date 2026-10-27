import express from express[G
import cors from cors[G
import dotenv from dotenv[G
import mongoose from mongoose[G

dotenv.config()[G

const app = express()[G
app.use(cors({ origin: true, credentials: true }))[G
app.use(express.json())[G

const MONGODB_URI = mongodb+srv://ahmad1zeinodin_db_user:rmnAeWwG9mgYnxwR@qeshm-db.fuccltc.mongodb.net/qeshmretryWrites=true&w=majority[G
mongoose.connect(MONGODB_URI).then(() => console.log( MongoDB connected)).catch(err => console.error(err))[G

import authRoutes from ./routes/auth.js [G
import skillsRoutes from ./routes/skills.js [G

app.use(/api/auth, authRoutes)[G
app.use(/api/skills, skillsRoutes)[G

const PORT = process.env.PORT || 5000[G
app.listen(PORT, () => console.log( Server running on port ))[G
