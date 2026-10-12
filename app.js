import express from "express";
import session from "express-session";
import { loadSessionUser } from "./src/middleware/auth.js";
import globalMiddleware from "./src/middleware/global.js";
import Path from "path";
import routes from "./src/routes/router.js";
import pkg from "./package.json" with { type: "json" };
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required.");
}

const app = express();

app.use((req, res, next) => {
  res.locals.appVersion = pkg.version;
  next();
});

app.use(express.static(Path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "src/views"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  }),
);

app.use(loadSessionUser);
app.use(globalMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", routes);

app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: err.stack,
  };

  res.status(status).render(`errors/${template}`, context);
});

export default app;
