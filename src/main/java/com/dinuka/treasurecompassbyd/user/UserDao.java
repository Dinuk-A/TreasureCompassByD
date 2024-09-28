package com.dinuka.treasurecompassbyd.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserDao extends JpaRepository<User , Integer> {
    
    User findByEmail(String email);

    // User findByUsername(String username);

     // FILTER THE USER BY GIVEN USER NAME
    @Query(value = "select u from User u where u.username=?1")
    public User getByUName(String username);

    //get user by user id
    @Query(value = "select u from User u where u.id =?1")
    public User getUserByUserId(int userID);

}
