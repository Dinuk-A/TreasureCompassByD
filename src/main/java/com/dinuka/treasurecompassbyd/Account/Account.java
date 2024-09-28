package com.dinuka.treasurecompassbyd.Account;

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

import java.math.BigDecimal;

import com.dinuka.treasurecompassbyd.currency.Currency;
import com.dinuka.treasurecompassbyd.user.User;

@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "acc_display_name")
    @NotNull
    private String acc_display_name;

    @Column(name = "acc_number")
    @NotNull
    private String acc_number;

    @Column(name = "balance")
    @NotNull
    private BigDecimal balance;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    // @Column(name = "user_id")
    //  private Integer user_id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user_id;

    @ManyToOne
    @JoinColumn(name = "acc_type_id", referencedColumnName = "id")
    private AccType acc_type_id;

    @ManyToOne
    @JoinColumn(name = "acc_currency_id", referencedColumnName = "id")
    private Currency acc_currency_id;

}

/*
 * id int AI PK
 * acc_display_name varchar(45)
 * acc_currency varchar(20)
 * acc_number varchar(45)
 * balance decimal(10,2)
 * acc_type_id int
 * user_id int
 * status tinyint
 */