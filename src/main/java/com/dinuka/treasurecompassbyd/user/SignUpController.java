package com.dinuka.treasurecompassbyd.user;
// package com.dinuka.treasurecompassbyd.User;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("/signup")
// public class SignUpController {

//     @Autowired
//     private UserService userService;

//     @PostMapping
//     public ResponseEntity<String> registerUser(@RequestBody SignUpReq req) {
//         try {
//             userService.signup(req);
//             return ResponseEntity.ok("User registered successfully. Please verify your; email.");
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

// }
