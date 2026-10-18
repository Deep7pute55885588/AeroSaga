package com.aerosaga;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AeroSagaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AeroSagaApplication.class, args);
    }
}
