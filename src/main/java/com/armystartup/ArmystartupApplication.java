package com.armystartup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ArmystartupApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArmystartupApplication.class, args);
    }
}
