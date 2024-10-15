package com.dinuka.treasurecompassbyd.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTPVerificationReq {
    private String email;
    private String token;
}
