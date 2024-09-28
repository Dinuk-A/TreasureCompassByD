package com.dinuka.treasurecompassbyd.transaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MainTrxDao extends JpaRepository<MainTrx,Integer> {
    
    //get all trxs by a user
    @Query(value =  "SELECT * FROM trx as t where t.user_id=?1;", nativeQuery = true)
    public List<MainTrx> getTrxListByuser(Integer userId);
}
