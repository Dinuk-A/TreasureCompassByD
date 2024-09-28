package com.dinuka.treasurecompassbyd.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.dinuka.treasurecompassbyd.Account.Account;
// import com.dinuka.treasurecompassbyd.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trx")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class MainTrx {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "amount")
    @NotNull
    private BigDecimal amount;

    @Column(name = "trx_date")
    @NotNull
    private LocalDate trx_date;

    @Column(name = "description")
    @NotNull
    private String description;

    @Column(name = "trx_type")
    @NotNull
    private String trx_type;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    // @ManyToOne
    // @JoinColumn(name = "user_id", referencedColumnName = "id")
    // private User user_id;

    @Column(name = "user_id")
  private Integer user_id;
    
    @ManyToOne
    @JoinColumn(name = "trx_category_id", referencedColumnName = "id")
    private TrxCategory trx_category_id;

    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account_id;

    @Column(name = "is_from_cashinhand")
    private Boolean is_from_cashinhand;

}

