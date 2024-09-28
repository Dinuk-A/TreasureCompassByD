package com.dinuka.treasurecompassbyd.user;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "verification")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Verification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "token")
    @NotNull
    private String token;

    @Column(name = "expires_at")
    private LocalDateTime expires_at;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user_id;
    
}

/*
 * id int AI PK
 * token varchar(255)
 * expires_at timestamp
 * user_id int
 */