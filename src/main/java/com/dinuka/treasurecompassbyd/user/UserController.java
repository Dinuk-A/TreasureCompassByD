package com.dinuka.treasurecompassbyd.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class UserController {

    @Autowired
    private UserDao uDao;

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
