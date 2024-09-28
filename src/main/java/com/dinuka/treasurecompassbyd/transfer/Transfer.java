package com.dinuka.treasurecompassbyd.transfer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dinuka.treasurecompassbyd.Account.Account;

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

public class Transfer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "amount")
    @NotNull
    private BigDecimal amount;

    @Column(name = "transfer_date")
    @NotNull
    private LocalDateTime transfer_date;

    @ManyToOne
    @JoinColumn(name = "source_account_id", referencedColumnName = "id")
    private Account source_account_id;

    @ManyToOne
    @JoinColumn(name = "destination_account_id", referencedColumnName = "id")
    private Account destination_account_id;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    @Column(name = "description")
    @NotNull
    private String description;

}

/*
 * id int PK
 * transfer_date date
 * amount decimal(10,2)
 * source_account_id int
 * destination_account_id int
 * status tinyint
 * description text
 */