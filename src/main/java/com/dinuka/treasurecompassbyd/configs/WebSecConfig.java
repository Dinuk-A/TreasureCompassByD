package com.dinuka.treasurecompassbyd.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecConfig {

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests((auth) -> {
            auth
                    .requestMatchers("JSfiles/**", "resources/**").permitAll()

                    .requestMatchers("/login").permitAll()
                    .requestMatchers("/signup").permitAll()
                    .requestMatchers("/error").permitAll()
                    .requestMatchers("/user/initialsignup").permitAll()
                    // .requestMatchers("/user/**").permitAll()
                    .requestMatchers("/dashboard").permitAll()
                    .requestMatchers("/createuser").permitAll()
                    .anyRequest().authenticated();
        })

                .formLogin((logins) -> {
                    logins
                            .loginPage("/login")
                            .usernameParameter("email")
                            .passwordParameter("password")
                            .defaultSuccessUrl("/dashboard", true)
                            .failureUrl("/login?error=invalidusernamepassword");
                })

                .logout((logout) -> {
                    logout
                            .logoutUrl("/logout")
                            .logoutSuccessUrl("/login");
                })

                .csrf((csrf) -> csrf.disable())

                .exceptionHandling((exp) -> exp.accessDeniedPage("/error"));

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }

}
