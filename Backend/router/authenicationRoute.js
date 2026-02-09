const express =require("express")
const { SignUpController, LoginController } = require("../controller/authenticationController")
const protect = require("../middleware/authMiddleware")
const router=express.Router()

router.post("/signup",SignUpController)
router.post("/login",LoginController)
router.get("/me", protect, (req, res) => {
  res.json({
    _id: req.user._id,
    email: req.user.email,
    role: req.user.role, 
  });
});


module.exports=router