"use client";
import React from "react";
import { Chip, Divider, Typography, Box, Grid, Card, CardContent } from "@mui/material";

interface Props {
  candidate: CandidateDetailModel;
}

const CandidateDetailView: React.FC<Props> = ({ candidate }) => {
  const renderStringArray = (items: string[] | undefined, title: string) => {
    if (!items || items.length === 0) return null;

    return (
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {items.map((item, index) => (
            <Chip key={index} label={item} variant="outlined" size="small" />
          ))}
        </Box>
      </Box>
    );
  };

  const renderEducation = () => {
    if (candidate.structured_education && candidate.structured_education.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          {candidate.structured_education.map((edu, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.school_name}
                </Typography>
                {(edu.start_year || edu.end_year) && (
                  <Typography variant="body2" color="text.secondary">
                    {edu.start_year} - {edu.end_year || "Present"}
                  </Typography>
                )}
                {edu.gpa && (
                  <Typography variant="body2" color="text.secondary">
                    GPA: {edu.gpa}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    if (candidate.education && candidate.education.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          {candidate.education.map((edu, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.school_name}
                </Typography>
                {(edu.start_year || edu.end_year) && (
                  <Typography variant="body2" color="text.secondary">
                    {edu.start_year} - {edu.end_year || "Present"}
                  </Typography>
                )}
                {edu.gpa && (
                  <Typography variant="body2" color="text.secondary">
                    GPA: {edu.gpa}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    return renderStringArray(candidate.degree, "Education (Legacy Data)");
  };

  const renderExperience = () => {
    if (candidate.structured_experience && candidate.structured_experience.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Work Experience
          </Typography>
          {candidate.structured_experience.map((exp, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.job_title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.company_name} {exp.location && `- ${exp.location}`}
                </Typography>
                {(exp.start_date || exp.end_date) && (
                  <Typography variant="body2" color="text.secondary">
                    {exp.start_date} - {exp.end_date || "Present"}
                  </Typography>
                )}
                {exp.responsibilities && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                      Key Responsibilities:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {exp.responsibilities}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    return renderStringArray(candidate.experience, "Work Experience (Legacy Data)");
  };

  const renderSkills = () => {
    if (candidate.structured_skills && candidate.structured_skills.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {candidate.structured_skills.map((skill, index) => (
              <Chip
                key={index}
                label={`${skill.name}${skill.level ? ` (${skill.level})` : ""}`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      );
    }

    if (candidate.skills && candidate.skills.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {candidate.skills.map((skill, index) => (
              <Chip
                key={index}
                label={`${skill.name}${skill.level ? ` (${skill.level})` : ""}`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      );
    }

    return (
      <>
        {renderStringArray(candidate.technical_skill, "Technical Skills")}
        {renderStringArray(candidate.soft_skill, "Soft Skills")}
      </>
    );
  };

  const renderCertifications = () => {
    if (candidate.structured_certifications && candidate.structured_certifications.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Certifications
          </Typography>
          {candidate.structured_certifications.map((cert, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {cert.name}
                </Typography>
                {cert.issuer && (
                  <Typography variant="body2" color="text.secondary">
                    Issued by: {cert.issuer}
                  </Typography>
                )}
                {(cert.issue_date || cert.expiration_date) && (
                  <Typography variant="body2" color="text.secondary">
                    {cert.issue_date} {cert.expiration_date && `- ${cert.expiration_date}`}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    if (candidate.certifications && candidate.certifications.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Certifications
          </Typography>
          {candidate.certifications.map((cert, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {cert.name}
                </Typography>
                {cert.issuer && (
                  <Typography variant="body2" color="text.secondary">
                    Issued by: {cert.issuer}
                  </Typography>
                )}
                {(cert.issue_date || cert.expiration_date) && (
                  <Typography variant="body2" color="text.secondary">
                    {cert.issue_date} {cert.expiration_date && `- ${cert.expiration_date}`}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    return renderStringArray(candidate.certificate, "Certifications (Legacy Data)");
  };

  const renderLanguages = () => {
    if (!candidate.languages || candidate.languages.length === 0) return null;

    return (
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          Languages
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {candidate.languages.map((lang, index) => (
            <Chip
              key={index}
              label={`${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ""}`}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderAwards = () => {
    if (!candidate.awards || candidate.awards.length === 0) return null;

    return (
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          Awards & Achievements
        </Typography>
        {candidate.awards.map((award, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {award.title}
              </Typography>
              {award.year && (
                <Typography variant="body2" color="text.secondary">
                  Year: {award.year}
                </Typography>
              )}
              {award.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {award.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          {candidate.candidate_name || candidate.full_name || "Unnamed Candidate"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Email: {candidate.email}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Phone: {candidate.phone_number || candidate.phone}
        </Typography>
        {candidate.address && (
          <Typography variant="body1" color="text.secondary">
            Address: {candidate.address}
          </Typography>
        )}
        {candidate.date_of_birth && (
          <Typography variant="body1" color="text.secondary">
            Date of Birth: {candidate.date_of_birth}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          CV File: {candidate.cv_name}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {(candidate.summary || candidate.comment) && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1">{candidate.summary || candidate.comment}</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderEducation()}
          {renderExperience()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSkills()}
          {renderCertifications()}
          {renderLanguages()}
          {renderAwards()}
          {renderStringArray(candidate.responsibility, "Responsibilities")}
        </Grid>
      </Grid>

      {candidate.job_recommended && candidate.job_recommended.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Recommended Jobs
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {(Array.isArray(candidate.job_recommended)
              ? candidate.job_recommended
              : [candidate.job_recommended]
            ).map((job, index) => (
              <Chip key={index} label={job} color="primary" />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CandidateDetailView;
