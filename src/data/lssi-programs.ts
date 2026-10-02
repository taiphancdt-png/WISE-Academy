// Lean Six Sigma Institute (LSSI Global) certification programs offered through WISE Academy,
// ordered from highest to entry level. Details summarised from leansixsigmainstitute.org (bundle pages);
// each card links to the official LSSI page.
export interface LssiProgram {
  id: string;
  title: string;
  tagline: string;
  /** Certification levels included in the program */
  includes: string[];
  /** Duration per learning format, as published by LSSI */
  duration: string;
  learn: string[];
  color: string;
  /** Program image from leansixsigmainstitute.org, stored locally */
  image: string;
  url: string;
}

export const LSSI_HOME = "https://leansixsigmainstitute.org/";
// LSSI's listing as an accredited training organization on the Council for Six Sigma Certification site.
export const CSSC_LISTING =
  "https://www.sixsigmacouncil.org/six-sigma-certification/training-providers/united-states-1/california/coronoado/accredited-six-sigma-private-training-organizations/lean-six-sigma-institute/";

export const LSSI_PROGRAMS: LssiProgram[] = [
  {
    id: "corporate-management-masters",
    title: "Corporate Management Lean Six Sigma 4.0 & Black Belt Master’s Degree",
    tagline:
      "Chương trình thạc sĩ do Đại học UCAM (Tây Ban Nha) cấp bằng, trang bị năng lực dẫn dắt chuyển đổi tổ chức bằng Lean Six Sigma và các công cụ Công nghiệp 4.0.",
    includes: ["Thạc sĩ Quản trị doanh nghiệp", "Lean Six Sigma 4.0", "Black Belt"],
    duration: "Chương trình thạc sĩ · bằng do UCAM cấp",
    learn: [
      "Quản trị doanh nghiệp và dẫn dắt thay đổi tổ chức",
      "Ứng dụng Lean Six Sigma ở cấp chiến lược",
      "Công cụ Công nghiệp 4.0 cho vận hành xuất sắc",
    ],
    color: "#002F5B",
    image: "/images/lssi/ucam.webp",
    url: "https://leansixsigmainstitute.org/corporate-management-masters-degree-by-ucam/",
  },
  {
    id: "master-black-belt-bundle",
    title: "Lean Six Sigma Master Black Belt Bundle",
    tagline:
      "Chương trình trọn bộ từ White Belt đến Master Black Belt — cấp chuyên môn cao nhất để dẫn dắt chiến lược và huấn luyện đội ngũ.",
    includes: ["Lean Management", "White Belt", "Yellow Belt", "Green Belt", "Black Belt", "Master Black Belt"],
    duration: "160 giờ có giảng viên · 80 giờ tự học",
    learn: [
      "Gắn Lean Six Sigma với quản trị chiến lược và phát triển bền vững",
      "Đổi mới sáng tạo, design thinking và giải quyết vấn đề bằng TRIZ",
      "Value engineering, tối ưu layout, DFSS và DFM",
    ],
    color: "#6B6B6B",
    image: "/images/lssi/master-black-belt-bundle.webp",
    url: "https://leansixsigmainstitute.org/lean-six-sigma-master/",
  },
  {
    id: "black-belt-bundle",
    title: "Lean Six Sigma Black Belt Bundle",
    tagline:
      "Gồm Lean Management, White, Yellow, Green và Black Belt — kiến thức nâng cao để lãnh đạo dự án và tạo tác động kinh doanh lớn.",
    includes: ["Lean Management", "White Belt", "Yellow Belt", "Green Belt", "Black Belt"],
    duration: "120 giờ có giảng viên · 60 giờ tự học",
    learn: [
      "Lãnh đạo dự án, quản lý Agile/SCRUM, huấn luyện đội nhóm",
      "Đánh giá tài chính dự án và ROI, tối ưu điểm nghẽn",
      "DOE giai thừa một phần, hồi quy nâng cao, bề mặt đáp ứng",
    ],
    color: "#111111",
    image: "/images/lssi/black-belt-bundle.webp",
    url: "https://leansixsigmainstitute.org/lean-six-sigma-leader/",
  },
  {
    id: "green-belt-bundle",
    title: "Lean Six Sigma Green Belt Bundle",
    tagline:
      "Gồm Lean Management, White, Yellow và Green Belt — hiểu sâu phương pháp, công cụ và triển khai dự án Lean Six Sigma.",
    includes: ["Lean Management", "White Belt", "Yellow Belt", "Green Belt"],
    duration: "80 giờ có giảng viên · 40 giờ tự học",
    learn: [
      "Xác định phạm vi dự án, VOC, sơ đồ hoá quy trình",
      "MSA, thống kê cơ bản, kỹ thuật lấy mẫu",
      "Histogram, box plot, năng lực quy trình, ANOVA",
    ],
    color: "#1F8A3A",
    image: "/images/lssi/green-belt-bundle.webp",
    url: "https://leansixsigmainstitute.org/lean-six-sigma-expert/",
  },
  {
    id: "yellow-belt-bundle",
    title: "Lean Six Sigma Yellow Belt Bundle",
    tagline:
      "Gồm Lean Management, White Belt và Yellow Belt — giúp cá nhân và đội nhóm xây dựng quy trình hiệu quả, nhanh hơn và chất lượng ổn định.",
    includes: ["Lean Management", "White Belt", "Yellow Belt"],
    duration: "40 giờ có giảng viên · 20 giờ tự học",
    learn: [
      "Giải quyết vấn đề, phương pháp A3 và phân loại vấn đề 4 góc phần tư",
      "OEE, chuỗi giá trị, FMEA, Kaizen, Kanban",
      "Công việc tiêu chuẩn, Poka-Yoke và Kata",
    ],
    color: "#E2B808",
    image: "/images/lssi/yellow-belt-bundle.webp",
    url: "https://leansixsigmainstitute.org/lean-specialist/",
  },
  {
    id: "lean-management",
    title: "Lean Management",
    tagline: "Khóa học nền tảng về quản trị tinh gọn dành cho lãnh đạo: tối ưu quy trình, chiến lược và phát triển nhân tài.",
    includes: ["Lean Management"],
    duration: "8 giờ",
    learn: [
      "Tổng quan Lean Six Sigma và Business Model Canvas",
      "Hoạch định chiến lược Hoshin Kanri",
      "Cấu trúc chuỗi giá trị và phát triển nhân tài",
    ],
    color: "#E8312F",
    image: "/images/lssi/lean-management.webp",
    url: "https://leansixsigmainstitute.org/lean-management/",
  },
];
