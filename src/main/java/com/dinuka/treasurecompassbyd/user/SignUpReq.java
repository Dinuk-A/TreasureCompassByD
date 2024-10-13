package com.dinuka.treasurecompassbyd.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// the UserRegistrationDTO.java is not an entity, and it doesn't represent a database table. It's just a Data Transfer Object (DTO) used to collect and pass data, like email and password, from the frontend to the backend when a user registers.

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpReq {
    private String email;
    private String password;
}
