const corsConfig = {
  origin: process.env.CLIENT || "http://localhost:3000",
  credentials: true,
};

export default corsConfig;