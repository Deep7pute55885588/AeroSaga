package com.aerosaga.config;

import com.aerosaga.activity.DroneActivitiesImpl;
import com.aerosaga.workflow.DroneMissionWorkflowImpl;
import io.temporal.client.WorkflowClient;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AeroSagaProperties.class)
public class TemporalConfig {

    @Bean(destroyMethod = "shutdown")
    WorkflowServiceStubs workflowServiceStubs(AeroSagaProperties properties) {
        return WorkflowServiceStubs.newServiceStubs(
                io.temporal.serviceclient.WorkflowServiceStubsOptions.newBuilder()
                        .setTarget(properties.temporal().serviceAddress())
                        .build());
    }

    @Bean
    WorkflowClient workflowClient(WorkflowServiceStubs serviceStubs, AeroSagaProperties properties) {
        return WorkflowClient.newInstance(serviceStubs,
                io.temporal.client.WorkflowClientOptions.newBuilder()
                        .setNamespace(properties.temporal().namespace())
                        .build());
    }

    @Bean(destroyMethod = "shutdown")
    WorkerFactory workerFactory(WorkflowClient workflowClient, AeroSagaProperties properties) {
        WorkerFactory factory = WorkerFactory.newInstance(workflowClient);
        Worker worker = factory.newWorker(properties.temporal().taskQueue());
        worker.registerWorkflowImplementationTypes(DroneMissionWorkflowImpl.class);
        worker.registerActivitiesImplementations(new DroneActivitiesImpl());
        factory.start();
        return factory;
    }
}
