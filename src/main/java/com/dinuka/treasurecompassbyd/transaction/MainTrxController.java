package com.dinuka.treasurecompassbyd.transaction;

import java.math.BigDecimal;
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
import org.springframework.web.servlet.ModelAndView;

import com.dinuka.treasurecompassbyd.Account.Account;
import com.dinuka.treasurecompassbyd.Account.AccountDao;
import com.dinuka.treasurecompassbyd.user.User;
import com.dinuka.treasurecompassbyd.user.UserDao;

@RestController
public class MainTrxController {

    @Autowired
    private MainTrxDao mainTrxDao;

    @Autowired
    private UserDao uDao;

    @Autowired
    private AccountDao accDao;

    // get only 5 recent trxs by user to show in dashboard
    @GetMapping(value = "/recenttrx/byuser/{userId}", produces = "application/json")
    public List<MainTrx> getRecentTrxByUser(@PathVariable("userId") int userId) {
        return mainTrxDao.getRecentTrxListByuser(userId);
    }

    // get all the trxs
    @GetMapping(value = "/alltrx/byuser/{userId}", produces = "application/json")
    public List<MainTrx> getAllTrxByUser(@PathVariable("userId") int userId) {
        return mainTrxDao.getAllTrxListByuser(userId);
    }

    // display all trx page
    @GetMapping(value = "/alltrxs")
    public ModelAndView loginUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = uDao.getByUName(auth.getName());
        ModelAndView allTrxView = new ModelAndView();
        // allTrxView.addObject("loggedusername", auth.getName());
        allTrxView.addObject("loggeduserID", loggedUser.getId());
        allTrxView.setViewName("alltrxs.html");
        return allTrxView;
    }

    @PostMapping("/trx/save")
    public String saveTransactionInfo(@RequestBody MainTrx trxEntity) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User loggedUser = uDao.getByUName(auth.getName());
            trxEntity.setUser_id(loggedUser.getId());

            // Retrieve current cash in hand balance
            BigDecimal currentCashInHandBal = loggedUser.getCash_in_hand();

            // 1. Handling EXPENSE transactions
            if ("EXPENSE".equals(trxEntity.getTrx_type())) {

                // Deduct from an account if specified
                if (trxEntity.getAccount_id() != null) {
                    Account targetedAcc = trxEntity.getAccount_id();
                    BigDecimal currentAccBalance = targetedAcc.getBalance();

                    // Deduct the amount from the account balance
                    targetedAcc.setBalance(currentAccBalance.subtract(trxEntity.getAmount()));

                    // Save the updated account balance
                    accDao.save(targetedAcc);
                }

                // Deduct from cash in hand if flagged
                if (trxEntity.getIs_involve_cashinhand()) {
                    loggedUser.setCash_in_hand(currentCashInHandBal.subtract(trxEntity.getAmount()));

                    // Save the updated user cash in hand balance
                    uDao.save(loggedUser);
                }
            }

            // 2. Handling INCOME transactions
            if ("INCOME".equals(trxEntity.getTrx_type())) {

                // Add to an account if specified
                if (trxEntity.getAccount_id() != null) {
                    Account targetedAcc = trxEntity.getAccount_id();
                    BigDecimal currentAccBalance = targetedAcc.getBalance();

                    // Add the amount to the account balance
                    targetedAcc.setBalance(currentAccBalance.add(trxEntity.getAmount()));

                    // Save the updated account balance
                    accDao.save(targetedAcc);
                }

                // Add to cash in hand if flagged
                if (trxEntity.getIs_involve_cashinhand()) {
                    loggedUser.setCash_in_hand(currentCashInHandBal.add(trxEntity.getAmount()));

                    // Save the updated user cash in hand balance
                    uDao.save(loggedUser);
                }
            }

            // Set the transaction status to true and save the transaction
            trxEntity.setStatus(true);
            mainTrxDao.save(trxEntity);

            return "OK";

        } catch (Exception e) {
            return "Save Not Completed Because: " + e.getMessage();
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
