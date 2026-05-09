const corsConfig = {
  origin: process.env.CLIENT || "http://localhost:5173",
  credentials: true,
};

export default corsConfig;