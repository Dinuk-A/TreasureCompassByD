package com.dinuka.treasurecompassbyd.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.dinuka.treasurecompassbyd.user.User;
import com.dinuka.treasurecompassbyd.user.UserDao;

@RestController
public class LoginController {
    
    @Autowired
    private UserDao uDao;

    @GetMapping(value = "/login")
    public ModelAndView loginUI() {
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("login.html");
        return loginView;
    }

    @GetMapping(value = "/dashboard")
    public ModelAndView dashboardUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // User loggedUser = uDao.getByUName(auth.getName());
        User loggedUser = uDao.getUserByEmail(auth.getName());

        ModelAndView dbView = new ModelAndView();

        dbView.setViewName("dashboard.html");

        dbView.addObject("loggedusername", auth.getName());
        dbView.addObject("loggeduserID", loggedUser.getId());

        dbView.addObject("cashInHandBalance", loggedUser.getCash_in_hand());

        dbView.addObject("baseCurrencyCode", loggedUser.getBase_currency_id().getCode());
       
        return dbView;
    }

    @GetMapping(value = "/error")
    public ModelAndView errorUi() {
        ModelAndView errorView = new ModelAndView();
        errorView.setViewName("error.html");
        return errorView;
    }

   

}
