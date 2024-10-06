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
            // Authenticate the user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User loggedUser = uDao.getByUName(auth.getName());

            // Retrieve original (current) cash in hand balance
            BigDecimal currentCashInHandBal = loggedUser.getCash_in_hand();

            // Get the new soon-to-be updating amount of trx
            BigDecimal newTrxAmount = trxEntityPut.getAmount();

            // Get existing transaction record
            MainTrx originalTrxRecord = mainTrxDao.getReferenceById(trxEntityPut.getId());

            // Get the original (current) amount of the account (check if null first)
            BigDecimal currentBalanceOfAcc;
            if (originalTrxRecord.getAccount_id() != null) {
                currentBalanceOfAcc = originalTrxRecord.getAccount_id().getBalance();
            } else {
                currentBalanceOfAcc = BigDecimal.ZERO;
            }

            // Get the original trx amount (before updating)
            BigDecimal originalTrxAmount = originalTrxRecord.getAmount();

            // Handle income transactions
            if ("INCOME".equals(trxEntityPut.getTrx_type())) {

                // 1.1 Account-Related Income (No Cash in Hand)
                // 1.1.1 Same account, amount changes
                if (!trxEntityPut.getIs_involve_cashinhand() &&
                        trxEntityPut.getAccount_id() != null &&
                        originalTrxRecord.getAccount_id() != null &&
                        trxEntityPut.getAccount_id().getId().equals(originalTrxRecord.getAccount_id().getId())) {

                    BigDecimal balanceOfAccBeforeOriginalTrx = currentBalanceOfAcc.subtract(originalTrxAmount);
                    BigDecimal newAccBalanceAfterUpdatedTrxAmount = balanceOfAccBeforeOriginalTrx.add(newTrxAmount);

                    Account targetAccOfIncomeSameAcc = trxEntityPut.getAccount_id();
                    targetAccOfIncomeSameAcc.setBalance(newAccBalanceAfterUpdatedTrxAmount);

                    System.out.println("INCOME> ACC > 1.1.1 Same account, amount changes");
                    System.out.println("Current Balance Of Account: " + currentBalanceOfAcc);
                    System.out.println("Original Transaction Amount: " + originalTrxAmount);
                    System.out.println(
                            "Balance of Account Before Original Transaction: " + balanceOfAccBeforeOriginalTrx);
                    System.out.println("New Transaction Amount: " + newTrxAmount);
                    System.out.println("New Account Balance After Update: " + newAccBalanceAfterUpdatedTrxAmount);

                    accDao.save(targetAccOfIncomeSameAcc);
                }

                // 1.1.2 Account changes
                else if (!trxEntityPut.getIs_involve_cashinhand() &&
                        originalTrxRecord.getAccount_id() != null &&
                        trxEntityPut.getAccount_id() != null &&
                        !trxEntityPut.getAccount_id().getId().equals(originalTrxRecord.getAccount_id().getId())) {

                    System.out.println("INCOME> ACC > 1.1.2 Account changes");

                    // Correct the original account's balance
                    BigDecimal correctedBalanceOfOriginalAcc = currentBalanceOfAcc.subtract(originalTrxAmount);
                    Account originalAccount = originalTrxRecord.getAccount_id();
                    originalAccount.setBalance(correctedBalanceOfOriginalAcc);

                    System.out.println("Current Balance Of Existing Account: " + currentBalanceOfAcc);
                    System.out.println("Corrected Balance Of Original Account: " + correctedBalanceOfOriginalAcc);

                    accDao.save(originalAccount);

                    // Update the new account's balance
                    BigDecimal currentBalanceOfNewUpdatingDiffAcc = trxEntityPut.getAccount_id().getBalance();
                    BigDecimal newBalanceOfNewAccount = currentBalanceOfNewUpdatingDiffAcc.add(newTrxAmount);
                    Account newAccount = trxEntityPut.getAccount_id();
                    newAccount.setBalance(newBalanceOfNewAccount);

                    System.out
                            .println("Current Balance Of New Updating Account: " + currentBalanceOfNewUpdatingDiffAcc);
                    System.out.println("New Transaction Amount: " + newTrxAmount);
                    System.out.println("New Balance Of New Account: " + newBalanceOfNewAccount);

                    accDao.save(newAccount);
                }

                // 1.2 Cash in Hand Income (Wallet)
                // 1.2.1 Both involve cash in hand, only amount changes
                else if (trxEntityPut.getIs_involve_cashinhand() &&
                        originalTrxRecord.getIs_involve_cashinhand() &&
                        trxEntityPut.getAccount_id() == null) {

                    System.out.println("INCOME> CASH > 1.2.1 Both involve cash in hand, only amount changes");

                    BigDecimal balanceOFCIHbeforeOriginalTrx = currentCashInHandBal.subtract(originalTrxAmount);
                    BigDecimal newCIHBalanceAfterUpdatedTrxAmount = balanceOFCIHbeforeOriginalTrx.add(newTrxAmount);

                    loggedUser.setCash_in_hand(newCIHBalanceAfterUpdatedTrxAmount);
                    uDao.save(loggedUser);
                }

                // 1.2.2 Change from cash in hand to an account
                else if (originalTrxRecord.getIs_involve_cashinhand() &&
                        trxEntityPut.getAccount_id() != null &&
                        !trxEntityPut.getIs_involve_cashinhand()) {

                    System.out.println("INCOME> CASH > 1.2.2 Change from cash in hand to an account");

                    // Deduct balance from cash in hand
                    BigDecimal balanceOFCIHbeforeOriginalTrx = currentCashInHandBal.subtract(originalTrxAmount);
                    loggedUser.setCash_in_hand(balanceOFCIHbeforeOriginalTrx);
                    uDao.save(loggedUser);

                    // Update the new account's balance
                    BigDecimal currentBalanceOfNewUpdatingDiffAcc = trxEntityPut.getAccount_id().getBalance();
                    BigDecimal newBalanceOfNewAccount = currentBalanceOfNewUpdatingDiffAcc.add(newTrxAmount);
                    Account newAccount = trxEntityPut.getAccount_id();
                    newAccount.setBalance(newBalanceOfNewAccount);

                    accDao.save(newAccount);
                }
            }

            // Handle expense transactions
            if ("EXPENSE".equals(trxEntityPut.getTrx_type())) {

                // 2.1 Account-Related Expense (No Cash in Hand)
                // 2.1.1 Same account, amount changes
                if (!trxEntityPut.getIs_involve_cashinhand() &&
                        trxEntityPut.getAccount_id() != null &&
                        originalTrxRecord.getAccount_id() != null &&
                        trxEntityPut.getAccount_id().getId().equals(originalTrxRecord.getAccount_id().getId())) {

                    System.out.println("EXP ACC 2.1.1 Same account, amount changes");

                    BigDecimal balanceOfAccBeforeOriginalTrx = currentBalanceOfAcc.add(originalTrxAmount);
                    BigDecimal newAccBalanceAfterUpdatedTrxAmount = balanceOfAccBeforeOriginalTrx
                            .subtract(newTrxAmount);

                    Account targetAccOfExpenseSameAcc = trxEntityPut.getAccount_id();
                    targetAccOfExpenseSameAcc.setBalance(newAccBalanceAfterUpdatedTrxAmount);

                    accDao.save(targetAccOfExpenseSameAcc);
                }

                // 2.1.2 Account changes
                else if (!trxEntityPut.getIs_involve_cashinhand() &&
                        originalTrxRecord.getAccount_id() != null &&
                        trxEntityPut.getAccount_id() != null &&
                        !trxEntityPut.getAccount_id().getId().equals(originalTrxRecord.getAccount_id().getId())) {

                    System.out.println("EXP ACC 2.1.2 Account changes");

                    // Correct the original account's balance
                    BigDecimal currentBalanceOfOriginalTrxRecordAcc = originalTrxRecord.getAccount_id().getBalance();
                    BigDecimal correctedOriginalBalance = currentBalanceOfOriginalTrxRecordAcc.add(originalTrxAmount);
                    Account originalAccount = originalTrxRecord.getAccount_id();
                    originalAccount.setBalance(correctedOriginalBalance);

                    accDao.save(originalAccount);

                    // Update the new account's balance
                    BigDecimal currentBalanceOfNewUpdatingDiffAcc = trxEntityPut.getAccount_id().getBalance();
                    BigDecimal correctedBalanceOfNewAccount = currentBalanceOfNewUpdatingDiffAcc.subtract(newTrxAmount);
                    Account newAccount = trxEntityPut.getAccount_id();
                    newAccount.setBalance(correctedBalanceOfNewAccount);

                    accDao.save(newAccount);
                }

                // 2.2 Cash in Hand Expense (Wallet)
                // 2.2.1 Both involve cash in hand, only amount changes
                else if (trxEntityPut.getIs_involve_cashinhand() &&
                        originalTrxRecord.getIs_involve_cashinhand() &&
                        trxEntityPut.getAccount_id() == null) {

                    System.out.println("EXP CASH 2.2.1 Both involve cash in hand, only amount changes");

                    BigDecimal balanceOFCIHbeforeOriginalTrx = currentCashInHandBal.add(originalTrxAmount);
                    BigDecimal newCIHBalanceAfterUpdatedTrxAmount = balanceOFCIHbeforeOriginalTrx
                            .subtract(newTrxAmount);

                    loggedUser.setCash_in_hand(newCIHBalanceAfterUpdatedTrxAmount);
                    uDao.save(loggedUser);
                }

                // 2.2.2 Change from cash in hand to an account
                else if (originalTrxRecord.getIs_involve_cashinhand() &&
                        trxEntityPut.getAccount_id() != null &&
                        !trxEntityPut.getIs_involve_cashinhand()) {

                    System.out.println("EXP CASH 2.2.2 Change from cash in hand to an account");

                    // Deduct balance from cash in hand
                    BigDecimal balanceOFCIHbeforeOriginalTrx = currentCashInHandBal.add(originalTrxAmount);
                    loggedUser.setCash_in_hand(balanceOFCIHbeforeOriginalTrx);
                    uDao.save(loggedUser);

                    // Update the new account's balance
                    BigDecimal currentBalanceOfNewUpdatingDiffAcc = trxEntityPut.getAccount_id().getBalance();
                    BigDecimal newBalanceOfNewAccount = currentBalanceOfNewUpdatingDiffAcc.subtract(newTrxAmount);
                    Account newAccount = trxEntityPut.getAccount_id();
                    newAccount.setBalance(newBalanceOfNewAccount);

                    accDao.save(newAccount);
                }
            }

            // Mark transaction as completed
            trxEntityPut.setStatus(true);
            mainTrxDao.save(trxEntityPut);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed Because: " + e.getMessage();
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
