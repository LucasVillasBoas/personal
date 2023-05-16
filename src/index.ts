import "dotenv/config";
import express, { NextFunction } from "express";
import usersRoutes from "routes/UserRoute";
import accountRoutes from "routes/AccountRoute";
import addressRoutes from "routes/AddressRoute";
import onboardingRoutes from "routes/OnboardingRoute";
import { authOnboarding } from "middlewares/auth";
import { DateTime } from "luxon";
import loginRoutes from "routes/loginRoutes";

DateTime.local().setZone("America/Sao_Paulo");

const app = express();


app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello World");
});


app.use("/users", usersRoutes);
app.use("/account", accountRoutes);
app.use("/address", addressRoutes);
app.use("/onboarding", onboardingRoutes);
app.use("/login", loginRoutes);

app.listen(process.env.PORT || 3344);