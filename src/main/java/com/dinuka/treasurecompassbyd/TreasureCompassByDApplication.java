package com.dinuka.treasurecompassbyd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dinuka.treasurecompassbyd.user.User;
import com.dinuka.treasurecompassbyd.user.UserDao;

import java.time.*;

@SpringBootApplication
@RestController
public class TreasureCompassByDApplication {

	@Autowired
	private UserDao uDao;

	// @Autowired
	// private BCryptPasswordEncoder bcrptpwencoder;

	public static void main(String[] args) {
		SpringApplication.run(TreasureCompassByDApplication.class, args);

		startText();
	}

	public static void startText() {
		System.out.println("********************");
		System.out.println("appliation started");
		System.out.println("********************");
	}

	// @GetMapping(value = "/createuser")
	// public String genFirsrtAcc(){
	// 	User fUser = new User();
	// 	fUser.setId(1);
	// 	fUser.setUsername("dinuka123");
	// 	fUser.setEmail("dinuka@gmail.com");
	// 	fUser.setPassword(bcrptpwencoder.encode("12345"));
	// 	fUser.setFirstname("dinuka");
	// 	fUser.setLastname("pramod");
	// 	fUser.setDob(LocalDate.now());
	// 	fUser.setBase_currency("LKR");
	// 	fUser.setCreated_at(LocalDateTime.now().minusDays(2));
	// 	fUser.setStatus(true);
	// 	fUser.setIs_verified(true);

	// 	uDao.save(fUser);

	// 	return "<script>window.location.replace('localhost:8080/login');</script>";
	// }

}

/*
firstname varchar(45) 
lastname varchar(45) 
dob date 
base_currency varchar(20) 
created_at datetime 
status tinyint 
isVerified tinyint */
