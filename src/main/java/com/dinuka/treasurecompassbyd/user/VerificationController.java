package com.dinuka.treasurecompassbyd.user;
// package com.dinuka.treasurecompassbyd.User;

// import java.time.LocalDateTime;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// public class VerificationController {

//     @Autowired
//     private VerificationDao vrfcDao;

//     @Autowired
//     private UserDao uDao;

//     @GetMapping("/verify-email")
//     public String verifyEmail(@RequestParam("token") String token) {
//         Verification verificationToken = vrfcDao.findByToken(token)
//                 .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

//         if (verificationToken.getExpires_at().isBefore(LocalDateTime.now())) {
//             return "verificationExpired"; // Redirects to an expiration page
//         }

//         User user = verificationToken.getUser_id();
//         user.setIs_verified(true);
//         uDao.save(user);

//         return "OK";
//         // return "redirect:/start";   //original
//         // Redirects to login page after successful verification
//     }
// }
