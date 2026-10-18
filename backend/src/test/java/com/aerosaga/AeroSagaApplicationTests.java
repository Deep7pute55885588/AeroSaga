package com.aerosaga;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.aerosaga.activity.DroneActivitiesImpl;
import org.junit.jupiter.api.Test;

class AeroSagaApplicationTests {

    @Test
    void simulatedTakeoffReturnsMeaningfulResult() {
        assertEquals(
                "Drone DRONE-001 takeoff simulated successfully",
                new DroneActivitiesImpl().takeoff("DRONE-001"));
    }
}
