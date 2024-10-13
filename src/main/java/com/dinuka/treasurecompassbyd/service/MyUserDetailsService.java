package com.dinuka.treasurecompassbyd.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dinuka.treasurecompassbyd.user.User;
import com.dinuka.treasurecompassbyd.user.UserDao;

import jakarta.transaction.Transactional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDao uDao;

    @Override
    @Transactional
      public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        System.out.println("Logged User Email:" + email);

        User loggedUser = uDao.getUserByEmail(email);

        if (loggedUser == null) {
            throw new UsernameNotFoundException("Email not found" + email);
        }

        Set <GrantedAuthority> authSet = new HashSet<>();

        ArrayList<GrantedAuthority> authArrayList = new ArrayList<GrantedAuthority>(authSet);

        return new org.springframework.security.core.userdetails.User(loggedUser.getEmail(),loggedUser.getPassword(),loggedUser.getStatus(),true,true,true,authArrayList);

    }

    //original   
    //log by username
    // public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    //     System.out.println("Logged User :" + username);

    //     User loggedUser = uDao.getByUName(username);

    //     if (loggedUser == null) {
    //         throw new UsernameNotFoundException("UN not found" + username);
    //     }

    //     Set <GrantedAuthority> authSet = new HashSet<>();

    //     ArrayList<GrantedAuthority> authArrayList = new ArrayList<GrantedAuthority>(authSet);

    //     return new org.springframework.security.core.userdetails.User(loggedUser.getUsername(),loggedUser.getPassword(),loggedUser.getStatus(),true,true,true,authArrayList);

    // }

}
