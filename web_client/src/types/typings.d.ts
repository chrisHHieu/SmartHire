type RoleModel = {
  id: number;
  name: string;
  description: string;
};

type PermissionModel = {
  id: number;
  name: string;
  description: string;
  roles: RoleModel[];
};

type FAQCategoryModel = {
  id: number;
  name: string;
};

type DocumentsModel = {
  id: number;
  faq_id: number;
  page: string;
  document: string;
};

type AddDocumentModel = {
  document: string;
  page: string;
};

interface InputItem {
  documentname: string;
  number: number;
}

interface MessageType {
  text: string;
  createdAt: any;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}

interface MessageData {
  id: number;
  data: {
    question: string;
    answer: string;
  };
}

interface UserModel {
  id: number;
  email: string;
  display_name: string;
  created_at: string;
  block: boolean;
  roles: RoleModel[];
}

// New structured data types matching analysis service
interface Education {
  school_name: string;
  degree?: string;
  field_of_study?: string;
  start_year?: number;
  end_year?: number;
  gpa?: number;
}

interface WorkExperience {
  job_title: string;
  company_name: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  responsibilities?: string;
}

interface Certification {
  name: string;
  issuer?: string;
  issue_date?: string;
  expiration_date?: string;
}

interface Language {
  name: string;
  proficiency?: string;
}

interface Skill {
  name: string;
  level?: string;
}

interface Award {
  title: string;
  description?: string;
  year?: number;
}

// Updated candidate model with structured data
interface CandidateDetailModel {
  _id: string;
  candidate_name: string;
  phone_number: string;
  email: string;
  comment: string;
  job_recommended: string[];
  cv_name: string;
  created_at: any;

  // Legacy fields (for backward compatibility)
  degree: string[];
  experience: string[];
  responsibility: string[];
  soft_skill: string[];
  technical_skill: string[];
  certificate: string[];

  // New structured fields
  full_name?: string;
  phone?: string;
  address?: string;
  summary?: string;
  date_of_birth?: string;
  education?: Education[];
  structured_experience?: WorkExperience[];
  structured_education?: Education[];
  structured_skills?: Skill[];
  structured_certifications?: Certification[];
  skills?: Skill[];
  certifications?: Certification[];
  languages?: Language[];
  awards?: Award[];
  avatar_url?: string;
}

interface JobDetailModel {
  _id: string;
  job_name: string;
  job_description?: string;
  created_at: any;
  degree: string[];
  experience: string[];
  responsibility: string[];
  soft_skill: string[];
  technical_skill: string[];
  certificate: string[];

  // Additional fields from api_server schema
  education?: string[];
  certification?: string[];
  experiment?: string[];
  responsibilities?: string[];
  soft_skills?: string[];
  technical_skills?: string[];
}

// Score detail for matching analysis
interface ScoreDetail {
  score: number | null;
  comment: string | null;
}

// Weight analysis metadata
interface WeightAnalysisMetadata {
  dynamic_weights: Record<string, number>;
  ai_confidence: number;
  job_analysis: Record<string, any>;
  weight_reasoning: Record<string, any>;
}

interface MatchingDetailModel {
  _id: string;
  candidate_name: string | null;
  email: string | null;
  phone_number: string | null;
  job_recommended: string[] | null;
  cv_name: string | null;
  job_name: string | null;
  score: number | null;
  summary_comment: string | null;

  // Detailed scoring
  degree: ScoreDetail | null;
  experience: ScoreDetail | null;
  responsibility: ScoreDetail | null;
  soft_skill: ScoreDetail | null;
  technical_skill: ScoreDetail | null;
  certificate: ScoreDetail | null;
  language?: ScoreDetail | null;

  // New AI-powered features
  weight_analysis?: WeightAnalysisMetadata | null;
}

interface CandidateModel {
  _id: string;
  candidate_name: string;
  phone_number: string;
  email: string;
  comment: string;
  job_recommended: string | string[];
  cv_name: string;
  created_at: any;

  // Legacy fields (for backward compatibility)
  degree: string[];
  experience: string[];
  responsibility: string[];
  soft_skill: string[];
  technical_skill: string[];
  certificate: string[];

  // New structured fields
  full_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  summary?: string;
  education?: Education[];
  structured_experience?: WorkExperience[];
  structured_education?: Education[];
  structured_skills?: Skill[];
  structured_certifications?: Certification[];
  skills?: Skill[];
  certifications?: Certification[];
  languages?: Language[];
  awards?: Award[];
  avatar_url?: string;
}

interface CandidateResponseModel {
  results: CandidateModel[];
  total_file: number;
  total_page: number;
}

interface ChannelModel {
  id: number;
  name: string;
}

interface GetListQAHistoryModel {
  results: QAHistoryModel[];
  total_qa: number;
  total_page: number;
}

interface QAHistoryModel {
  id: number;
  question: string;
  answer: string;
  feedback: number;
  llm: string;
  time_question: string;
  time_answer: string;
  channel: ChannelModel;
  user: UserModel;
  id_faq: boolean;
  is_faq: number;
}

interface FeedbackModel {
  feedback: number;
}

interface FilesToLLM {
  file_id: number;
  llm: string;
}

interface FAQModel {
  id: number;
  question: string;
  answer: string;
  documents: DocumentsModel[];
  used: number;
  created_at: string;
  faq_category: FAQCategoryModel;
}

interface JobModel {
  _id: string;
  job_name: string;
  job_description: string;
  created_at: string;
}

interface FAQResponeModel {
  results: JobModel[];
  total_page: number;
  total_job: number;
}

interface JobMatchingModel {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  cv_name: string;
  score: string;
  summary_comment: string;
  matching_status: boolean;
}

interface JobMatchingResponeModel {
  results: JobMatchingModel[];
  total_page: number;
  total_matching: number;
}

interface ModifyFAQModel {
  job_name: string;
  job_description: string;
}

interface DataFormModel {
  id?: number;
  job_name: string;
  job_description: string;
}
