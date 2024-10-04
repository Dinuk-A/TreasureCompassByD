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
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User loggedUser = uDao.getByUName(auth.getName());

            // Retrieve original(current) cash in hand balance
            BigDecimal currentCashInHandBal = loggedUser.getCash_in_hand();

            // get the new soon to be updating amount of trx, not account
            BigDecimal newTrxAmount = trxEntityPut.getAmount();

            // get existing record
            MainTrx originalTrxRecord = mainTrxDao.getReferenceById(trxEntityPut.getId());

            // get the original(current) amount of the account (check if 0 first)
            BigDecimal currentBalanceOfAcc;
            if (originalTrxRecord.getAccount_id() != null) {
                currentBalanceOfAcc = originalTrxRecord.getAccount_id().getBalance();
            } else {
                currentBalanceOfAcc = BigDecimal.ZERO;
            }

            // get the original trx amount (before updating) (dont need to check wheather 0
            // , because trx amount cannot be 0 )
            BigDecimal originalTrxAmount = originalTrxRecord.getAmount();

            // 1 for incomes✅✅✅
            if ("INCOME".equals(trxEntityPut.getTrx_type())) {

                // 1.1 for account related trxs✅✅
                // 1.1.1 updating new account is the same account as before ✅
                if (trxEntityPut.getAccount_id() == originalTrxRecord.getAccount_id() &&  !trxEntityPut.getIs_involve_cashinhand()) {
                    BigDecimal balanceOfAccBeforeOriginalTrx = currentBalanceOfAcc.subtract(originalTrxAmount);
                    BigDecimal newAccBalanceAfterUpdatedTrxAmount = balanceOfAccBeforeOriginalTrx.add(newTrxAmount);

                    Account targetAccOfIncomeSameAcc = trxEntityPut.getAccount_id();
                    targetAccOfIncomeSameAcc.setBalance(newAccBalanceAfterUpdatedTrxAmount);

                    accDao.save(targetAccOfIncomeSameAcc);
                }

                // 1.1.2 updating new account is a different one from before ✅
                if (trxEntityPut.getAccount_id() != originalTrxRecord.getAccount_id()) {

                    // get the trx record's already exist account's current balance
                    BigDecimal currentBalanceOfOriginalTrxRecordAcc;
                    if (originalTrxRecord.getAccount_id() != null) {
                        currentBalanceOfOriginalTrxRecordAcc = originalTrxRecord.getAccount_id().getBalance();
                    } else {
                        currentBalanceOfOriginalTrxRecordAcc = BigDecimal.ZERO;
                    }

                    // since this is an income, this wrong amount must be deducted from original
                    // account to make it back to the right balance
                    BigDecimal correctedAccBalanceOfOriginaAcc = currentBalanceOfOriginalTrxRecordAcc
                            .subtract(newTrxAmount);
                    Account originalAccount = originalTrxRecord.getAccount_id();
                    originalAccount.setBalance(correctedAccBalanceOfOriginaAcc);
                    accDao.save(originalAccount);

                    // get the new updating different account's current balance
                    BigDecimal currentBalanceOfNewUpdatingDiffAcc;
                    if (trxEntityPut.getAccount_id() != null) {
                        currentBalanceOfNewUpdatingDiffAcc = trxEntityPut.getAccount_id().getBalance();
                    } else {
                        currentBalanceOfNewUpdatingDiffAcc = BigDecimal.ZERO;
                    }

                    // since this is an income , new amount must be added to the new account
                    BigDecimal newBalanceOfNewAccount = currentBalanceOfNewUpdatingDiffAcc.add(newTrxAmount);
                    Account newAccount = trxEntityPut.getAccount_id();
                    newAccount.setBalance(newBalanceOfNewAccount);
                    accDao.save(newAccount);

                }

                // 1.2 for cash in hand involve trxs✅✅
                // 1.2.1 source is not changed (also wallet)✅
                if (originalTrxRecord.getIs_involve_cashinhand() == true
                        && trxEntityPut.getIs_involve_cashinhand() == true) {
                    BigDecimal balanceOFCIHbeforeOriginalTrx = currentCashInHandBal.subtract(originalTrxAmount);
                    BigDecimal newCIHBalanceAfterUpdatedTrxAmount = balanceOFCIHbeforeOriginalTrx.add(newTrxAmount);

                    loggedUser.setCash_in_hand(newCIHBalanceAfterUpdatedTrxAmount);
                    uDao.save(loggedUser);
                }

                // 1.2.1 source changed (to an account)✅
                if (originalTrxRecord.getIs_involve_cashinhand() == true
                        && trxEntityPut.getIs_involve_cashinhand() == false) {

                    // deduct extra balance from cash in hand
                    BigDecimal balanceOFCIHbeforeOriginalTrx = currentCashInHandBal.subtract(originalTrxAmount);
                    loggedUser.setCash_in_hand(balanceOFCIHbeforeOriginalTrx);
                    uDao.save(loggedUser);

                    BigDecimal currentBalanceOfNewUpdatingDiffAcc;
                    if (trxEntityPut.getAccount_id() != null) {
                        currentBalanceOfNewUpdatingDiffAcc = trxEntityPut.getAccount_id().getBalance();
                    } else {
                        currentBalanceOfNewUpdatingDiffAcc = BigDecimal.ZERO;
                    }

                    BigDecimal newBalanceOfNewAccount = currentBalanceOfNewUpdatingDiffAcc.add(newTrxAmount);
                    Account newAccount = trxEntityPut.getAccount_id();
                    newAccount.setBalance(newBalanceOfNewAccount);
                    accDao.save(newAccount);
                }
            }

            // 2 for expenses✅✅✅
            if ("EXPENSE".equals(trxEntityPut.getTrx_type())) {

                // 2.1 for account related trxs✅✅
                // 2.1.1 updating new account is the same account as before ✅
                if (trxEntityPut.getAccount_id() == originalTrxRecord.getAccount_id() && !trxEntityPut.getIs_involve_cashinhand()) {
                    BigDecimal balanceOfAccBeforeOriginalTrx = currentBalanceOfAcc.add(originalTrxAmount);
                    BigDecimal newAccBalanceAfterUpdatedTrxAmount = balanceOfAccBeforeOriginalTrx
                            .subtract(newTrxAmount);

                    Account targetAccOfExpenseSameAcc = trxEntityPut.getAccount_id();
                    targetAccOfExpenseSameAcc.setBalance(newAccBalanceAfterUpdatedTrxAmount);

                    accDao.save(targetAccOfExpenseSameAcc);
                }

                // 1.1.2 updating new account is a different one from before✅
                if (trxEntityPut.getAccount_id() != originalTrxRecord.getAccount_id()) {

                    // get the trx record's already exist account's current balance
                    BigDecimal currentBalanceOfOriginalTrxRecordAcc;
                    if (originalTrxRecord.getAccount_id() != null) {
                        currentBalanceOfOriginalTrxRecordAcc = originalTrxRecord.getAccount_id().getBalance();
                    } else {
                        currentBalanceOfOriginalTrxRecordAcc = BigDecimal.ZERO;
                    }

                    // since this is an expense, this missing value should be added to the original
                    // acc
                    BigDecimal correctedOriginalBalance = currentBalanceOfOriginalTrxRecordAcc.add(newTrxAmount);
                    Account originalAccount = originalTrxRecord.getAccount_id();
                    originalAccount.setBalance(correctedOriginalBalance);
                    accDao.save(originalAccount);

                    // get the new updating different account's current balance
                    BigDecimal currentBalanceOfNewUpdatingDiffAcc;
                    if (trxEntityPut.getAccount_id() != null) {
                        currentBalanceOfNewUpdatingDiffAcc = trxEntityPut.getAccount_id().getBalance();
                    } else {
                        currentBalanceOfNewUpdatingDiffAcc = BigDecimal.ZERO;
                    }

                    // since this is an expense, this extra value should be deducted from the new
                    // acc
                    BigDecimal correctedBalanceOfNewAccount = currentBalanceOfNewUpdatingDiffAcc.subtract(newTrxAmount);
                    Account newAccount = trxEntityPut.getAccount_id();
                    newAccount.setBalance(correctedBalanceOfNewAccount);
                    accDao.save(newAccount);

                }

                // 2.2 for cash in hand involve trxs✅
                // 2.2.1 source is not changed (also wallet)✅
                if (originalTrxRecord.getIs_involve_cashinhand() == true
                        && trxEntityPut.getIs_involve_cashinhand() == true) {
                    BigDecimal balanceOFCIHbeforeOriginalTrx = currentCashInHandBal.add(originalTrxAmount);
                    BigDecimal newCIHBalanceAfterUpdatedTrxAmount = balanceOFCIHbeforeOriginalTrx
                            .subtract(newTrxAmount);

                    loggedUser.setCash_in_hand(newCIHBalanceAfterUpdatedTrxAmount);
                    uDao.save(loggedUser);
                }

                // 2.2.1 source changed (to an account)✅✅
                if (originalTrxRecord.getIs_involve_cashinhand() == true
                        && trxEntityPut.getIs_involve_cashinhand() == false) {

                    // add missing balance to cash in hand✅
                    BigDecimal balanceOFCIHbeforeOriginalTrx = currentCashInHandBal.add(originalTrxAmount);
                    loggedUser.setCash_in_hand(balanceOFCIHbeforeOriginalTrx);
                    uDao.save(loggedUser);

                    BigDecimal currentBalanceOfNewUpdatingDiffAcc;
                    if (trxEntityPut.getAccount_id() != null) {
                        currentBalanceOfNewUpdatingDiffAcc = trxEntityPut.getAccount_id().getBalance();
                    } else {
                        currentBalanceOfNewUpdatingDiffAcc = BigDecimal.ZERO;
                    }

                    BigDecimal newBalanceOfNewAccount = currentBalanceOfNewUpdatingDiffAcc.subtract(newTrxAmount);
                    Account newAccount = trxEntityPut.getAccount_id();
                    newAccount.setBalance(newBalanceOfNewAccount);
                    accDao.save(newAccount);
                }

            }

            trxEntityPut.setStatus(true);
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
