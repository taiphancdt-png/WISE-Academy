// Bilingual (VI / EN) brochure content for the LSSI programs, summarised from leansixsigmainstitute.org.
// Tool names stay in English (as used in practice); [en, vi] pairs are used where a translation helps.

const PH = {
  define: ["Define", "Xác định (Define)"],
  measure: ["Measure & Map", "Đo lường & sơ đồ hoá (Measure)"],
  analyze: ["Analyze", "Phân tích (Analyze)"],
  improve: ["Improve", "Cải tiến (Improve)"],
  control: ["Control", "Kiểm soát (Control)"],
};

const L1 = {
  name: ["Level 1: Lean Management", "Cấp 1: Lean Management"],
  groups: [{ items: [["Introduction to Lean Six Sigma", "Tổng quan Lean Six Sigma"], "Business Model Canvas", ["Strategic Planning: Hoshin Kanri", "Hoạch định chiến lược Hoshin Kanri"], ["Value Stream Structures", "Cấu trúc chuỗi giá trị"], ["Talent Development", "Phát triển nhân tài"]] }],
};
const L2 = {
  name: ["Level 2: White Belt", "Cấp 2: White Belt"],
  groups: [{ items: [["Problem-Solving", "Giải quyết vấn đề"], "5S Housekeeping", ["Visual Management (ANDON)", "Quản lý trực quan (ANDON)"], ["Standard Work Instruction", "Hướng dẫn công việc tiêu chuẩn"]] }],
};
const YB = [
  { h: PH.define, items: [["4-Quadrant Analysis", "Phân tích 4 góc phần tư"], ["Project Definition A3", "Định nghĩa dự án A3"]] },
  { h: PH.measure, items: [["Data Collection", "Thu thập dữ liệu"], "OEE", ["Current State VSM", "VSM hiện trạng"]] },
  { h: PH.analyze, items: ["Spaghetti Diagram", ["Balance Chart", "Biểu đồ cân bằng"], ["Waste Analysis", "Phân tích lãng phí"], "FMEA"] },
  { h: PH.improve, items: ["Kaizen", ["Continuous Flow", "Dòng chảy liên tục"], "SMED", "TPM", "Kanban", ["Future State VSM", "VSM tương lai"]] },
  { h: PH.control, items: [["Standardized Work", "Công việc tiêu chuẩn"], "Poka Yoke", "Kata"] },
];
const GB = [
  { h: PH.define, items: [["Project Definition", "Định nghĩa dự án"], ["Voice of the Customer (QFD, Kano, Needs Tree)", "Tiếng nói khách hàng (QFD, Kano, Needs Tree)"]] },
  { h: PH.measure, items: [["Process Maps", "Sơ đồ quy trình"], "MSA", ["Basic Statistics", "Thống kê cơ bản"], ["Sampling", "Lấy mẫu"], "Histogram", ["Process Capability & Performance", "Năng lực & hiệu suất quy trình"]] },
  { h: PH.analyze, items: ["Box Plot", "Multi-vari", ["Hypothesis Tests & Confidence Intervals", "Kiểm định giả thuyết & khoảng tin cậy"], "ANOVA", ["Correlation", "Tương quan"]] },
  { h: PH.improve, items: [["Introduction to DOE", "Nhập môn DOE"], ["Factorial Designs", "Thiết kế giai thừa"]] },
  { h: PH.control, items: ["SPC", ["Control Plan", "Kế hoạch kiểm soát"]] },
];
const BB = [
  { h: PH.define, items: [["Agile Project Management (SCRUM)", "Quản lý dự án Agile (SCRUM)"], ["Trainer / Coach", "Huấn luyện & kèm cặp"]] },
  { h: PH.measure, items: [["Financial Project Evaluation", "Đánh giá tài chính dự án"]] },
  { h: PH.analyze, items: [["Theory of Constraints (TOC)", "Lý thuyết điểm nghẽn (TOC)"], ["Distributions", "Phân phối thống kê"]] },
  { h: PH.improve, items: [["Fractional Factorial Designs", "Thiết kế giai thừa một phần"], ["Regression Analysis", "Phân tích hồi quy"], ["Response Surface", "Bề mặt đáp ứng"], "Lean Company", "Lean Industry 4.0"] },
  { h: PH.control, items: ["Leader Standard Work", "Gemba Walks"] },
];
const L3 = { name: ["Level 3: Yellow Belt", "Cấp 3: Yellow Belt"], groups: YB };
const L4 = { name: ["Level 4: Green Belt", "Cấp 4: Green Belt"], groups: GB };
const L5 = { name: ["Level 5: Black Belt", "Cấp 5: Black Belt"], groups: BB };
const L6 = {
  name: ["Level 6: Master Black Belt", "Cấp 6: Master Black Belt"],
  groups: [
    { h: ["Management & Leadership", "Quản trị & lãnh đạo"], items: [["Strategic Management", "Quản trị chiến lược"], ["Emotional Intelligence", "Trí tuệ cảm xúc"], ["Sustainable Model (Lean Green)", "Mô hình bền vững (Lean Green)"]] },
    { h: ["Innovation", "Đổi mới sáng tạo"], items: [["Exponential Growth", "Tăng trưởng theo cấp số nhân"], "Lean Layout", "Lean Innovation", ["Value Engineering", "Kỹ thuật giá trị"], "TRIZ", "Design for Six Sigma (DFSS)", "Design for Manufacturing (DFM)"] },
  ],
};

const AUDIENCE_BUNDLE = {
  en: [
    "Professionals seeking to become transformational leaders in Lean Six Sigma.",
    "Aspiring project leaders looking to lead complex projects.",
    "Individuals and teams aiming to drive process optimization and transformation within their organizations.",
  ],
  vi: [
    "Người đi làm muốn trở thành nhà lãnh đạo chuyển đổi bằng Lean Six Sigma.",
    "Người muốn dẫn dắt các dự án cải tiến phức tạp.",
    "Cá nhân và đội nhóm muốn tối ưu quy trình và chuyển đổi trong tổ chức của mình.",
  ],
};

const EXAM = {
  en: "After each level you have two attempts at the certification exam. Passing leads to an international certification jointly awarded by Lean Six Sigma Institute (LSSI) and the Council for Six Sigma Certification (CSSC), recognised worldwide and valid for life.",
  vi: "Sau mỗi cấp độ, học viên có 2 lượt thi chứng nhận. Đạt bài thi, học viên nhận chứng nhận quốc tế do Lean Six Sigma Institute (LSSI) và Council for Six Sigma Certification (CSSC) đồng cấp, được công nhận toàn cầu và có giá trị trọn đời.",
};

export const BROCHURES = {
  "corporate-management-masters": {
    eyebrow: { en: "International master’s degree program", vi: "Chương trình thạc sĩ quốc tế" },
    subtitle: {
      en: "Master’s degree granted by the Catholic University of Murcia (UCAM, Spain) and Lean Six Sigma Institute",
      vi: "Bằng thạc sĩ do Đại học Công giáo Murcia (UCAM, Tây Ban Nha) và Lean Six Sigma Institute cấp",
    },
    intro: {
      en: "Organisations need managers who can drive change. This program equips you to lead your organisation to success by applying Lean Six Sigma together with the latest Industry 4.0 tools. Industry 4.0 technologies alone do not create structural change; Lean Six Sigma provides the agility, flexibility, efficiency and productivity companies seek from them.",
      vi: "Doanh nghiệp ngày nay cần những nhà quản lý có khả năng dẫn dắt thay đổi. Chương trình trang bị năng lực đưa tổ chức đến thành công bằng Lean Six Sigma kết hợp các công cụ Công nghiệp 4.0. Công nghệ 4.0 tự nó không tạo ra thay đổi cấu trúc; Lean Six Sigma chính là hệ thống quản trị mang lại sự linh hoạt, hiệu quả và năng suất mà doanh nghiệp kỳ vọng từ công nghệ.",
    },
    duration: { en: "Master’s program · degree by UCAM", vi: "Chương trình thạc sĩ · bằng do UCAM cấp" },
    learnTitle: { en: "Degree & certifications awarded", vi: "Bằng cấp & chứng nhận đạt được" },
    learn: {
      en: [
        "Master’s Degree in Corporate Management Lean Management 4.0 & Black Belt (UCAM & LSSI)",
        "Industry 4.0 Certification",
        "Lean Six Sigma Black Belt, Green Belt and Yellow Belt Certifications",
        "Lean Specialist Certification in an industry or process of your choice (Lean Service, Lean Logistics…)",
      ],
      vi: [
        "Bằng Thạc sĩ Quản trị doanh nghiệp Lean Management 4.0 & Black Belt (UCAM & LSSI)",
        "Chứng nhận Công nghiệp 4.0 (Industry 4.0)",
        "Chứng nhận Lean Six Sigma Black Belt, Green Belt và Yellow Belt",
        "Chứng nhận Lean Specialist theo ngành hoặc quy trình tự chọn (Lean Service, Lean Logistics…)",
      ],
    },
    audience: {
      en: ["Professionals", "Managers / Directors", "University graduates interested in specialising in continuous improvement", "Previous Lean Six Sigma certifications can be validated to bypass the corresponding module"],
      vi: ["Chuyên viên, kỹ sư đang đi làm", "Quản lý / Giám đốc", "Người đã tốt nghiệp đại học muốn chuyên sâu về cải tiến liên tục", "Chứng nhận Lean Six Sigma đã có có thể được công nhận để miễn học module tương ứng"],
    },
    contentTitle: { en: "Program modules", vi: "Các module của chương trình" },
    levels: [
      { ...L3, name: ["Module 1: Lean Tools – Yellow Belt", "Module 1: Công cụ Lean – Yellow Belt"] },
      { ...L4, name: ["Module 2: Six Sigma Improvement Tools – Green Belt", "Module 2: Công cụ cải tiến Six Sigma – Green Belt"] },
      {
        name: ["Module 3: Advanced Tools – Black Belt", "Module 3: Công cụ nâng cao – Black Belt"],
        groups: [...BB.slice(0, 3), { h: PH.improve, items: [...BB[3].items, ["Simulation", "Mô phỏng"]] }, BB[4]],
      },
      { name: ["Module 4: Lean Specialty", "Module 4: Chuyên ngành Lean"], groups: [{ items: ["Lean Logistics", "Lean Service", "Lean Energy", "Master Black Belt"] }] },
      {
        name: ["Module 5: Application in Industry 4.0", "Module 5: Ứng dụng Công nghiệp 4.0"],
        groups: [
          {
            items: [
              ["Industry 4.0 (Fraunhofer Institute, Acatech maturity index)", "Công nghiệp 4.0 (Fraunhofer, chỉ số trưởng thành Acatech)"],
              ["IoT, collaborative robotics, cybersecurity", "IoT, robot cộng tác, an ninh mạng"],
              ["AI / ML / Big Data / BI platforms", "AI / ML / Big Data / nền tảng BI"],
              ["3D printing, AR/VR, digital twin", "In 3D, AR/VR, digital twin"],
              ["Data sovereignty, PoC, pilots and ROI for the C-suite", "Chủ quyền dữ liệu, PoC, pilot và ROI cho ban lãnh đạo"],
              ["Strategic 4.0 roadmaps and industry case reviews", "Lộ trình 4.0 gắn chiến lược và phân tích tình huống thực tế"],
            ],
          },
        ],
      },
      { name: ["Module 6: Final Master’s Project", "Module 6: Luận văn thạc sĩ"], groups: [{ items: [["Final Master Thesis", "Đề án tốt nghiệp"]] }] },
      { name: ["Module 7: Internships", "Module 7: Thực tập"], groups: [{ items: [["Student internships", "Thực tập thực tế"]] }] },
    ],
    exam: null,
  },

  "master-black-belt-bundle": {
    subtitle: { en: "Transform your career with comprehensive training from White Belt to Master Black Belt", vi: "Chuyển mình sự nghiệp với lộ trình trọn vẹn từ White Belt đến Master Black Belt" },
    intro: {
      en: "An all-encompassing program covering every level of training. It provides the highest level of expertise in Lean Six Sigma, enabling you to lead and mentor teams effectively.",
      vi: "Chương trình bao trùm toàn bộ các cấp độ đào tạo, mang lại trình độ chuyên môn Lean Six Sigma cao nhất để dẫn dắt chiến lược, huấn luyện và kèm cặp đội ngũ hiệu quả.",
    },
    learn: {
      en: [
        "Master advanced Lean Six Sigma principles and transformational leadership",
        "Align Lean Six Sigma initiatives with strategic management",
        "Integrate sustainability into Lean Six Sigma practices",
        "Develop emotional intelligence for effective leadership",
        "Infuse innovation and design thinking into Lean practices",
        "Optimise layouts and apply value engineering",
        "Solve complex problems using TRIZ",
        "Create robust products and processes with DFSS and DFM",
      ],
      vi: [
        "Làm chủ Lean Six Sigma nâng cao và năng lực lãnh đạo chuyển đổi",
        "Gắn các sáng kiến Lean Six Sigma với quản trị chiến lược",
        "Tích hợp phát triển bền vững vào thực hành Lean Six Sigma",
        "Phát triển trí tuệ cảm xúc để lãnh đạo hiệu quả",
        "Đưa đổi mới sáng tạo và design thinking vào thực hành Lean",
        "Tối ưu layout và ứng dụng kỹ thuật giá trị (value engineering)",
        "Giải quyết vấn đề phức tạp bằng TRIZ",
        "Thiết kế sản phẩm, quy trình bền vững với DFSS và DFM",
      ],
    },
    audience: AUDIENCE_BUNDLE,
    levels: [L1, L2, L3, L4, L5, L6],
  },

  "black-belt-bundle": {
    subtitle: { en: "Propel your career forward with expert training in Lean Six Sigma", vi: "Bứt phá sự nghiệp với đào tạo chuyên sâu Lean Six Sigma" },
    intro: {
      en: "Covers Lean Management, White Belt, Yellow Belt, Green Belt and Black Belt. It provides the advanced knowledge and skills required for effective project leadership and substantial business impact.",
      vi: "Gồm Lean Management, White Belt, Yellow Belt, Green Belt và Black Belt, trang bị kiến thức và kỹ năng nâng cao để lãnh đạo dự án hiệu quả và tạo tác động kinh doanh lớn.",
    },
    learn: {
      en: [
        "Master Black Belt-level principles and project leadership",
        "Apply Agile project management, including SCRUM",
        "Coach and mentor teams to achieve success",
        "Evaluate project financials and ROI",
        "Identify and optimise constraints within your processes",
        "Analyse data using advanced statistical distributions",
        "Run efficient experiments with fractional factorial designs",
        "Model complex relationships with advanced regression and response surfaces",
        "Transform your organisation into a Lean enterprise",
      ],
      vi: [
        "Làm chủ nguyên lý Black Belt và năng lực lãnh đạo dự án",
        "Ứng dụng quản lý dự án Agile, bao gồm SCRUM",
        "Huấn luyện, kèm cặp đội nhóm đạt mục tiêu",
        "Đánh giá tài chính dự án và ROI",
        "Nhận diện và tối ưu điểm nghẽn trong quy trình",
        "Phân tích dữ liệu với các phân phối thống kê nâng cao",
        "Thực nghiệm hiệu quả với thiết kế giai thừa một phần",
        "Mô hình hoá quan hệ phức tạp bằng hồi quy nâng cao và bề mặt đáp ứng",
        "Chuyển đổi tổ chức thành doanh nghiệp tinh gọn",
      ],
    },
    audience: AUDIENCE_BUNDLE,
    levels: [L1, L2, L3, L4, L5],
  },

  "green-belt-bundle": {
    subtitle: { en: "Gain proficiency in Lean Six Sigma and elevate your impact with expert training", vi: "Thành thạo Lean Six Sigma và nâng tầm tác động của bạn" },
    intro: {
      en: "Covers Lean Management, White Belt, Yellow Belt and Green Belt. It provides an in-depth understanding of Lean Six Sigma methodologies, tools and project execution.",
      vi: "Gồm Lean Management, White Belt, Yellow Belt và Green Belt, giúp hiểu sâu phương pháp, công cụ và cách triển khai dự án Lean Six Sigma.",
    },
    learn: {
      en: [
        "Master Green Belt principles and project leadership",
        "Define and scope Lean Six Sigma projects effectively",
        "Translate the voice of the customer into actionable data",
        "Visualise and map processes to find improvement opportunities",
        "Assess and improve measurement systems for reliable data",
        "Apply basic statistics and efficient sampling",
        "Create and interpret histograms, box plots and multi-vari charts",
        "Analyse process capability and performance; run ANOVA",
      ],
      vi: [
        "Làm chủ nguyên lý Green Belt và năng lực dẫn dắt dự án",
        "Xác định và khoanh vùng phạm vi dự án hiệu quả",
        "Chuyển tiếng nói khách hàng thành dữ liệu hành động được",
        "Trực quan hoá, sơ đồ hoá quy trình để tìm cơ hội cải tiến",
        "Đánh giá và cải thiện hệ thống đo lường (MSA)",
        "Ứng dụng thống kê cơ bản và kỹ thuật lấy mẫu",
        "Lập và đọc histogram, box plot, biểu đồ multi-vari",
        "Phân tích năng lực, hiệu suất quy trình và ANOVA",
      ],
    },
    audience: AUDIENCE_BUNDLE,
    levels: [L1, L2, L3, L4],
  },

  "yellow-belt-bundle": {
    subtitle: { en: "Gain essential Lean Six Sigma skills to boost your professional journey", vi: "Trang bị kỹ năng Lean Six Sigma thiết yếu cho hành trình nghề nghiệp" },
    intro: {
      en: "Covers Lean Management, White Belt and Yellow Belt. It prepares individuals and work teams to develop efficient processes, improve speed and achieve consistent quality.",
      vi: "Gồm Lean Management, White Belt và Yellow Belt, giúp cá nhân và đội nhóm xây dựng quy trình hiệu quả, nhanh hơn và chất lượng ổn định.",
    },
    learn: {
      en: [
        "Master Lean Six Sigma principles and problem-solving techniques",
        "Categorise issues with the 4-quadrant method; define projects with A3",
        "Collect and analyse data for informed decisions",
        "Optimise OEE, value streams and equipment performance",
        "Implement FMEA, Kaizen and Kanban",
        "Reduce setup times (SMED) and ensure reliability (TPM)",
        "Establish standard work and prevent errors with Poka Yoke",
        "Apply Kata for structured improvement and a continuous-improvement culture",
      ],
      vi: [
        "Làm chủ nguyên lý Lean Six Sigma và kỹ thuật giải quyết vấn đề",
        "Phân loại vấn đề 4 góc phần tư; định nghĩa dự án bằng A3",
        "Thu thập, phân tích dữ liệu để ra quyết định",
        "Tối ưu OEE, chuỗi giá trị và hiệu suất thiết bị",
        "Triển khai FMEA, Kaizen và Kanban",
        "Giảm thời gian chuyển đổi (SMED), đảm bảo độ tin cậy thiết bị (TPM)",
        "Xây dựng công việc tiêu chuẩn, chống sai lỗi với Poka Yoke",
        "Áp dụng Kata và xây dựng văn hoá cải tiến liên tục",
      ],
    },
    audience: AUDIENCE_BUNDLE,
    levels: [L1, L2, L3],
  },

  "lean-management": {
    subtitle: { en: "Unlocking efficiency and excellence in your organisation", vi: "Khai mở hiệu quả và sự xuất sắc trong tổ chức" },
    intro: {
      en: "A deep dive into process optimisation, strategy and talent development — your gateway to mastering Lean principles and transforming your organisation.",
      vi: "Khóa học chuyên sâu về tối ưu quy trình, chiến lược và phát triển nhân tài — cánh cửa để làm chủ nguyên lý Lean và chuyển đổi tổ chức.",
    },
    learn: {
      en: [
        "Master Lean Six Sigma principles and the DMAIC methodology",
        "Use the Business Model Canvas to refine your value proposition and strategy",
        "Create and execute strategic plans with Hoshin Kanri",
        "Identify and optimise value streams for maximum efficiency",
        "Develop and empower your team to drive continuous improvement",
      ],
      vi: [
        "Nắm vững nguyên lý Lean Six Sigma và phương pháp DMAIC",
        "Dùng Business Model Canvas để hoàn thiện tuyên bố giá trị và chiến lược",
        "Xây dựng và triển khai kế hoạch chiến lược bằng Hoshin Kanri",
        "Nhận diện và tối ưu chuỗi giá trị",
        "Phát triển, trao quyền cho đội ngũ để thúc đẩy cải tiến liên tục",
      ],
    },
    audience: {
      en: [
        "Aspiring professionals looking to gain Lean Management skills",
        "Mid-level managers driving efficiency and excellence in their teams",
        "Executives and business leaders aligning their organisations with Lean principles",
        "Teams or organisations implementing Lean for transformation",
      ],
      vi: [
        "Người đi làm muốn trang bị kỹ năng quản trị tinh gọn",
        "Quản lý cấp trung muốn nâng cao hiệu quả đội nhóm",
        "Lãnh đạo, chủ doanh nghiệp muốn định hướng tổ chức theo Lean",
        "Đội nhóm, tổ chức triển khai Lean để chuyển đổi",
      ],
    },
    contentTitle: { en: "Course content", vi: "Nội dung khóa học" },
    levels: [{ ...L1, name: ["Lean Management (8 hours)", "Lean Management (8 giờ)"] }],
  },
};

export const EXAM_NOTE = EXAM;
