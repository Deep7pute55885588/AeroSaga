package com.aerosaga.workflow;

import com.aerosaga.activity.DroneActivities;
import io.temporal.activity.ActivityOptions;
import io.temporal.workflow.Workflow;
import java.time.Duration;

public class DroneMissionWorkflowImpl implements DroneMissionWorkflow {

    private final DroneActivities activities = Workflow.newActivityStub(
            DroneActivities.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofSeconds(30))
                    .build());

    @Override
    public String simulateTakeoff(String droneId) {
        return activities.takeoff(droneId);
    }
}
