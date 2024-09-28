package com.dinuka.treasurecompassbyd.user;
// package com.dinuka.treasurecompassbyd.User;

// import java.time.LocalDateTime;
// import java.util.UUID;

// // import javax.annotation.PostConstruct;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// // import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// @Service
// public class UserService {

//     @Autowired
//     private UserDao userDao;

//     // @Autowired
//     // private PasswordEncoder pwEncoder;

//     // @Autowired
// 	// private BCryptPasswordEncoder bCryptPasswordEncoder;

//     @Autowired
//     private VerificationDao vrfDao;

//     @Autowired
//     private JavaMailSender mailSender;

//     // Create default user if none exists
//     // @PostConstruct
//     // public void initDefaultUser() {
//     //     if (userDao.findByEmail("user@example.com") == null) {
//     //         User defaultUser = new User();
//     //         defaultUser.setEmail("user@example.com");
//     //         defaultUser.setPassword(pwEncoder.encode("password"));  // Set plain password here
//     //         defaultUser.setIsVerified(true);  // Mark the default user as verified
//     //         userDao.save(defaultUser);
//     //     }
//     // }

//     // Signup method for new users
//     public User signup(SignUpReq req) {
//         // Check if user already exists
//         if (userDao.findByEmail(req.getEmail()) != null) {
//             throw new RuntimeException("Email is already taken");
//         }

//         // Create a new user
//         User newUser = new User();
//         newUser.setEmail(req.getEmail());
//         // newUser.setPassword(bCryptPasswordEncoder.encode(req.getPassword()));
//         newUser.setIs_verified(false);

//         User savedUser = userDao.save(newUser);

//         // Generate and save verification token
//         Verification vrfcn = new Verification();
//         vrfcn.setToken(UUID.randomUUID().toString());
//         vrfcn.setUser_id(savedUser);
//         vrfcn.setExpires_at(LocalDateTime.now().plusMinutes(5));

//         vrfDao.save(vrfcn);

//         // Send verification email
//         sendVerificationEmail(savedUser, vrfcn.getToken());

//         return savedUser;
//     }

//     // Send verification email
//     private void sendVerificationEmail(User user, String token) {
//         String subject = "Email Verification";
//         String text = "Please verify your email by clicking the following link: "
//                 + "http://localhost:8081/verify-email?token=" + token;

//         SimpleMailMessage msg = new SimpleMailMessage();
//         msg.setTo(user.getEmail());
//         msg.setSubject(subject);
//         msg.setText(text);

//         mailSender.send(msg);
//     }
// }
