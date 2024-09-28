package com.dinuka.treasurecompassbyd.Account;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AccountDao extends JpaRepository<Account,Integer>{

    //get the account list of logged user  ORIGINAL
    @Query(value = "select a from Account a where a.user_id.id =?1")
    public List<Account> getAccListOfLoggedUser(Integer userId);
    
}
