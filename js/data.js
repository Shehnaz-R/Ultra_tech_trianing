/**
 * UltraTech Environmental Consultancy & Laboratory (ultratech.in)
 * Pre-seeded realistic dataset for Training Operations Portal
 */

export const ULTRATECH_DATA = {
  organization: {
    name: "UltraTech Environmental Consultancy & Laboratory",
    shortName: "UltraTech",
    tagline: "37+ Years of Excellence in Environmental Clearance, Engineering & Lab Analysis",
    website: "https://ultratech.in",
    logoText: "ULTRATECH",
    logoSub: "Environmental Operations"
  },

  // The 12 UltraTech Departments
  departments: [
    { id: "dept-01", name: "Environmental Media Monitoring & Lab Analysis", code: "EMM-LAB", headId: "user-head-01", headName: "Priya Nair", staffCount: 18, pendingSignoffs: 3, openRequests: 5 },
    { id: "dept-02", name: "Environmental Clearance & EIA", code: "EC-EIA", headId: "user-head-02", headName: "Dr. Rajeshwar Kulkarni", staffCount: 14, pendingSignoffs: 1, openRequests: 4 },
    { id: "dept-03", name: "Turnkey Engineering & Project Consultancy", code: "TEPC", headId: "user-head-03", headName: "Manish Verma", staffCount: 16, pendingSignoffs: 2, openRequests: 3 },
    { id: "dept-04", name: "STP / ETP Operation & Maintenance", code: "STP-ETP", headId: "user-head-04", headName: "Sanjay Deshmukh", staffCount: 22, pendingSignoffs: 4, openRequests: 6 },
    { id: "dept-05", name: "Environmental & Social Due Diligence (ESDD)", code: "ESDD", headId: "user-head-05", headName: "Meera Subramanian", staffCount: 10, pendingSignoffs: 0, openRequests: 2 },
    { id: "dept-06", name: "Environmental Regulatory Compliance", code: "ERC", headId: "user-head-06", headName: "Adv. Harish Bhat", staffCount: 12, pendingSignoffs: 2, openRequests: 3 },
    { id: "dept-07", name: "Air Quality Monitoring & Stack Testing", code: "AQM-ST", headId: "user-head-07", headName: "Gaurav Sen", staffCount: 15, pendingSignoffs: 3, openRequests: 5 },
    { id: "dept-08", name: "Chemical & Microbiological Lab Services", code: "CHEM-MIC", headId: "user-head-08", headName: "Dr. Sunita Rao", staffCount: 17, pendingSignoffs: 1, openRequests: 4 },
    { id: "dept-09", name: "Occupational Health, Safety & Environment (HSE)", code: "HSE-OPS", headId: "user-head-09", headName: "Col. R.K. Mathur", staffCount: 13, pendingSignoffs: 2, openRequests: 2 },
    { id: "dept-10", name: "Solid & Hazardous Waste Management", code: "SHWM", headId: "user-head-10", headName: "Anil Kapse", staffCount: 11, pendingSignoffs: 1, openRequests: 3 },
    { id: "dept-11", name: "Sustainability, Carbon & ESG Advisory", code: "ESG-ADV", headId: "user-head-11", headName: "Divya Krishnan", staffCount: 9, pendingSignoffs: 0, openRequests: 2 },
    { id: "dept-12", name: "GIS, Remote Sensing & Hydrogeological Modeling", code: "GIS-RS", headId: "user-head-12", headName: "Pradeep Joshi", staffCount: 8, pendingSignoffs: 1, openRequests: 2 }
  ],

  // Users for personas & team views
  users: [
    {
      id: "user-emp-01",
      role: "employee",
      name: "Rahul Sharma",
      email: "rahul.sharma@ultratech.in",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      position: "Senior Environmental Analyst",
      tenureYears: 4.2,
      headId: "user-head-01",
      headName: "Priya Nair",
      skills: ["Gas Chromatography (GC-MS)", "AAS Heavy Metal Analysis", "ISO 17025 Compliance", "Ambient Air Sampling", "ETP Effluent Characterization"],
      projects: [
        "Mumbai Trans Harbour Link (MTHL) Environmental Water Quality Baseline (2024–2025)",
        "Thane Industrial Zone Stack Emission Profiling & Isokinetic Sampling",
        "NABL Re-accreditation Audit Documentation Lead (Chemical Division)"
      ],
      completedCount: 6,
      avatarInitials: "RS"
    },
    {
      id: "user-head-01",
      role: "head",
      name: "Priya Nair",
      email: "priya.nair@ultratech.in",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      position: "Head of Department & Principal Chemist",
      tenureYears: 9.5,
      headId: "user-hr-01",
      headName: "Vikram Seth",
      skills: ["Analytical Method Validation", "NABL Assessor", "Instrumentation Calibration", "Lab Ops Management", "Team Mentorship"],
      projects: [
        "UltraTech Thane Central Laboratory Modernization & ICP-OES Commissioning",
        "CPCB Real-Time Water Quality Monitoring Network Integration",
        "Technical Advisory for Coastal Regulation Zone (CRZ) Baseline Studies"
      ],
      completedCount: 14,
      avatarInitials: "PN"
    },
    {
      id: "user-hr-01",
      role: "hr",
      name: "Vikram Seth",
      email: "vikram.seth@ultratech.in",
      departmentId: "dept-06",
      department: "Corporate HR & Talent Operations",
      position: "Head - People, Culture & Capability Development",
      tenureYears: 7.8,
      headId: null,
      headName: "Executive Director",
      skills: ["Competency Frameworks", "Statutory Compliance", "Leadership Development", "Workforce Allocation", "Audit & Governance"],
      projects: [
        "Pan-India Technical Capability Matrix & Certification Framework",
        "Annual Environmental Consultant Apprenticeship Scheme (Batch of 2025)",
        "Organization-wide NABL/QCI Training Compliance Audit"
      ],
      completedCount: 18,
      avatarInitials: "VS"
    },
    // Direct reports for Priya Nair (Dept 01)
    {
      id: "user-emp-02",
      role: "employee",
      name: "Ananya Sen",
      email: "ananya.sen@ultratech.in",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      position: "Junior Chemist - Trace Analysis",
      tenureYears: 2.1,
      headId: "user-head-01",
      headName: "Priya Nair",
      skills: ["Spectrophotometry", "BOD/COD Titrimetry", "GLP Standard Protocols"],
      projects: ["CETP Turbidity & Microbial Baseline Index 2024"],
      completedCount: 3,
      avatarInitials: "AS"
    },
    {
      id: "user-emp-03",
      role: "employee",
      name: "Amit Joshi",
      email: "amit.joshi@ultratech.in",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      position: "Field Technician Lead",
      tenureYears: 5.0,
      headId: "user-head-01",
      headName: "Priya Nair",
      skills: ["High Volume Sampler (RDS)", "Stack Monitoring Kit", "Noise Level Surveys"],
      projects: ["MIDC Industrial Flare Testing", "Navi Mumbai Airport Ambient Dust Audit"],
      completedCount: 7,
      avatarInitials: "AJ"
    },
    {
      id: "user-emp-04",
      role: "employee",
      name: "Sneha Roy",
      email: "sneha.roy@ultratech.in",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      position: "Senior Analytical Officer",
      tenureYears: 6.4,
      headId: "user-head-01",
      headName: "Priya Nair",
      skills: ["HPLC Chromatographic Profiling", "Method Uncertainty Estimation", "TOC Analysis"],
      projects: ["Pharmaceutical Effluent Residual Solvents Screening"],
      completedCount: 9,
      avatarInitials: "SR"
    },
    {
      id: "user-emp-05",
      role: "employee",
      name: "Deepak Patel",
      email: "deepak.patel@ultratech.in",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      position: "Laboratory QA/QC Associate",
      tenureYears: 3.6,
      headId: "user-head-01",
      headName: "Priya Nair",
      skills: ["Quality Control Charts", "Inter-Laboratory Comparison (PT)", "Reagent Standardization"],
      projects: ["PT Provider Round 28 Analysis & Correlation"],
      completedCount: 5,
      avatarInitials: "DP"
    }
  ],

  // Monthly Cycle Status
  cycle: {
    id: "CYC-2026-09",
    name: "September 2026 Monthly Training Cycle",
    isOpen: true,
    startDate: "2026-09-01",
    submissionDeadline: "2026-09-18",
    targetQuarter: "Q3 - FY 2026-27",
    departmentSubmissions: [
      { deptId: "dept-01", deptName: "Environmental Media Monitoring & Lab Analysis", status: "Submitted", submittedDate: "2026-09-04", submittedBy: "Priya Nair", requestsCount: 5 },
      { deptId: "dept-02", deptName: "Environmental Clearance & EIA", status: "Submitted", submittedDate: "2026-09-05", submittedBy: "Dr. Rajeshwar Kulkarni", requestsCount: 4 },
      { deptId: "dept-03", deptName: "Turnkey Engineering & Project Consultancy", status: "Pending", submittedDate: null, submittedBy: null, requestsCount: 0 },
      { deptId: "dept-04", deptName: "STP / ETP Operation & Maintenance", status: "Submitted", submittedDate: "2026-09-03", submittedBy: "Sanjay Deshmukh", requestsCount: 6 },
      { deptId: "dept-05", deptName: "Environmental & Social Due Diligence (ESDD)", status: "Pending", submittedDate: null, submittedBy: null, requestsCount: 0 },
      { deptId: "dept-06", deptName: "Environmental Regulatory Compliance", status: "Submitted", submittedDate: "2026-09-06", submittedBy: "Adv. Harish Bhat", requestsCount: 3 },
      { deptId: "dept-07", deptName: "Air Quality Monitoring & Stack Testing", status: "Submitted", submittedDate: "2026-09-05", submittedBy: "Gaurav Sen", requestsCount: 5 },
      { deptId: "dept-08", deptName: "Chemical & Microbiological Lab Services", status: "Pending", submittedDate: null, submittedBy: null, requestsCount: 0 },
      { deptId: "dept-09", deptName: "Occupational Health, Safety & Environment (HSE)", status: "Pending", submittedDate: null, submittedBy: null, requestsCount: 0 },
      { deptId: "dept-10", deptName: "Solid & Hazardous Waste Management", status: "Submitted", submittedDate: "2026-09-07", submittedBy: "Anil Kapse", requestsCount: 3 },
      { deptId: "dept-11", deptName: "Sustainability, Carbon & ESG Advisory", status: "Pending", submittedDate: null, submittedBy: null, requestsCount: 0 },
      { deptId: "dept-12", deptName: "GIS, Remote Sensing & Hydrogeological Modeling", status: "Pending", submittedDate: null, submittedBy: null, requestsCount: 0 }
    ]
  },

  // Active & Assigned Trainings for Rahul Sharma and Team
  trainings: [
    {
      id: "TRN-101",
      userId: "user-emp-01",
      userName: "Rahul Sharma",
      department: "Environmental Media Monitoring & Lab Analysis",
      title: "ISO/IEC 17025:2017 Laboratory Quality Management & Internal Auditing",
      category: "Laboratory Quality & Accreditation",
      mode: "In-House Workshop",
      scheduledDate: "2026-09-22",
      endDate: "2026-09-24",
      status: "Upcoming",
      mandatory: true,
      provider: "UltraTech QCI Academy",
      venue: "Central Lab Training Hall, Thane",
      proof: null
    },
    {
      id: "TRN-102",
      userId: "user-emp-01",
      userName: "Rahul Sharma",
      department: "Environmental Media Monitoring & Lab Analysis",
      title: "Advanced Gas Chromatography (GC-MS/MS) Volatile Organic Compounds Quantification",
      category: "Analytical Instrumentation",
      mode: "External Masterclass",
      scheduledDate: "2026-09-02",
      endDate: "2026-09-05",
      status: "In Progress",
      mandatory: false,
      provider: "Shimadzu Technical Training Institute, Mumbai",
      venue: "Andheri Tech Center",
      proof: null
    },
    {
      id: "TRN-103",
      userId: "user-emp-01",
      userName: "Rahul Sharma",
      department: "Environmental Media Monitoring & Lab Analysis",
      title: "CPCB Guidelines on Continuous Emission Monitoring Systems (CEMS) Calibration",
      category: "Air Quality & Regulatory",
      mode: "In-House Workshop",
      scheduledDate: "2026-08-25",
      endDate: "2026-08-27",
      status: "Completed",
      mandatory: true,
      provider: "UltraTech Environmental Consultancy",
      venue: "Seminar Hall 2",
      completedDate: "2026-08-30",
      signoffDate: "2026-08-31",
      signedOffBy: "Priya Nair",
      proof: {
        learnings: "Mastered calibration zero-span drift testing for SO2, NOx, and PM sensors according to CPCB specifications. Formulated calibration frequency matrix for heavy industrial clients.",
        attendanceFile: "Attendance_CEMS_Aug2026_RS.pdf",
        attendanceSize: "1.4 MB",
        certificateFile: "UltraTech_Cert_CEMS_RahulSharma.pdf",
        certificateSize: "2.8 MB",
        submittedAt: "2026-08-29"
      }
    },
    {
      id: "TRN-104",
      userId: "user-emp-01",
      userName: "Rahul Sharma",
      department: "Environmental Media Monitoring & Lab Analysis",
      title: "Hazardous Chemical Spill Emergency Response & First Responder Protocols",
      category: "Occupational Safety & HSE",
      mode: "In-House Workshop",
      scheduledDate: "2026-08-10",
      endDate: "2026-08-11",
      status: "Pending Sign-off",
      mandatory: true,
      provider: "National Safety Council (NSC) Certified Trainer",
      venue: "Safety Training Field, Thane",
      submissionDate: "2026-09-04",
      daysElapsed: 4, // 3 days remaining!
      proof: {
        learnings: "Trained on neutralisation procedures for concentrated mineral acids and organophosphate spills. Practiced rapid deployment of absorbent booms and Level-B SCBA gear.",
        attendanceFile: "Attendance_Sheet_Hazmat_Spill_2026.pdf",
        attendanceSize: "1.2 MB",
        certificateFile: "NSC_Chemical_Safety_Rahul_Sharma.pdf",
        certificateSize: "3.1 MB",
        submittedAt: "2026-09-04"
      }
    },
    {
      id: "TRN-105",
      userId: "user-emp-02",
      userName: "Ananya Sen",
      department: "Environmental Media Monitoring & Lab Analysis",
      title: "Determination of Trace Metals by Inductively Coupled Plasma (ICP-OES)",
      category: "Analytical Instrumentation",
      mode: "External Hands-on",
      scheduledDate: "2026-08-20",
      endDate: "2026-08-23",
      status: "Pending Sign-off",
      mandatory: false,
      provider: "PerkinElmer Knowledge Centre",
      venue: "Navi Mumbai",
      submissionDate: "2026-09-06",
      daysElapsed: 2, // 5 days remaining
      proof: {
        learnings: "Hands-on digestion of soil and industrial slag matrices using microwave acid digestion. Standardized axial vs radial plasma viewing modes for Arsenic and Cadmium trace levels.",
        attendanceFile: "PerkinElmer_Attendance_ASen.pdf",
        attendanceSize: "980 KB",
        certificateFile: "PerkinElmer_Certificate_ICP_ASen.pdf",
        certificateSize: "2.4 MB",
        submittedAt: "2026-09-06"
      }
    },
    {
      id: "TRN-106",
      userId: "user-emp-03",
      userName: "Amit Joshi",
      department: "Environmental Media Monitoring & Lab Analysis",
      title: "Isokinetic Flue Gas Sampling and Pitot Tube Velocity Calibration",
      category: "Air Quality & Regulatory",
      mode: "In-House Workshop",
      scheduledDate: "2026-08-15",
      endDate: "2026-08-18",
      status: "Pending Sign-off",
      mandatory: true,
      provider: "UltraTech Environmental Engineering Division",
      venue: "Stack Simulation Rig, Thane",
      submissionDate: "2026-09-02",
      daysElapsed: 6, // 1 day remaining!
      proof: {
        learnings: "Conducted traverse point mapping across circular and rectangular industrial chimney stacks according to IS 11255 Part 3. Calibrated S-type Pitot tube coefficient and moisture condensation condenser.",
        attendanceFile: "Isokinetic_Stack_Sampling_Attendance_AJ.pdf",
        attendanceSize: "1.6 MB",
        certificateFile: "UltraTech_Flue_Gas_Sampling_AJ.pdf",
        certificateSize: "2.2 MB",
        submittedAt: "2026-09-02"
      }
    },
    {
      id: "TRN-107",
      userId: "user-emp-04",
      userName: "Sneha Roy",
      department: "Environmental Media Monitoring & Lab Analysis",
      title: "Measurement Uncertainty Estimation in Environmental Chemical Testing (ISO GUM)",
      category: "Laboratory Quality & Accreditation",
      mode: "External Online Masterclass",
      scheduledDate: "2026-08-01",
      endDate: "2026-08-04",
      status: "Escalated",
      mandatory: true,
      provider: "Centre for Metrology & Accreditation",
      venue: "Virtual Classroom",
      submissionDate: "2026-08-30",
      daysElapsed: 9, // > 7 days -> Auto escalated to HR!
      escalationReason: "Sign-off deadline exceeded 7 days without Department Head review. Auto-escalated to HR per Section 5.3 SLA policy.",
      proof: {
        learnings: "Synthesized Type A and Type B uncertainty budgets for organic BOD and chemical COD determinations. Implemented coverage factor k=2 expansion equations in Excel sheets.",
        attendanceFile: "Attendance_Log_Uncertainty_SRoy.pdf",
        attendanceSize: "840 KB",
        certificateFile: "ISO_GUM_Certificate_SRoy.pdf",
        certificateSize: "1.9 MB",
        submittedAt: "2026-08-30"
      }
    },
    {
      id: "TRN-108",
      userId: "user-emp-05",
      userName: "Deepak Patel",
      department: "Environmental Media Monitoring & Lab Analysis",
      title: "Good Laboratory Practices (GLP) and Hazardous Waste Handling inside NABL Labs",
      category: "Laboratory Quality & Accreditation",
      mode: "In-House Workshop",
      scheduledDate: "2026-08-05",
      endDate: "2026-08-07",
      status: "Resubmit Requested",
      mandatory: true,
      provider: "UltraTech Compliance Cell",
      venue: "Room B-101",
      resubmitReason: "Attendance sheet missing official stamp from the Quality Manager. Please upload the verified counter-signed copy.",
      proof: {
        learnings: "Detailed handling of flammable waste carboys and chemical segregation charts.",
        attendanceFile: "Unstamped_Attendance_DP.pdf",
        attendanceSize: "650 KB",
        certificateFile: "GLP_Provisional_DP.pdf",
        certificateSize: "1.5 MB",
        submittedAt: "2026-08-12"
      }
    }
  ],

  // Requests table
  requests: [
    {
      id: "REQ-2026-001",
      type: "Self",
      applicantId: "user-emp-01",
      applicantName: "Rahul Sharma",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      designation: "Senior Environmental Analyst",
      headId: "user-head-01",
      headName: "Priya Nair",
      trainingTitle: "PFAS 'Forever Chemicals' Sampling and Trace LC-MS/MS Quantification",
      category: "Analytical Instrumentation",
      mode: "External Masterclass",
      submittedDate: "2026-09-05",
      status: "Pending Head Review",
      isCommon: true,
      departmentOverlapCount: 3,
      justification: "Critical for the upcoming MMRDA coastal water contamination baseline study which mandates sub-ppt PFAS assessment.",
      rejectionReason: null,
      appealNote: null
    },
    {
      id: "REQ-2026-002",
      type: "Self",
      applicantId: "user-emp-01",
      applicantName: "Rahul Sharma",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      designation: "Senior Environmental Analyst",
      headId: "user-head-01",
      headName: "Priya Nair",
      trainingTitle: "Drone-based Thermal Remote Sensing for Industrial Outfall Thermal Plumes",
      category: "Remote Sensing & Monitoring",
      mode: "External",
      submittedDate: "2026-08-28",
      status: "Rejected",
      isCommon: false,
      departmentOverlapCount: 1,
      justification: "To map power plant thermal discharge plume dispersal off Trombay.",
      rejectionReason: "Drone thermal mapping is currently contracted out to specialized GIS division. Internal budget prioritizes wet chemical NABL scope expansion this fiscal year.",
      appealNote: null
    },
    {
      id: "REQ-2026-003",
      type: "Team",
      applicantId: "user-head-01",
      applicantName: "Priya Nair (HOD)",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      designation: "Head of Department",
      headId: "user-head-01",
      headName: "Priya Nair",
      trainingTitle: "NABL 112: Specific Criteria for Accreditation of Testing Laboratories Revision 2026",
      category: "Laboratory Quality & Accreditation",
      mode: "In-House Workshop",
      submittedDate: "2026-09-04",
      status: "Approved",
      isCommon: true,
      departmentOverlapCount: 5,
      targetEmployees: [
        { id: "user-emp-01", name: "Rahul Sharma" },
        { id: "user-emp-02", name: "Ananya Sen" },
        { id: "user-emp-04", name: "Sneha Roy" },
        { id: "user-emp-05", name: "Deepak Patel" }
      ],
      justification: "Mandatory refresher for our upcoming October NABL re-audit across chemical, biological, and air monitoring divisions."
    },
    {
      id: "REQ-2026-004",
      type: "Self",
      applicantId: "user-emp-04",
      applicantName: "Sneha Roy",
      departmentId: "dept-01",
      department: "Environmental Media Monitoring & Lab Analysis",
      designation: "Senior Analytical Officer",
      headId: "user-head-01",
      headName: "Priya Nair",
      trainingTitle: "Advanced Method Validation as per EURACHEM / CITAC Guide",
      category: "Laboratory Quality & Accreditation",
      mode: "External Masterclass",
      submittedDate: "2026-08-22",
      status: "Escalated",
      isCommon: true,
      departmentOverlapCount: 4,
      justification: "Required to lead the validation protocol for heavy metal extraction under ISO 17025 Section 7.2.",
      rejectionReason: "Head deemed external course too expensive (Rs 45,000) when an in-house session was planned.",
      appealNote: "The in-house session covers general GLP, whereas our NABL surveillance deficiency specifically highlighted ISO 17025:2017 clause 7.2.2.4 on non-standard method validation which requires EURACHEM certified methodology."
    },
    {
      id: "REQ-2026-005",
      type: "Team",
      applicantId: "user-head-02",
      applicantName: "Dr. Rajeshwar Kulkarni",
      departmentId: "dept-02",
      department: "Environmental Clearance & EIA",
      designation: "Head of Department",
      headId: "user-head-02",
      headName: "Dr. Rajeshwar Kulkarni",
      trainingTitle: "MoEF&CC EIA Notification 2026 Revisions & Parivesh 2.0 Portal Compliance",
      category: "Environmental Regulations",
      mode: "In-House Workshop",
      submittedDate: "2026-09-05",
      status: "Pending HR Approval",
      isCommon: true,
      departmentOverlapCount: 6,
      targetEmployees: [
        { id: "user-eia-01", name: "Vikrant Patil" },
        { id: "user-eia-02", name: "Pooja Hegde" },
        { id: "user-eia-03", name: "Tanmay Shah" }
      ],
      justification: "Crucial regulatory update for all Category A & B industrial clearance filings."
    },
    {
      id: "REQ-2026-006",
      type: "Self",
      applicantId: "user-stp-01",
      applicantName: "Ramesh Chandel",
      departmentId: "dept-04",
      department: "STP / ETP Operation & Maintenance",
      designation: "Senior Plant Engineer",
      headId: "user-head-04",
      headName: "Sanjay Deshmukh",
      trainingTitle: "Industrial Membrane Bioreactor (MBR) & Zero Liquid Discharge (ZLD) Optimization",
      category: "Water & Wastewater Engineering",
      mode: "External",
      submittedDate: "2026-09-03",
      status: "Pending HR Approval",
      isCommon: false,
      departmentOverlapCount: 1,
      justification: "To troubleshoot flux decay and chemical cleaning cycles on the Tarapur textile ZLD installation."
    },
    {
      id: "REQ-2026-007",
      type: "Team",
      applicantId: "user-head-07",
      applicantName: "Gaurav Sen",
      departmentId: "dept-07",
      department: "Air Quality Monitoring & Stack Testing",
      designation: "Head of Department",
      headId: "user-head-07",
      headName: "Gaurav Sen",
      trainingTitle: "Continuous Ambient Air Quality Monitoring Stations (CAAQMS) Telemetry & Sensor Maintenance",
      category: "Air Quality & Regulatory",
      mode: "In-House Workshop",
      submittedDate: "2026-09-05",
      status: "Pending HR Approval",
      isCommon: true,
      departmentOverlapCount: 3,
      targetEmployees: [
        { id: "user-aq-01", name: "Kishore Gaikwad" },
        { id: "user-aq-02", name: "Suresh Nair" }
      ],
      justification: "CPCB live telemetry uptime compliance requirement for our 4 municipal station contracts."
    },
    {
      id: "REQ-2026-008",
      type: "Self",
      applicantId: "user-esg-01",
      applicantName: "Bhavna Swaminathan",
      departmentId: "dept-11",
      department: "Sustainability, Carbon & ESG Advisory",
      designation: "Senior ESG Consultant",
      headId: "user-head-11",
      headName: "Divya Krishnan",
      trainingTitle: "BRSR Core (Business Responsibility and Sustainability Reporting) Audit Readiness",
      category: "Sustainability & ESG",
      mode: "In-House Workshop",
      submittedDate: "2026-09-07",
      status: "Pending HR Approval",
      isCommon: true,
      departmentOverlapCount: 4,
      justification: "SEBI mandated BRSR Core assurance for top 1000 listed entities starting FY 2026-27."
    }
  ],

  // Scheduled Calendar Training Events
  events: [
    {
      id: "EVT-2026-01",
      title: "ISO/IEC 17025:2017 Laboratory Quality Management & Internal Auditing",
      category: "Laboratory Quality & Accreditation",
      mode: "In-House",
      date: "2026-09-22",
      endDate: "2026-09-24",
      capacity: 25,
      venue: "Central Lab Training Hall, Thane",
      instructor: "Dr. K.V. Ramanathan (Lead Assessor, NABL)",
      hodApprovalRequired: false,
      reimbursementPercent: 100,
      assignedUserIds: ["user-emp-01", "user-emp-02", "user-emp-04", "user-emp-05"],
      assignedEmployees: [
        { id: "user-emp-01", name: "Rahul Sharma", dept: "Environmental Media Monitoring & Lab Analysis" },
        { id: "user-emp-02", name: "Ananya Sen", dept: "Environmental Media Monitoring & Lab Analysis" },
        { id: "user-emp-04", name: "Sneha Roy", dept: "Environmental Media Monitoring & Lab Analysis" },
        { id: "user-emp-05", name: "Deepak Patel", dept: "Environmental Media Monitoring & Lab Analysis" }
      ]
    },
    {
      id: "EVT-2026-02",
      title: "MoEF&CC Parivesh 2.0 & EIA Notification Regulatory Workshop",
      category: "Environmental Regulations",
      mode: "In-House",
      date: "2026-09-28",
      endDate: "2026-09-29",
      capacity: 35,
      venue: "Executive Auditorium, UltraTech House",
      instructor: "Adv. Harish Bhat & EIA Technical Committee",
      hodApprovalRequired: false,
      reimbursementPercent: 100,
      assignedUserIds: ["user-head-02", "user-eia-01", "user-eia-02"],
      assignedEmployees: [
        { id: "user-eia-01", name: "Vikrant Patil", dept: "Environmental Clearance & EIA" },
        { id: "user-eia-02", name: "Pooja Hegde", dept: "Environmental Clearance & EIA" }
      ]
    },
    {
      id: "EVT-2026-03",
      title: "Advanced Gas Chromatography (GC-MS/MS) Volatile Organic Compounds Masterclass",
      category: "Analytical Instrumentation",
      mode: "External",
      date: "2026-10-06",
      endDate: "2026-10-08",
      capacity: 8,
      venue: "Shimadzu Tech Center, Andheri East",
      instructor: "Shimadzu Analytical Specialist Team",
      hodApprovalRequired: true,
      reimbursementPercent: 80,
      assignedUserIds: ["user-emp-01"],
      assignedEmployees: [
        { id: "user-emp-01", name: "Rahul Sharma", dept: "Environmental Media Monitoring & Lab Analysis" }
      ]
    },
    {
      id: "EVT-2026-04",
      title: "BRSR Core Assurance & Scope 1, 2, 3 Greenhouse Gas Accounting",
      category: "Sustainability & ESG",
      mode: "In-House",
      date: "2026-10-14",
      endDate: "2026-10-15",
      capacity: 30,
      venue: "Sustainability Hub, 4th Floor",
      instructor: "Divya Krishnan (ESG Director)",
      hodApprovalRequired: false,
      reimbursementPercent: 100,
      assignedUserIds: ["user-esg-01"],
      assignedEmployees: [
        { id: "user-esg-01", name: "Bhavna Swaminathan", dept: "Sustainability, Carbon & ESG Advisory" }
      ]
    }
  ],

  // Notifications Feed
  notifications: [
    {
      id: "NOTIF-01",
      timestamp: "2026-09-08 08:30",
      type: "cycle",
      title: "Monthly Training Cycle Announcement",
      message: "The September 2026 Training Cycle is now open. Department Heads must finalize submissions before September 18, 2026.",
      unread: true,
      targetRoles: ["employee", "head", "hr"]
    },
    {
      id: "NOTIF-02",
      timestamp: "2026-09-07 14:15",
      type: "scheduled",
      title: "Training Scheduled: ISO/IEC 17025:2017 Workshop",
      message: "You have been allocated to the In-House ISO/IEC 17025 Quality Management session on Sep 22–24 at Central Lab.",
      unread: true,
      targetRoles: ["employee"]
    },
    {
      id: "NOTIF-03",
      timestamp: "2026-09-06 16:45",
      type: "signoff_warning",
      title: "Sign-Off Deadline Warning: 1 Day Remaining",
      message: "Isokinetic Flue Gas Sampling proof submission for Amit Joshi has 1 day remaining before auto-escalating to HR.",
      unread: true,
      targetRoles: ["head"]
    },
    {
      id: "NOTIF-04",
      timestamp: "2026-09-05 11:20",
      type: "escalation",
      title: "Sign-off Auto-Escalated to HR (Past 7 Days)",
      message: "Submission for Sneha Roy (Measurement Uncertainty ISO GUM) exceeded 7 days and has been auto-escalated to HR for sign-off.",
      unread: false,
      targetRoles: ["head", "hr"]
    },
    {
      id: "NOTIF-05",
      timestamp: "2026-09-04 10:00",
      type: "appeal",
      title: "Employee Training Appeal Received",
      message: "Sneha Roy submitted an appeal to HR regarding rejected request REQ-2026-004 (EURACHEM Method Validation).",
      unread: true,
      targetRoles: ["hr"]
    },
    {
      id: "NOTIF-06",
      timestamp: "2026-08-31 17:00",
      type: "approval",
      title: "Completion Approved: CPCB CEMS Guidelines",
      message: "HOD Priya Nair approved your completion proof for CPCB CEMS Calibration. Certificate verified.",
      unread: false,
      targetRoles: ["employee"]
    }
  ],

  // Promotion / Award Flags
  promotionFlags: [
    {
      id: "PRM-01",
      userId: "user-emp-01",
      userName: "Rahul Sharma",
      department: "Environmental Media Monitoring & Lab Analysis",
      tenureYears: 4.2,
      completedTrainings: 6,
      flaggedBy: "Priya Nair",
      flaggedDate: "2026-09-03",
      category: "Technical Specialist / Senior Consultant Track",
      notes: "Consistently excels in complex instrumental analyses (GC-MS, AAS) and delivered critical MTHL coastal project baseline data without delay. Recommended for Senior Specialist grade.",
      status: "Shortlisted"
    },
    {
      id: "PRM-02",
      userId: "user-emp-04",
      userName: "Sneha Roy",
      department: "Environmental Media Monitoring & Lab Analysis",
      tenureYears: 6.4,
      completedTrainings: 9,
      flaggedBy: "Priya Nair",
      flaggedDate: "2026-08-20",
      category: "Laboratory Quality Lead",
      notes: "High competency in NABL audit prep and measurement uncertainty calculations. Prepared to step into Deputy Quality Manager role.",
      status: "Under HR Review"
    },
    {
      id: "PRM-03",
      userId: "user-emp-03",
      userName: "Amit Joshi",
      department: "Environmental Media Monitoring & Lab Analysis",
      tenureYears: 5.0,
      completedTrainings: 7,
      flaggedBy: "Priya Nair",
      flaggedDate: "2026-09-01",
      category: "Excellence in Field Operations Award",
      notes: "Zero safety incidents across 120+ high-altitude stack sampling missions in hazardous chemical plants.",
      status: "Shortlisted"
    }
  ]
};
