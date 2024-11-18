package com.newsapp.user.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {

    private static final String TOPIC = "user_credentials";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendCredentials(String email, String password) {
        kafkaTemplate.send(TOPIC, email + "," + password);
    }
}