package com.aerosaga.activity;

import io.temporal.activity.Activity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DroneActivitiesImpl implements DroneActivities {

    private static final Logger logger = LoggerFactory.getLogger(DroneActivitiesImpl.class);

    @Override
    public String takeoff(String droneId) {
        String result = "Drone " + droneId + " takeoff simulated successfully";
        logger.info("Simulated drone operation completed: {}", result);
        return result;
    }
}
