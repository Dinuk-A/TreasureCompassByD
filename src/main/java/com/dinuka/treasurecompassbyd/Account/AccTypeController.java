package com.dinuka.treasurecompassbyd.Account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AccTypeController {

    @Autowired
    private AccTypeDao accTypeDao;

     @GetMapping(value = "/acctype/all", produces = "application/json")
    public List<AccType> getAccTypeAllData() {
        return accTypeDao.findAll();
    }
}
