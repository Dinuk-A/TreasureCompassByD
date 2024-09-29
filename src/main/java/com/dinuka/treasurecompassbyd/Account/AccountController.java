package com.dinuka.treasurecompassbyd.Account;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.dinuka.treasurecompassbyd.user.User;
import com.dinuka.treasurecompassbyd.user.UserDao;

// import com.dinuka.treasurecompassbyd.User.UserDao;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;

// import java.util.List;
// import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class AccountController {

    @Autowired
    private AccountDao accDao;

    @Autowired
    private UserDao uDao;

      // get accounts list by logged user   (test)
   
    @GetMapping(value = "account/byuserid/{userId}", produces = "application/JSON")
    public List<Account> getAccListByLoggedUser(@PathVariable("userId") int userId) {
        return accDao.getAccListOfLoggedUser(userId);
    }

    // to save the account info
    @PostMapping("/account/save")
    public String saveAccountInfo(@RequestBody Account accountEntity) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User loggedUser = uDao.getByUName(auth.getName());
        // Integer loggedUserId = loggedUser.getId();
        
        try {
            accountEntity.setUser_id(loggedUser);
            // accountEntity.setUser_id(loggedUserId);
            accountEntity.setStatus(true);
            accDao.save(accountEntity);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed Because :" + e.getMessage();
        }

    }

    // to update account info
    @PutMapping(value = "/account/update")
    public String updateAccountInfo(@RequestBody Account accountEntityPut) {

        try {
            accDao.save(accountEntityPut);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed Because :" + e.getMessage();
        }

    }

    // to delete a account record
    @DeleteMapping("/account/delete")
    public String deleteAccountInfo(@RequestBody Account accountEntityDelete) {

        try {
            accountEntityDelete.setStatus(false);
            accDao.delete(accDao.getReferenceById(accountEntityDelete.getId()));

            // accDao.save(accountEntityDelete);

            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed " + e.getMessage();
        }
    }

}
