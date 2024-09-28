package com.dinuka.treasurecompassbyd.currency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CurrencyController {
    
    @Autowired
    private CurrencyDao currencyDao;

    @GetMapping(value = "/currency/all" , produces = "application/json")
    public List<Currency> getAllCurrencyList (){
        return currencyDao.findAll();
    }
}
