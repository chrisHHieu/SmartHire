"use client";
import React from "react";
import {
  Chip,
  Divider,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";

interface Props {
  matching: MatchingDetailModel;
}

const MatchingDetailView: React.FC<Props> = ({ matching }) => {
  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return "default";
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  const getProgressColor = (
    score: number | null
  ): "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (score === null || score === undefined) return "primary";
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  const getScoreValue = (score: number | null) => {
    return score !== null && score !== undefined ? score : 0;
  };

  const renderScoreSection = (title: string, scoreDetail: ScoreDetail | null) => {
    if (!scoreDetail) {
      return (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" component="div" mb={1}>
              {title}
            </Typography>
            <Chip label="No Data" color="default" variant="outlined" size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No analysis data is available for this criterion.
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const score = scoreDetail.score;
    const comment = scoreDetail.comment;

    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            {score !== null && score !== undefined ? (
              <Chip label={`${score}%`} color={getScoreColor(score)} variant="filled" size="small" />
            ) : (
              <Chip label="N/A" color="default" variant="outlined" size="small" />
            )}
          </Box>

          {score !== null && score !== undefined && (
            <LinearProgress
              variant="determinate"
              value={score}
              color={getProgressColor(score)}
              sx={{ mb: 1, height: 8, borderRadius: 4 }}
            />
          )}

          <Typography variant="body2" color="text.secondary">
            <strong>Comment:</strong> {comment || "No analysis available"}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Score:</strong> {score !== null && score !== undefined ? score : "N/A"}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const formatScore = (score: number | null) => {
    if (score !== null && score !== undefined) {
      return `${score.toFixed(1)}%`;
    }
    return "0%";
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h5" gutterBottom color="primary">
          Candidate Matching Analysis Details
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Candidate Name:</strong> {matching.candidate_name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Candidate Phone:</strong> {matching.phone_number || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Candidate CV:</strong> {matching.cv_name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Job Title:</strong> {matching.job_name || "N/A"}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Match Score
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <LinearProgress
              variant="determinate"
              value={getScoreValue(matching.score)}
              color={getProgressColor(matching.score)}
              sx={{ flexGrow: 1, height: 12, borderRadius: 6 }}
            />
            <Typography variant="h6" color="primary">
              {formatScore(matching.score)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Candidate Summary
          </Typography>
          <Typography
            variant="body1"
            sx={{
              backgroundColor: "grey.50",
              p: 2,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            {matching.summary_comment || "No summary available"}
          </Typography>
        </Box>

        {matching.job_recommended && matching.job_recommended.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Jobs
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {matching.job_recommended.map((job, index) => (
                <Chip key={index} label={job} color="primary" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" gutterBottom color="primary">
        Detailed Breakdown
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {renderScoreSection("Education", matching.degree)}
          {renderScoreSection("Experience", matching.experience)}
          {renderScoreSection("Responsibilities", matching.responsibility)}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderScoreSection("Technical Skills", matching.technical_skill)}
          {renderScoreSection("Soft Skills", matching.soft_skill)}
          {renderScoreSection("Certifications", matching.certificate)}
          {matching.language && renderScoreSection("Language Skills", matching.language)}
        </Grid>
      </Grid>

      {matching.weight_analysis && (
        <Box mt={3}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom color="primary">
            AI Weight Analysis
          </Typography>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <strong>AI Confidence:</strong> {matching.weight_analysis.ai_confidence}%
              </Typography>
              {matching.weight_analysis.dynamic_weights && (
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Dynamic Weights:</strong>
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {Object.entries(matching.weight_analysis.dynamic_weights).map(
                      ([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${(value * 100).toFixed(1)}%`}
                          size="small"
                          variant="outlined"
                        />
                      )
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default MatchingDetailView;
