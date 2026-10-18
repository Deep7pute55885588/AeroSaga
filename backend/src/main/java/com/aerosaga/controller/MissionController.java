package com.aerosaga.controller;

import com.aerosaga.config.AeroSagaProperties;
import com.aerosaga.workflow.DroneMissionWorkflow;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowExecutionAlreadyStarted;
import io.temporal.client.WorkflowOptions;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/missions")
public class MissionController {

    private static final Logger logger = LoggerFactory.getLogger(MissionController.class);

    private final WorkflowClient workflowClient;
    private final AeroSagaProperties properties;

    public MissionController(WorkflowClient workflowClient, AeroSagaProperties properties) {
        this.workflowClient = workflowClient;
        this.properties = properties;
    }

    @PostMapping("/takeoff")
    public ResponseEntity<TakeoffResponse> takeoff(@RequestBody(required = false) TakeoffRequest request) {
        String droneId = request == null || request.droneId() == null || request.droneId().isBlank()
                ? "DRONE-001"
                : request.droneId().trim();
        String workflowId = "drone-takeoff-" + droneId.toLowerCase() + "-" + UUID.randomUUID();

        try {
            DroneMissionWorkflow workflow = workflowClient.newWorkflowStub(
                    DroneMissionWorkflow.class,
                    WorkflowOptions.newBuilder()
                            .setTaskQueue(properties.temporal().taskQueue())
                            .setWorkflowId(workflowId)
                            .build());
            String result = WorkflowClient.execute(workflow::simulateTakeoff, droneId).join();
            logger.info("Temporal workflow {} completed for {}", workflowId, droneId);
            return ResponseEntity.ok(new TakeoffResponse(workflowId, droneId, "COMPLETED", result, Instant.now()));
        } catch (WorkflowExecutionAlreadyStarted exception) {
            logger.warn("Workflow {} was already started", workflowId, exception);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new TakeoffResponse(workflowId, droneId, "CONFLICT", "A workflow with this ID is already running", Instant.now()));
        } catch (RuntimeException exception) {
            logger.error("Unable to execute Temporal workflow {}", workflowId, exception);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new TakeoffResponse(workflowId, droneId, "FAILED", "Temporal service is unavailable", Instant.now()));
        }
    }

    @GetMapping("/takeoff/{workflowId}")
    public TakeoffStatusResponse status(@PathVariable String workflowId) {
        DroneMissionWorkflow workflow = workflowClient.newUntypedWorkflowStub(workflowId);
        try {
            String result = workflow.getResult(String.class);
            return new TakeoffStatusResponse(workflowId, "COMPLETED", result);
        } catch (RuntimeException exception) {
            logger.debug("Workflow {} is not complete", workflowId, exception);
            return new TakeoffStatusResponse(workflowId, "RUNNING_OR_UNAVAILABLE", null);
        }
    }

    public record TakeoffRequest(String droneId) {
    }

    public record TakeoffResponse(String workflowId, String droneId, String status, String message, Instant completedAt) {
    }

    public record TakeoffStatusResponse(String workflowId, String status, String result) {
    }
}
