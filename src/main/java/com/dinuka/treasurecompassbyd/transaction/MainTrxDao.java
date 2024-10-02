package com.dinuka.treasurecompassbyd.transaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MainTrxDao extends JpaRepository<MainTrx,Integer> {
    
    //get 5 recent trxs by a user
    @Query(value =  "SELECT * FROM trx as t where t.user_id=?1 order by trx_date desc limit 5;", nativeQuery = true)
    public List<MainTrx> getRecentTrxListByuser(Integer userId);

    //get all the trxs
    @Query(value =  "SELECT * FROM trx as t where t.user_id=?1 order by trx_date desc ;", nativeQuery = true)
    public List<MainTrx> getAllTrxListByuser(Integer userId);
}


/*SELECT * FROM financeappdb.trx order by trx_date desc limit 5 */