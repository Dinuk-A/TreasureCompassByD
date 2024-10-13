package com.dinuka.treasurecompassbyd.user;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.math.BigDecimal;

@RestController
public class UserController {

    @Autowired
    private UserDao uDao;

    @Autowired
    private VerificationDao vDao;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private BCryptPasswordEncoder bcrptpwencoder;

    // test .. user all info
    @GetMapping(value = "/user/all", produces = "application/json")
    public List<User> getAllUserInfo() {
        return uDao.findAll();
    }

    // test ... user by id
    @GetMapping(value = "/user/byid/{userID}", produces = "application/json")
    public User getById(@PathVariable("userID") int userID) {
        return uDao.getUserByUserId(userID);
    }

    // signup process(only email and pw first)
    @PostMapping("/user/initialsignup")
    public String signUpUser(@RequestBody SignUpReq signUpReq) {
        try {

            if (uDao.existsByEmail(signUpReq.getEmail())) {
                return "Email already exists. Please log in or use a different email.";
            }

            User unverifiedNewUser = new User();

            unverifiedNewUser.setEmail(signUpReq.getEmail());
            unverifiedNewUser.setPassword(bcrptpwencoder.encode(signUpReq.getPassword()));
            unverifiedNewUser.setCreated_at(LocalDateTime.now());
            unverifiedNewUser.setStatus(false);
            unverifiedNewUser.setIs_verified(false);

            unverifiedNewUser.setFirstname("First");
            unverifiedNewUser.setLastname("Last");
            unverifiedNewUser.setUsername("UN");
            unverifiedNewUser.setCash_in_hand(BigDecimal.ZERO);
            unverifiedNewUser.setBase_currency_id(null);

            uDao.save(unverifiedNewUser);

            // an email with an OTP must be sent from here

            // set temp vrfcn rec
            String otp = genToken();
            Verification vrfcn = new Verification();
            vrfcn.setToken(otp);
            vrfcn.setExpires_at(LocalDateTime.now().plusMinutes(60));
            vrfcn.setUser_id(unverifiedNewUser);

            vDao.save(vrfcn);

            // Send the email with the OTP
            sendVerificationEmail(unverifiedNewUser.getEmail(), otp); // Email sending

            return "OK";

        } catch (Exception e) {
            return "Error during registration: " + e.getMessage();
        }
    }

    // gen OTP
    public String genToken() {
        return UUID.randomUUID().toString();
    }

    // generate an email
    public void sendVerificationEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for Email Verification");
        message.setText("Your OTP code is: " + token);

        javaMailSender.send(message); // Send the email
    }

    // to save the user info
    @PostMapping("/user/post")
    public String saveUserInfo(@RequestBody User userEntity) {

        try {
            userEntity.setCreated_at(LocalDateTime.now());
            userEntity.setStatus(true);
            uDao.save(userEntity);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed Because :" + e.getMessage();
        }

    }

    // to update user info
    @PutMapping(value = "/user/update")
    public String updateUserInfo(@RequestBody User userEntityPut) {

        try {
            uDao.save(userEntityPut);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed Because :" + e.getMessage();
        }

    }

    // to update cash in hand info
    // @PutMapping( value = "/user/update/cashinhand")
    // public String updateCashInhandBalance(@RequestBody User userEntityPut) {

    // User existingUser = uDao.getUserByUserId(userEntityPut.getId());

    // existingUser.setBase_currency_id(userEntityPut.getBase_currency_id());
    // existingUser.setCash_in_hand(userEntityPut.getCash_in_hand());

    // try {
    // uDao.save(existingUser);
    // return "OK";
    // } catch (Exception e) {
    // return "Update Not Completed Because :" + e.getMessage();
    // }

    // }

    // to delete a user record
    @DeleteMapping("/user/delete")
    public String deleteUserInfo(@RequestBody User userEntityDelete) {

        try {
            // userEntityDelete.setStatus(false);
            uDao.delete(uDao.getReferenceById(userEntityDelete.getId()));

            // uDao.save(userEntityDelete);

            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed " + e.getMessage();
        }
    }

}
