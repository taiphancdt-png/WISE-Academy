"use client";

import { useEffect } from "react";

// Vietnamese words are made of several space-separated syllables, so the browser happily breaks a line in the
// middle of a word ("chuyển / đổi", "nhà / máy"). This joins the syllables of common words and fixed terms with
// non-breaking spaces, so lines only break between words and phrases. It runs on every page and on content
// rendered later (filters, accordions, translations).
const PHRASES = [
  // names and fixed terms
  "WISE Academy", "chuẩn quốc tế", "quốc tế", "Việt Nam", "toàn cầu", "ủy quyền", "uỷ quyền", "chứng chỉ", "Đai Vàng", "Đai Xanh", "Đai Đen",
  "Lean Six Sigma", "Six Sigma", "Lean 4.0", "Ngôi nhà Lean", "Train-the-Trainer",
  "chuyển đổi số", "nguồn nhân lực", "chuỗi giá trị", "dòng giá trị", "chuỗi cung ứng", "cải tiến liên tục",
  "văn hóa", "văn hoá", "tại hiện trường", "Nhà máy Lean mới", "Hệ thống Quản lý Lean", "Lean & Chuyển đổi số", "Hoshin Kanri", "Leader Standard Work", "Poka-Yoke",
  // two-syllable words
  "sản xuất", "quy trình", "cải tiến", "vấn đề", "quản lý", "quản trị", "dự án", "hệ thống", "dữ liệu",
  "chuyên gia", "chuyên viên", "chuyên đề", "chuyên môn", "đào tạo", "doanh nghiệp", "giá trị", "ví dụ",
  "công cụ", "thực tế", "sản phẩm", "vận hành", "khách hàng", "thời gian", "hiện trường", "biểu đồ",
  "nguyên nhân", "kỹ thuật", "nhà máy", "tổ chức", "năng lực", "mục tiêu", "phát triển", "chất lượng",
  "kết quả", "tư vấn", "công việc", "thiết kế", "phân tích", "áp dụng", "làm việc", "kiểm tra", "yêu cầu",
  "xác định", "tư duy", "trực quan", "phương pháp", "đo lường", "năng suất", "chi phí", "hiệu quả",
  "giải pháp", "giải quyết", "thay đổi", "thiết bị", "liên tục", "lãnh đạo", "tối ưu", "trực tiếp",
  "nhu cầu", "công ty", "ứng dụng", "xây dựng", "chương trình", "thực hiện", "bảo trì", "sử dụng",
  "yếu tố", "lãng phí", "giai đoạn", "kế hoạch", "quan trọng", "hoạt động", "kiểm soát", "triển khai",
  "nền tảng", "an toàn", "thực hành", "nhân viên", "con người", "bắt đầu", "nâng cao", "quyết định",
  "chia sẻ", "đánh giá", "phạm vi", "chiến lược", "chuyển đổi", "hiệu suất", "tập trung", "nguyên tắc",
  "công nghệ", "hướng dẫn", "công nghiệp", "đội ngũ", "phù hợp", "kinh nghiệm", "tiêu chuẩn", "dịch vụ",
  "mô hình", "môi trường", "chỉ số", "tự động", "dòng chảy", "rõ ràng", "hằng ngày", "thực chiến",
  "kỹ năng", "sơ đồ", "tham gia", "hỗ trợ", "thông tin", "cơ hội", "giám đốc", "khảo sát", "lao động",
  "hoàn thành", "tồn kho", "bộ phận", "kết hợp", "cán bộ", "tự chủ", "đảm bảo", "khả năng", "dây chuyền",
  "bền vững", "cam kết", "kinh doanh", "duy trì", "rủi ro", "thử nghiệm", "triết lý", "cân bằng",
  "loại bỏ", "tài liệu", "báo cáo", "xu hướng", "cải thiện", "chi tiết", "đồng hành", "lộ trình",
  "hành trình", "xuất sắc", "tích hợp", "mặt bằng", "công đoạn", "điểm nghẽn", "trách nhiệm", "liên hệ",
  "chứng nhận", "giảng viên", "học viên", "khóa học", "tinh gọn", "thói quen", "rào cản", "hoạch định",
  "thị trường", "cạnh tranh", "đối tác", "giải thưởng", "kiến thức", "năng lượng", "thông minh",
  "nhân rộng", "chuẩn hóa", "văn phòng", "logistics", "kho vận", "tầm nhìn", "sứ mệnh", "cốt lõi",
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// longest first so multi-word terms win over the words inside them
const SOURCE = [...PHRASES].sort((a, b) => b.length - a.length).map(escape).join("|");
const LETTER = "A-Za-zÀ-ỹĐđ0-9";
const RE = new RegExp(`(?<![${LETTER}])(?:${SOURCE})(?![${LETTER}])`, "giu");
const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE", "NOSCRIPT", "SVG"]);

function keep(text: string) {
  if (!text.includes(" ")) return text;
  return text.replace(RE, (m) => m.replace(/ /g, " "));
}

function processNode(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement;
      if (!p || SKIP.has(p.tagName) || p.closest("[contenteditable]")) return NodeFilter.FILTER_REJECT;
      return n.nodeValue && n.nodeValue.includes(" ") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const v = n.nodeValue!;
    const next = keep(v);
    if (next !== v) n.nodeValue = next;
  }
}

export default function PhraseKeeper() {
  useEffect(() => {
    processNode(document.body);
    let queued: Node[] = [];
    let raf = 0;
    const flush = () => {
      raf = 0;
      const nodes = queued;
      queued = [];
      nodes.forEach((n) => n.isConnected && processNode(n));
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") queued.push(r.target);
        else r.addedNodes.forEach((n) => queued.push(n));
      }
      if (!raf && queued.length) raf = requestAnimationFrame(flush);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
