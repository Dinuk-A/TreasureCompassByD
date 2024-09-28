package com.dinuka.treasurecompassbyd.transaction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dinuka.treasurecompassbyd.user.User;
import com.dinuka.treasurecompassbyd.user.UserDao;

@RestController
public class MainTrxController {

    @Autowired
    private MainTrxDao mainTrxDao;

    @Autowired
    private UserDao uDao;

    // get all the trxs by user
    @GetMapping(value = "/trx/byuser/{userId}", produces = "application/json")
    public List<MainTrx> getAllTrxByUser(@PathVariable("userId") int userId){
        return mainTrxDao.getTrxListByuser(userId);
    }

    // to save the trx info
    @PostMapping("/trx/save")
    public String saveTransactionInfo(@RequestBody MainTrx trxEntity) {

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            User loggedUser = uDao.getByUName(auth.getName());

            trxEntity.setUser_id(loggedUser.getId());
            trxEntity.setStatus(true);
            mainTrxDao.save(trxEntity);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed Because :" + e.getMessage();
        }

    }

    // to update trx info
    @PutMapping("/trx/update")
    public String updateTransactionInfo(@RequestBody MainTrx trxEntityPut) {

        try {
            mainTrxDao.save(trxEntityPut);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed Because :" + e.getMessage();
        }

    }

    // to delete a trx record
    @DeleteMapping("/trx/delete")
    public String deleteTransactionInfo(@RequestBody MainTrx trxEntityDelete) {

        try {
            trxEntityDelete.setStatus(false);
            mainTrxDao.delete(mainTrxDao.getReferenceById(trxEntityDelete.getId()));

            // mainTrxDao.save(trxEntityDelete);

            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed " + e.getMessage();
        }
    }

}
