package com.dinuka.treasurecompassbyd.transaction;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class TrxTypeController {

    @Autowired
    private TrxTypeDao trxTypeDao;

    @GetMapping(value = "/trxtype/all", produces = "application/json")
    public List<TrxType> getTrxTypeAllDataList() {
        return trxTypeDao.findAll();
    }

}
