package com.dinuka.treasurecompassbyd.user;

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

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.dinuka.treasurecompassbyd.currency.Currency;

import java.math.BigDecimal;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "username")
    @NotNull
    private String username;

    @Column(name = "email", unique = true)
    @NotNull
    private String email;

    @Column(name = "password")
    @NotNull
    private String password;

    @Column(name = "firstname")
    @NotNull
    private String firstname;

    @Column(name = "lastname")
    @NotNull
    private String lastname;

    @Column(name = "dob")
    @NotNull
    private LocalDate dob;

    @Column(name = "created_at")
    @NotNull
    private LocalDateTime created_at;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    @Column(name = "is_verified")
    @NotNull
    private Boolean is_verified = false;

    @Column(name = "cash_in_hand")
    private BigDecimal cash_in_hand ;

    @ManyToOne
    @JoinColumn(name = "base_currency_id" , referencedColumnName = "id")
    private Currency base_currency_id;


}
