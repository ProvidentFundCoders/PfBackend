import express from "express";
import registerController from "../controllers/RegisterPageController.js";
import pfControllers from "../controllers/ProvidentFundController.js";
import InstitutionController from "../controllers/institutionControllers.js";
import roControllers from "../controllers/roOperations.js";

const router = express.Router();

const allRoutes = (app)=>{

  router.post("/register", registerController.registerUser);
  router.post("/login", registerController.login);
  router.post("/registerInstitue", InstitutionController.register);
  router.post("/funddata", pfControllers.insertData);
  router.post("/updatefund", pfControllers.updateFundData)
  router.post("/userdata", registerController.getAllUserData);
  router.post("/verifyUserData", roControllers.verifyUserData)
  router.post("/unverifiedReason", roControllers.unverifiedMessage)
  return app.use("/", router);
}

export default allRoutes;
