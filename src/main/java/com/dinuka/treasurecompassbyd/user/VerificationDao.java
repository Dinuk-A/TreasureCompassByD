package com.dinuka.treasurecompassbyd.user;
// package com.dinuka.treasurecompassbyd.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationDao extends JpaRepository<Verification,Integer>{
    Optional<Verification> findByToken(String token);
}
