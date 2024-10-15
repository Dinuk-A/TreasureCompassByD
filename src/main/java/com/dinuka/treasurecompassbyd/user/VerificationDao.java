package com.dinuka.treasurecompassbyd.user;
// package com.dinuka.treasurecompassbyd.User;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationDao extends JpaRepository<Verification,Integer>{

    //null values might be there...so use optional
    Optional<Verification> findByToken(String token);

    
    void deleteByExpiresAtBefore(LocalDateTime dateTime);

}
