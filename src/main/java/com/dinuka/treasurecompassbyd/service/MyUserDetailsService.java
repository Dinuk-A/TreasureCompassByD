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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("Logged User :" + username);

        User loggedUser = uDao.getByUName(username);

        if (loggedUser == null) {
            throw new UsernameNotFoundException("UN not found" + username);
        }

        Set <GrantedAuthority> authSet = new HashSet<>();

        ArrayList<GrantedAuthority> authArrayList = new ArrayList<GrantedAuthority>(authSet);

        return new org.springframework.security.core.userdetails.User(loggedUser.getUsername(),loggedUser.getPassword(),loggedUser.getStatus(),true,true,true,authArrayList);

    }

}
