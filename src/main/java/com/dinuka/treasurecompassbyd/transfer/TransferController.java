package com.dinuka.treasurecompassbyd.transfer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.math.BigDecimal;
import java.util.List;

import com.dinuka.treasurecompassbyd.Account.Account;
import com.dinuka.treasurecompassbyd.Account.AccountDao;
import com.dinuka.treasurecompassbyd.transaction.MainTrx;
import com.dinuka.treasurecompassbyd.transaction.MainTrxDao;
import com.dinuka.treasurecompassbyd.transaction.TrxCategoryDao;
import com.dinuka.treasurecompassbyd.user.User;
import com.dinuka.treasurecompassbyd.user.UserDao;

@RestController
public class TransferController {

    @Autowired
    private TransferDao transferDao;

    @Autowired
    private UserDao uDao;

    @Autowired
    private AccountDao accDao;

    @Autowired
    private MainTrxDao mainTrxDao;

    @Autowired
    private TrxCategoryDao trxCategoryDao;

    @PostMapping("/trfr/save")
    public String saveTransferInfo(@RequestBody Transfer trfrEntity) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = uDao.getByUName(auth.getName());

        try {
            // Get the current balance of user's physical wallet (cash in hand)
            BigDecimal currentCashInHandBalance = loggedUser.getCash_in_hand();

            // 1 normal account-to-account transfers
            if (trfrEntity.getSource_account_id().getId() != -10
                    && trfrEntity.getDestination_account_id().getId() != -10) {

                Account sourceAcc = trfrEntity.getSource_account_id();
                Account destiAcc = trfrEntity.getDestination_account_id();

                // Deduct from source account
                sourceAcc.setBalance(sourceAcc.getBalance().subtract(trfrEntity.getAmount()));

                // Add to destination account
                destiAcc.setBalance(destiAcc.getBalance().add(trfrEntity.getAmount()));

                // Save both accounts
                accDao.save(sourceAcc);
                accDao.save(destiAcc);

                // phy wallet attrs
                trfrEntity.setIs_from_phy_wall(false);
                trfrEntity.setIs_to_phy_wall(false);
            }

            // 2 (physical wallet -> account)
            if (trfrEntity.getSource_account_id().getId() == -10) {

                trfrEntity.setSource_account_id(null);

                trfrEntity.setIs_from_phy_wall(true);
                trfrEntity.setIs_to_phy_wall(false);

                // Deduct from user's cash in hand balance (physical wallet)
                BigDecimal newCashInHandBal = currentCashInHandBalance.subtract(trfrEntity.getAmount());
                loggedUser.setCash_in_hand(newCashInHandBal);

                // Save updated user balance (physical wallet)
                uDao.save(loggedUser);

                // Handle the destination account
                Account destiAcc = trfrEntity.getDestination_account_id();
                destiAcc.setBalance(destiAcc.getBalance().add(trfrEntity.getAmount()));

                // Save the destination account
                accDao.save(destiAcc);
            }

            // 3 (account -> physical wallet)
            if (trfrEntity.getDestination_account_id().getId() == -10) {
                trfrEntity.setDestination_account_id(null);
                trfrEntity.setIs_to_phy_wall(true);
                trfrEntity.setIs_from_phy_wall(true);

                // Add to user's cash in hand balance (physical wallet)
                BigDecimal newCashInHandBal = currentCashInHandBalance.add(trfrEntity.getAmount());
                loggedUser.setCash_in_hand(newCashInHandBal);

                // Save updated user balance (physical wallet)
                uDao.save(loggedUser);

                // Handle the source account
                Account sourceAcc = trfrEntity.getSource_account_id();
                sourceAcc.setBalance(sourceAcc.getBalance().subtract(trfrEntity.getAmount()));

                // Save the source account
                accDao.save(sourceAcc);
            }

            // =======================================================================

            // Save the transfer record
            trfrEntity.setStatus(true);
            transferDao.save(trfrEntity);

            // =======================================================================

            // create trx records for each transfer
            // 1 expense record
            String defaultDescription = (trfrEntity.getDescription()==null||trfrEntity.getDescription().isEmpty())? "System Generated Record" : trfrEntity.getDescription();

            MainTrx newExpenseRecord = new MainTrx();

            newExpenseRecord.setAmount(trfrEntity.getAmount());
            newExpenseRecord.setTrx_date(trfrEntity.getTransfer_date());
            newExpenseRecord.setDescription(defaultDescription);
            newExpenseRecord.setTrx_type("EXPENSE");
            newExpenseRecord.setStatus(true);
            newExpenseRecord.setTrx_category_id(trxCategoryDao.getReferenceById(33));
            newExpenseRecord.setUser_id(loggedUser.getId());
            newExpenseRecord.setTrfr_id(trfrEntity.getId());

            if (trfrEntity.getSource_account_id().getId() != -10) {
                newExpenseRecord.setAccount_id(trfrEntity.getSource_account_id());
                newExpenseRecord.setIs_involve_cashinhand(false);
            } else if (trfrEntity.getSource_account_id().getId() == -10) {
                newExpenseRecord.setIs_involve_cashinhand(true);
                newExpenseRecord.setAccount_id(null);
            }

            // 2 income record
            MainTrx newIncomeRecord = new MainTrx();

            newIncomeRecord.setAmount(trfrEntity.getAmount());
            newIncomeRecord.setTrx_date(trfrEntity.getTransfer_date());
            newIncomeRecord.setDescription(defaultDescription);
            newIncomeRecord.setTrx_type("INCOME");
            newIncomeRecord.setStatus(true);
            newIncomeRecord.setTrx_category_id(trxCategoryDao.getReferenceById(32));
            newIncomeRecord.setUser_id(loggedUser.getId());
            newIncomeRecord.setTrfr_id(trfrEntity.getId());

            if (trfrEntity.getDestination_account_id().getId() != -10) {
                newIncomeRecord.setAccount_id(trfrEntity.getDestination_account_id());
                newIncomeRecord.setIs_involve_cashinhand(false);
            } else if (trfrEntity.getDestination_account_id().getId() == -10) {
                newIncomeRecord.setIs_involve_cashinhand(true);
                newIncomeRecord.setAccount_id(null);
            }

            mainTrxDao.save(newIncomeRecord);
            mainTrxDao.save(newExpenseRecord);

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed Because: " + e.getMessage();
        }
    }

    // to update trfr info
    @PutMapping("/trfr/update")
    public String updateTransferInfo(@RequestBody Transfer trfrEntityPut) {

        try {
            transferDao.save(trfrEntityPut);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed Because :" + e.getMessage();
        }

    }

    // to delete a trfr record
    @DeleteMapping("/trfr/delete")
    public String deleteTransferInfo(@RequestBody Transfer trfrEntityDelete) {

        try {
            List<MainTrx> associateTrxs = mainTrxDao.findByTrfr_id(trfrEntityDelete.getId());

            if (associateTrxs != null && !associateTrxs.isEmpty()) {
                mainTrxDao.deleteAll(associateTrxs);
            }

            // hard delete the entire transfer record from db table
            transferDao.delete(transferDao.getReferenceById(trfrEntityDelete.getId()));

            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed " + e.getMessage();
        }
    }

}
