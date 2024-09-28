package com.dinuka.treasurecompassbyd.transaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TrxCategoryDao extends JpaRepository<TrxCategory,Integer>{
    
    //get categories only belongs to INCOME
    // @Query(value = "select cat from TrxCategory cat where cat.trx_type_id=1")
    @Query(value = "SELECT * FROM financeappdb.trx_category as cat where cat.trx_type_id = 1", nativeQuery = true)
    public List<TrxCategory> getIncomeCats();

    //get categories only belongs to EXPENSE
    // @Query(value = "select cat from TrxCategory cat where cat.trx_type_id=2")
    @Query(value = "SELECT * FROM financeappdb.trx_category as cat where cat.trx_type_id = 2", nativeQuery = true)
    public List<TrxCategory> getExpenseCats();
   
}
