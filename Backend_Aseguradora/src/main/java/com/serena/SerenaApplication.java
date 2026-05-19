package com.serena;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SerenaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SerenaApplication.class, args);
	}

}
