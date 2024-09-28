package com.dinuka.treasurecompassbyd.transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TrxCategoryController {

    @Autowired
    private TrxCategoryDao trxCategoryDao;

    @GetMapping(value = "/trxcat/all", produces = "application/json")
    public List<TrxCategory> getTrxCategoryAllData() {
        return trxCategoryDao.findAll();
    }

    // INCOMES ONLY
    @GetMapping(value = "/trxcat/income", produces = "application/json")
    public List<TrxCategory> getIncomeCatsMethod() {
        return trxCategoryDao.getIncomeCats();
    }

    // EXPENSES ONLY
    @GetMapping(value = "/trxcat/expense", produces = "application/json")
    public List<TrxCategory> getExpenseCatsMethod() {
        return trxCategoryDao.getExpenseCats();
    }
}
