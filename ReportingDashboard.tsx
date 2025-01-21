import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid2 from "@mui/material/Grid2"; // Correct import for Grid2
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import reportingData from "./reporting.json";

// TypeScript Interfaces
interface FeatureData {
    numberOfBuilds: number;
    numberOfBuildsPassed: number;
    numberOfBuildsFailed: number;
    successRatePercentage: number;
    failureRatePercentage: number;
}

interface ScenarioData {
    numberOfBuilds: number;
    numberOfBuildsPassed: number;
    numberOfBuildsFailed: number;
    successRatePercentage: number;
    failureRatePercentage: number;
    features: {
        [featureName: string]: FeatureData;
    };
}

interface ReportingData {
    [scenario: string]: ScenarioData;
}

const ReportingDashboard: React.FC = () => {
    const [data, setData] = useState<ReportingData | null>(null);

    // Load data on component mount
    useEffect(() => {
        setData(reportingData as ReportingData);
    }, []);

    if (!data) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Reporting Dashboard
            </Typography>

            <Grid2 container spacing={4} columns={12}>
                {Object.entries(data).map(([scenarioName, scenarioData]) => (
                    <Grid2 key={scenarioName} size={24}>
                        <Paper sx={{ padding: 4, height: "100%" }}>
                            {/* Scenario Header */}
                            <Typography variant="h5" gutterBottom>
                                {scenarioName.replace("-", " ").toUpperCase()}
                            </Typography>
                            <Divider sx={{ marginBottom: 4 }} />
                            <Typography variant="body1" gutterBottom>
                                Total Builds: {scenarioData.numberOfBuilds}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Builds Passed: {scenarioData.numberOfBuildsPassed} | Builds Failed:{" "}
                                {scenarioData.numberOfBuildsFailed}
                            </Typography>

                            {/* Combined Success and Failure Gauge */}
                            <Grid2 container justifyContent="center" sx={{ marginBottom: 2 }}>
                                <Gauge
                                    value={scenarioData.successRatePercentage}
                                    sx={{
                                        height: 150,
                                        [`& .${gaugeClasses.valueText}`]: { fontSize: 30 },
                                        [`& .${gaugeClasses.valueArc}`]: { fill: "#4caf50" },
                                        [`& .${gaugeClasses.referenceArc}`]: { fill: "#f44336" },
                                    }}
                                />
                                <Typography align="center" variant="caption">
                                    Success: {scenarioData.successRatePercentage}% | Failure:{" "}
                                    {scenarioData.failureRatePercentage}%
                                </Typography>
                            </Grid2>

                            {/* Features for the Scenario */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">Features</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                                        <Grid2 container spacing={2} columns={12}>
                                            {Object.entries(scenarioData.features).map(
                                                ([featureName, featureData]) => (
                                                    <Grid2 key={featureName} size={12}>
                                                        <Paper sx={{ padding: 2 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                align="center"
                                                            >
                                                                {featureName}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Total Builds:{" "}
                                                                {featureData.numberOfBuilds}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Builds Passed:{" "}
                                                                {featureData.numberOfBuildsPassed} |{" "}
                                                                Builds Failed:{" "}
                                                                {featureData.numberOfBuildsFailed}
                                                            </Typography>
                                                            <Gauge
                                                                value={
                                                                    featureData.successRatePercentage
                                                                }
                                                                sx={{
                                                                    height: 120,
                                                                    [`& .${gaugeClasses.valueText}`]:
                                                                        { fontSize: 20 },
                                                                    [`& .${gaugeClasses.valueArc}`]:
                                                                        { fill: "#4caf50" },
                                                                    [`& .${gaugeClasses.referenceArc}`]:
                                                                        { fill: "#f44336" },
                                                                }}
                                                            />
                                                            <Typography align="center" variant="caption">
                                                                Success:{" "}
                                                                {featureData.successRatePercentage}%{" "}
                                                                | Failure:{" "}
                                                                {featureData.failureRatePercentage}%
                                                            </Typography>
                                                        </Paper>
                                                    </Grid2>
                                                )
                                            )}
                                        </Grid2>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

export default ReportingDashboard;
