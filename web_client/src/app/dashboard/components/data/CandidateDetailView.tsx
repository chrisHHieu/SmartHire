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
    // Use structured education data if available
    if (candidate.structured_education && candidate.structured_education.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Học Vấn
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
                    {edu.start_year} - {edu.end_year || "Hiện tại"}
                  </Typography>
                )}
                {edu.gpa && (
                  <Typography variant="body2" color="text.secondary">
                    Điểm trung bình: {edu.gpa}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    // Fallback to legacy education data
    if (candidate.education && candidate.education.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Học Vấn
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
                    {edu.start_year} - {edu.end_year || "Hiện tại"}
                  </Typography>
                )}
                {edu.gpa && (
                  <Typography variant="body2" color="text.secondary">
                    Điểm trung bình: {edu.gpa}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    // Final fallback to string array
    return renderStringArray(candidate.degree, "Học Vấn (Dữ liệu cũ)");
  };

  const renderExperience = () => {
    // Use structured experience data if available
    if (candidate.structured_experience && candidate.structured_experience.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Kinh Nghiệm Làm Việc
          </Typography>
          {candidate.structured_experience.map((exp, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.job_title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.company_name} {exp.location && `• ${exp.location}`}
                </Typography>
                {(exp.start_date || exp.end_date) && (
                  <Typography variant="body2" color="text.secondary">
                    {exp.start_date} - {exp.end_date || "Hiện tại"}
                  </Typography>
                )}
                {exp.responsibilities && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                      Trách Nhiệm Chính:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
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

    // Fallback to legacy experience data as string array
    return renderStringArray(candidate.experience, "Kinh Nghiệm Làm Việc (Dữ liệu cũ)");
  };

  const renderSkills = () => {
    // Use structured skills data if available
    if (candidate.structured_skills && candidate.structured_skills.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Kỹ Năng
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {candidate.structured_skills.map((skill, index) => (
              <Chip
                key={index}
                label={`${skill.name}${skill.level ? ` (${skill.level})` : ''}`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      );
    }

    // Fallback to legacy skills data
    if (candidate.skills && candidate.skills.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Kỹ Năng
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {candidate.skills.map((skill, index) => (
              <Chip
                key={index}
                label={`${skill.name}${skill.level ? ` (${skill.level})` : ''}`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      );
    }

    // Final fallback to string arrays
    return (
      <>
        {renderStringArray(candidate.technical_skill, "Kỹ Năng Chuyên Môn")}
        {renderStringArray(candidate.soft_skill, "Kỹ Năng Mềm")}
      </>
    );
  };

  const renderCertifications = () => {
    // Use structured certifications data if available
    if (candidate.structured_certifications && candidate.structured_certifications.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Chứng Chỉ
          </Typography>
          {candidate.structured_certifications.map((cert, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {cert.name}
                </Typography>
                {cert.issuer && (
                  <Typography variant="body2" color="text.secondary">
                    Cấp bởi: {cert.issuer}
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

    // Fallback to legacy certifications data
    if (candidate.certifications && candidate.certifications.length > 0) {
      return (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Chứng Chỉ
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

    // Final fallback to string array
    return renderStringArray(candidate.certificate, "Chứng Chỉ (Dữ liệu cũ)");
  };

  const renderLanguages = () => {
    if (!candidate.languages || candidate.languages.length === 0) return null;

    return (
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          Ngôn Ngữ
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {candidate.languages.map((lang, index) => (
            <Chip
              key={index}
              label={`${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ''}`}
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
          Giải Thưởng & Thành Tích
        </Typography>
        {candidate.awards.map((award, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {award.title}
              </Typography>
              {award.year && (
                <Typography variant="body2" color="text.secondary">
                  Năm: {award.year}
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
      {/* Basic Information */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          {candidate.candidate_name || candidate.full_name || "Ứng Viên Chưa Rõ Tên"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          📧 {candidate.email}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          📞 {candidate.phone_number || candidate.phone}
        </Typography>
        {candidate.address && (
          <Typography variant="body1" color="text.secondary">
            📍 {candidate.address}
          </Typography>
        )}
        {candidate.date_of_birth && (
          <Typography variant="body1" color="text.secondary">
            🎂 {candidate.date_of_birth}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Tên CV: {candidate.cv_name}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Summary */}
      {(candidate.summary || candidate.comment) && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Tóm Tắt
          </Typography>
          <Typography variant="body1">
            {candidate.summary || candidate.comment}
          </Typography>
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
          {renderStringArray(candidate.responsibility, "Trách Nhiệm")}
        </Grid>
      </Grid>

      {/* Job Recommendations */}
      {candidate.job_recommended && candidate.job_recommended.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Việc Làm Đề Xuất
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
