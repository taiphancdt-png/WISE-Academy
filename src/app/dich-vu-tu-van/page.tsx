import React from "react";
import PageHero from "@/components/PageHero";
import LeanRoadmapRace from "@/components/LeanRoadmapRace";
import ServiceDetails from "@/components/ServiceDetails";
import ContextCards from "@/components/ContextCards";
import { ButtonLink, CtaBand, Section, SectionHeader } from "@/components/ui";

export const metadata = {
  title: "Dịch Vụ Tư Vấn Tinh Gọn Hiện Trường | WISE Academy",
  description:
    "5 dịch vụ tư vấn của WISE Academy theo Ngôi nhà Lean: nền móng ổn định & chuẩn hóa, năng suất & lead time, chất lượng với Jidoka & Six Sigma, chiến lược, văn hóa & sự tham gia, số hóa vận hành (Lean 4.0).",
  alternates: { canonical: "/dich-vu-tu-van" },
};

export default function ConsultingPage() {
  const surveySteps = [
    {
      title: "Thấu hiểu nhu cầu & ưu tiên",
      desc: "Lắng nghe ban lãnh đạo về bối cảnh, thách thức và những ưu tiên kinh doanh của doanh nghiệp."
    },
    {
      title: "Xác lập mục tiêu",
      desc: "Cùng thống nhất mục tiêu và chỉ số đo lường cụ thể về năng suất, chất lượng, chi phí và thời gian giao hàng."
    },
    {
      title: "Khảo sát hiện trạng",
      desc: "Đi Gemba quan sát dòng vật tư, dòng thông tin và cách đội ngũ làm việc để nhận diện lãng phí và cơ hội cải tiến."
    },
    {
      title: "Đề xuất lộ trình",
      desc: "Đưa ra giải pháp và lộ trình đồng hành phù hợp giữa thực trạng và mục tiêu của doanh nghiệp."
    }
  ];

  // What customers come to us with (the former four services), shown as situations
  const contexts = [
    {
      title: "Xây dựng / chuyển đổi Hệ thống Quản lý Lean",
      hook: "Cải tiến rời rạc, hết dự án là hết phong trào?",
      context:
        "Doanh nghiệp đang vận hành theo mô hình quản lý truyền thống và muốn chuyển sang hệ thống Lean làm nền tảng cho vận hành xuất sắc và tăng trưởng bền vững. Việc chuyển đổi diễn ra trên hai trục: chuyển đổi hữu hình (quy trình, mặt bằng, dòng giá trị) và chuyển đổi tư duy (năng lực lãnh đạo, văn hóa tổ chức), để Lean trở thành triết lý quản lý dài hạn chứ không chỉ là công cụ.",
      services: [
        { id: "01", name: "Nền móng" },
        { id: "02", name: "Năng suất & Lead time" },
        { id: "03", name: "Chất lượng" },
        { id: "04", name: "Chiến lược & Văn hóa" },
      ],
      brochure: "/brochures/lean-management-system-transformation.pdf",
    },
    {
      title: "Thiết kế Nhà máy Lean mới",
      hook: "Xây xong mới sửa thì quá tốn kém, phải đúng ngay từ đầu.",
      context:
        "Doanh nghiệp chuẩn bị xây nhà máy hoặc mở dây chuyền mới và muốn thiết kế đúng ngay từ đầu theo nguyên tắc Lean: dòng chảy tối ưu, dễ mở rộng và hiệu quả từ ngày đầu vận hành, thay vì phải cải tạo tốn kém sau khi đã xây dựng.",
      services: [
        { id: "02", name: "Năng suất & Lead time" },
        { id: "01", name: "Nền móng" },
        { id: "05", name: "Số hóa" },
      ],
      brochure: "/brochures/new-lean-factory-design.pdf",
    },
    {
      title: "Tích hợp Lean & Chuyển đổi số",
      hook: "Đầu tư công nghệ rồi mà hiệu quả vẫn chưa như kỳ vọng?",
      context:
        "Doanh nghiệp đã hoặc sắp đầu tư công nghệ nhưng chưa thấy hiệu quả tương xứng, thường vì công nghệ được triển khai trên một quy trình chưa tinh gọn. Lean loại bỏ lãng phí và tối ưu quy trình, công nghệ số mang lại tự động hóa, dữ liệu thời gian thực và ra quyết định dựa trên dữ liệu.",
      services: [
        { id: "05", name: "Số hóa" },
        { id: "01", name: "Nền móng" },
      ],
      brochure: "/brochures/lean-digital-transformation.pdf",
    },
    {
      title: "Hệ thống Đào tạo & Phát triển nguồn nhân lực",
      hook: "Thiếu đội ngũ kế cận, nhân sự chưa thực sự gắn kết?",
      context:
        "Trong môi trường biến động, phức tạp và khó đoán định (VUCA), doanh nghiệp cần một hệ thống Đào tạo & Phát triển (L&D) bài bản: năng lực cốt lõi gắn với chiến lược, đội ngũ lãnh đạo kế cận vững vàng, nhân viên gắn kết và một văn hóa cải tiến liên tục.",
      services: [
        { id: "04", name: "Chiến lược & Văn hóa" },
        { id: "03", name: "Chất lượng" },
      ],
      brochure: "/brochures/hr-learning-development-system.pdf",
    },
  ];

  // The five services, organised as the Lean House
  const services = [
    {
      id: "01",
      part: "Nền móng",
      short: "Nền móng ổn định & chuẩn hóa",
      tag: "FOUNDATION · STABILITY & STANDARDIZATION",
      title: "Xây nền móng ổn định & chuẩn hóa",
      subtitle: "Không có nền móng ổn định thì không trụ cột nào đứng vững",
      desc: "Trước khi tăng tốc hay nâng chất lượng, quy trình phải ổn định và được chuẩn hóa: nơi làm việc ngăn nắp, mọi bất thường được nhìn thấy ngay, thiết bị luôn sẵn sàng và mỗi người làm việc theo cùng một chuẩn. WISE Academy cùng doanh nghiệp xây nền móng này ngay tại hiện trường, thí điểm ở khu vực mô hình rồi nhân rộng.",
      tools: ["5S", "Quản lý trực quan", "Công việc tiêu chuẩn", "TPM", "OEE", "Heijunka", "Quản lý hằng ngày", "8 lãng phí"],
      items: [
        "5S: tổ chức nơi làm việc ngăn nắp, an toàn và dễ duy trì",
        "Quản lý trực quan: bảng hiện trường, tín hiệu bất thường, quản lý bằng mắt",
        "Công việc tiêu chuẩn (Standardized Work) và hướng dẫn thao tác chuẩn",
        "Bảo trì năng suất toàn diện (TPM), bảo trì tự quản và cải thiện OEE",
        "Cân bằng tải và sản xuất đều đặn (Heijunka)",
        "Hệ thống quản lý hằng ngày: họp đầu ca, bảng KPI, Gemba Walk",
        "Nhận diện và loại bỏ 8 lãng phí, ổn định 4M (con người, máy móc, vật tư, phương pháp)",
      ],
      image: "/images/services/foundation.webp",
    },
    {
      id: "02",
      part: "Trụ cột Giao hàng đúng hạn",
      short: "Năng suất & Lead time",
      tag: "PILLAR · JUST-IN-TIME · WORK ENGINEERING",
      title: "Năng suất & Lead time: giao hàng đúng hạn",
      subtitle: "Làm đúng thứ khách hàng cần, đúng lúc, đúng số lượng, với ít lãng phí nhất",
      desc: "Nhiều chuyền sản xuất vẫn còn lãng phí, điểm thắt cổ chai, tải công việc không cân bằng và phương pháp làm việc chưa hiệu quả. WISE Academy kết hợp Kỹ thuật công nghiệp (IE) và Lean ngay tại hiện trường: quan sát và đo lường trên chuyền thực tế, cải tiến phương pháp, cân bằng chuyền, thiết kế lại mặt bằng và dòng chảy, rồi tính toán cụ thể năng suất tăng, nhân lực và chi phí tiết kiệm được.",
      tools: ["PQCDSM", "MUDA · MURA · MURI", "Vòng tròn Ohno", "Nghiên cứu công việc", "ECRS", "Biểu đồ Spaghetti", "Takt time", "Yamazumi", "TOC", "Lean Cell", "VSM", "Kanban", "SMED / QCO"],
      results: [
        { value: "15 - 30%", label: "Tăng năng suất" },
        { value: "20 - 40%", label: "Giảm lead time" },
        { value: "15 - 35%", label: "Giảm tồn kho, WIP" },
      ],
      items: [
        "Đánh giá hiệu quả vận hành theo tiêu chí P (Năng suất) - Q (Chất lượng) - C (Chi phí) - D (Giao hàng) - S (An toàn) - M (Môi trường); nhận diện MUDA, MURA, MURI tại hiện trường thông qua kỹ thuật đi quan sát Gemba và quan sát trong vòng tròn Ohno.",
        "Nghiên cứu công việc: nghiên cứu phương pháp và đo lường công việc, biểu đồ quá trình (Flow Process Chart), phân tích thao tác trên chuyền",
        "Cải tiến phương pháp bằng ECRS, nguyên tắc tiết kiệm thao tác và công thái học; giảm di chuyển, vận chuyển bằng biểu đồ Spaghetti",
        "Takt time, Cycle time, Lead time; tìm công đoạn thắt cổ chai (TOC) và cân bằng chuyền bằng biểu đồ Yamazumi",
        "Tối ưu nhân lực theo năng lực máy và người, đứng nhiều máy, kết hợp công việc",
        "Thiết kế mặt bằng và Lean Cell cho dòng một sản phẩm; vẽ chuỗi giá trị (VSM) và quản lý theo dòng giá trị",
        "Hệ thống kéo (Kanban, siêu thị, FIFO) và rút ngắn thời gian chuyển đổi (SMED, QCO)",
        "Tính toán lợi ích: năng suất tăng, nhân lực tiết kiệm, chi phí giảm, trình bày và bảo vệ phương án cải tiến",
      ],
      image: "/images/services/productivity.webp",
    },
    {
      id: "03",
      part: "Trụ cột Chất lượng",
      short: "Chất lượng: Jidoka & Six Sigma",
      tag: "PILLAR · JIDOKA · LEAN SIX SIGMA (LSSI)",
      title: "Chất lượng ngay tại nguồn với Jidoka & Six Sigma",
      subtitle: "Không nhận lỗi, không làm ra lỗi, không chuyển lỗi cho công đoạn sau",
      desc: "Chất lượng được xây dựng ngay trong từng công đoạn: người vận hành làm chủ chất lượng, bất thường được báo hiệu tức thời (Andon) và xử lý ngay, lỗi được ngăn từ gốc bằng chống sai lỗi. Song song, bộ công cụ Six Sigma giúp giảm biến động và ra quyết định dựa trên dữ liệu. Là đối tác ủy quyền của Lean Six Sigma Institute (LSSI), WISE Academy đào tạo, kèm cặp dự án và cấp chứng nhận quốc tế cho từng vai trò trong tổ chức.",
      tools: ["Jidoka", "Andon", "Poka-Yoke", "Chất lượng tại công đoạn", "PDCA", "A3 / 8D", "5 Why", "DMAIC", "SPC", "MSA", "FMEA", "Cp / Cpk", "DOE", "TQM"],
      items: [
        "Chất lượng tại công đoạn (In-Station Quality): người vận hành làm chủ chất lượng, báo hiệu bất thường bằng Andon và xử lý ngay",
        "Jidoka và chống sai lỗi (Poka-Yoke) cho công đoạn và sản phẩm",
        "Giải quyết vấn đề có cấu trúc theo PDCA: A3, 8D, 5 Why, biểu đồ xương cá, tìm nguyên nhân gốc rễ và duy trì kết quả",
        "Dự án Six Sigma theo DMAIC, phân vai theo cấp đai: White Belt (16 giờ), Yellow (40), Green (80, quản lý cấp trung), Black (120, chuyên gia), Master Black Belt (160)",
        "Công cụ thống kê: phân tích hệ thống đo (MSA, Gage R&R), năng lực quy trình (Cp, Cpk), kiểm soát quá trình bằng thống kê (SPC), kiểm định giả thuyết, DOE",
        "Phân tích rủi ro FMEA và phân tích Pareto để chọn đúng vấn đề ưu tiên",
        "Quản lý chất lượng toàn diện (TQM) và hệ thống chỉ số chất lượng (Quality KPIs)",
        "Đào tạo, kèm cặp dự án và cấp chứng nhận LSSI & CSSC (LSSI: hơn 25 năm kinh nghiệm, hơn 70.000 học viên trên toàn cầu)",
      ],
      image: "/images/services/quality.webp",
    },
    {
      id: "04",
      part: "Mái nhà",
      short: "Chiến lược, văn hóa & sự tham gia",
      tag: "ROOF · LEAN LEADERSHIP · KAIZEN CULTURE",
      title: "Lãnh đạo, chiến lược & văn hóa cải tiến",
      subtitle: "Từ người chữa cháy thành người xây dựng hệ thống, và mỗi nhân viên đều tham gia cải tiến",
      desc: "Chuyển đổi Lean là một sáng kiến chiến lược, không phải một khóa đào tạo thông thường. WISE Academy cùng ban lãnh đạo trải nghiệm tư duy dòng chảy, nhìn doanh nghiệp qua chuỗi giá trị, phân tích khoảng cách giữa hiện tại và tương lai, chọn sáng kiến ưu tiên và cam kết một lộ trình hành động rõ ràng. Ở cấp giám sát, đội ngũ được rèn tư duy phát triển (Growth mindset) và tư duy Kaizen với ba hành vi cốt lõi: hỏi tại sao, đi quan sát, huấn luyện. Cơ chế để mọi người cùng tham gia (Involvement) biến cải tiến thành thói quen hằng ngày.",
      tools: ["Hoshin Kanri", "Catch-ball", "A3", "Leader Standard Work", "Gemba Walk", "Ma trận Tác động - Nỗ lực", "Lean KPIs", "Growth mindset", "Kaizen Event", "Nhóm cải tiến (SGA / QCC)", "Kaizen một điểm", "TWI", "Coaching"],
      items: [
        "Workshop Lean Leadership cho CEO, giám đốc nhà máy, trưởng bộ phận: mô phỏng sản xuất theo lô và theo dòng chảy, \"Điều gì xảy ra nếu chúng ta không thay đổi?\"",
        "Nhìn doanh nghiệp qua chuỗi giá trị (VSM), phân tích khoảng cách hiện tại và tương lai, rà soát cơ cấu tổ chức và hệ thống KPI",
        "Chọn sáng kiến ưu tiên bằng ma trận Tác động - Nỗ lực, xây lộ trình chuyển đổi 6 - 12 tháng và cam kết hành động của từng lãnh đạo",
        "Triển khai chiến lược: Hoshin Kanri, Catch-ball, A3, Leader Standard Work, quản lý theo dòng giá trị và Lean KPIs",
        "Growth mindset và Kaizen mindset cho Senior, Leader, Supervisor: 3 cấp độ Kaizen (sửa, cải tiến, phòng ngừa) theo tiếp cận RG-PDCA",
        "Sự tham gia của mọi người (Involvement): Kaizen một điểm, nhóm cải tiến (SGA, QCC), Kaizen Event, hệ thống đề xuất và ghi nhận",
        "Cấu trúc dự án Kaizen: Project Charter, nguyên tắc 4 Đúng (đúng dự án, đúng đội, đúng phạm vi, đúng kết quả), Kaizen Workbook, chỉ số QCD",
        "Phát triển con người: khung năng lực, hệ thống Đào tạo & Phát triển (L&D), TWI, kỹ năng Coaching, đào tạo giảng viên nội bộ",
      ],
      image: "/images/services/leadership.webp",
    },
    {
      id: "05",
      part: "Số hóa",
      short: "Số hóa vận hành (Lean 4.0)",
      tag: "DIGITAL · LEAN 4.0",
      title: "Số hóa vận hành trên nền Lean (Lean 4.0)",
      subtitle: "Tinh gọn trước, số hóa sau, để mỗi khoản đầu tư công nghệ tạo ra giá trị thật",
      desc: "Công nghệ chỉ phát huy khi được đặt trên một quy trình đã tinh gọn. WISE Academy giúp doanh nghiệp số hóa các thực hành Lean: dữ liệu vận hành theo thời gian thực, quản lý trực quan trên màn hình, cảnh báo bất thường tức thời và ra quyết định dựa trên dữ liệu.",
      tools: ["Dữ liệu thời gian thực", "Dashboard", "IoT", "AI", "RPA", "ISE", "OEE số"],
      items: [
        "Hệ thống quản lý dữ liệu vận hành theo thời gian thực: năng suất, OEE, chất lượng",
        "Quản lý trực quan số: bảng điều khiển (dashboard) tại hiện trường và cho lãnh đạo",
        "Kết nối máy móc (IoT), thu thập dữ liệu tự động và cảnh báo bất thường",
        "Ứng dụng AI và tự động hóa quy trình (RPA) cho các bước lặp lại",
        "Kỹ thuật hệ thống công nghiệp (ISE) và mô phỏng trước khi đầu tư",
        "Lộ trình chuyển đổi số gắn với ưu tiên vận hành của doanh nghiệp",
      ],
      image: "/images/services/digital.webp",
    },
  ];

  const roadmapStages = [
    {
      name: "Khám phá & Làm quen với Lean (Explore)",
      short: "Khám phá",
      time: "Linh hoạt theo mức độ cam kết",
      objective: "Lãnh đạo hiểu đúng về Lean, làm rõ lý do áp dụng và tạo điều kiện để đội ngũ tiếp cận Lean qua các sáng kiến gắn với chiến lược doanh nghiệp.",
      outcome: "Lãnh đạo đánh giá được doanh nghiệp đang ở chặng nào trên hành trình Lean."
    },
    {
      name: "Xây dựng nền tảng Lean (Foundation)",
      short: "Nền tảng",
      time: "6 - 9 tháng",
      objective: "Lãnh đạo thúc đẩy phát triển năng lực nền tảng cho đội ngũ vận hành và thực nghiệm ngay tại hiện trường để khơi dậy đổi mới, làm rõ hiện trạng, định hình tầm nhìn. Đội ngũ quản lý được đào tạo để thay đổi tư duy quản trị vận hành và thí điểm công cụ Lean nhằm tạo Quick Wins.",
      outcome: "75% tập trung xây dựng kiến thức nền tảng, 25% phát triển năng lực triển khai thực tế."
    },
    {
      name: "Nhân rộng Lean toàn tổ chức (Scale)",
      short: "Nhân rộng",
      time: "9 - 18 tháng",
      objective: "Nhân rộng các thực hành Lean tốt nhất ra toàn tổ chức và tạo kết quả kinh doanh rõ ràng qua các chỉ số hiệu suất vận hành đo lường được.",
      outcome: "25% tập trung kiến thức chuyên sâu, 75% nhân rộng, chuẩn hóa và cải tiến liên tục."
    },
    {
      name: "Đưa Lean vào vận hành hằng ngày (Embed)",
      short: "Vận hành",
      time: "12 - 18 tháng",
      objective: "Tích hợp Lean vào hoạt động hằng ngày trên toàn tổ chức, củng cố hệ thống quản lý để nhận diện bất thường và kiểm soát hiệu quả quy trình, con người và vấn đề.",
      outcome: "Năng lực đội ngũ vận hành nâng lên rõ rệt, tổ chức tự quản lý và duy trì được hiệu suất."
    },
    {
      name: "Xây dựng văn hóa cải tiến liên tục (Culture)",
      short: "Văn hóa",
      time: "Liên tục, không giới hạn",
      objective: "Nguyên tắc và thực hành Lean thấm sâu vào văn hóa tổ chức, giúp cải tiến liên tục để luôn đáp ứng và vượt kỳ vọng của khách hàng.",
      outcome: "Lean trở thành kim chỉ nam cho mọi hoạt động chiến lược, thể hiện qua kết quả về an toàn, chất lượng, giao hàng, chi phí, sự gắn kết của nhân viên và giá trị thương hiệu."
    }
  ];

  return (
    <div>
      <PageHero
        eyebrow="Dịch vụ tư vấn doanh nghiệp"
        image="/images/projects/yujin-kreves-dao-tao-tu-van-5s-an-toan-quan-ly-truc-quan/photo_1.webp"
        title={<>Giải pháp tư vấn <span className="text-[#FF7A30]">vận hành tinh gọn</span> tại hiện trường</>}
        description="Mọi dự án tư vấn của WISE Academy đều bắt đầu với bước khảo sát hiện trạng: trò chuyện với Ban lãnh đạo để thấu hiểu những trăn trở, nhu cầu và những ưu tiên; đi quan sát hiện trường để nắm bắt hiện trạng vận hành; cùng kiến tạo lộ trình triển khai cải tiến với mục tiêu rõ ràng, đúng trọng tâm và đo lường được kết quả đầu ra."
      >
        <ButtonLink href="/lien-he">Đặt lịch khảo sát hiện trạng</ButtonLink>
      </PageHero>

      {/* quick links to the five services, aligned with the header (1400px) */}
      <div className="bg-white px-4 sm:px-6 pt-14 lg:pt-16">
        <nav aria-label="Các dịch vụ tư vấn" className="max-w-[1400px] mx-auto sm:px-2 xl:px-6 grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {services.map((p) => (
            <a
              key={p.id}
              href={`#dich-vu-${p.id}`}
              className="group flex items-center justify-center gap-2 text-center rounded-2xl border border-[#002F5B]/15 bg-white px-4 py-3.5 text-sm font-semibold leading-snug text-[#002F5B] shadow-[0_6px_18px_-12px_rgba(0,47,91,0.5)] transition-all hover:-translate-y-0.5 hover:border-[#F76011] hover:text-[#C9500E]"
            >
              <span className="text-[#F76011]">{p.id}</span> {p.short}
            </a>
          ))}
        </nav>
      </div>

      {/* What we can help with: the situations customers come with */}
      <Section className="!pt-14 lg:!pt-16">
        <SectionHeader
          title={<>Chúng tôi có thể <span className="text-[#F76011]">giúp gì</span> cho doanh nghiệp?</>}
          description="Mỗi doanh nghiệp chia sẻ câu chuyện về những thách thức nội tại và ngoại tại của mình với WISE Academy đều rất khác. Tuy nhiên, với cách tiếp cận khoa học, hệ thống RGPDCA, WISE Academy cam kết đồng hành kiến tạo lộ trình sát nhất với nhu cầu và ưu tiên của Doanh nghiệp tại từng giai đoạn phát triển."
        />
        <ContextCards items={contexts} />
      </Section>

      {/* Survey first: the four steps every engagement starts with */}
      <Section tone="muted">
        <SectionHeader
          title={<>Thấu hiểu để <span className="text-[#F76011]">đồng hành</span></>}
          description="Mỗi doanh nghiệp có bối cảnh, ưu tiên và thực trạng vận hành riêng. Vì vậy trước khi đề xuất bất kỳ giải pháp nào, WISE Academy cùng doanh nghiệp đi qua bốn bước sau."
        />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {surveySteps.map((step, i) => (
            <li key={step.title} className="card-soft p-6">
              <span className="text-3xl font-bold text-[#F76011]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold text-[#002F5B] leading-snug">{step.title}</h3>
              <p className="mt-2 text-sm text-[#486581] leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <ButtonLink href="/lien-he">Hãy liên hệ với chúng tôi để bắt đầu câu chuyện hành trình cải tiến</ButtonLink>
        </div>
      </Section>

      {/* The five services in detail: alternating image / text */}
      {services.map((s, idx) => (
        <section key={s.id} id={`dich-vu-${s.id}`} className={`${idx % 2 ? "bg-[#F8F9FA]" : "bg-white"} py-16 lg:py-20 px-4 sm:px-6 scroll-mt-24`}>
          <div className={`max-w-[1400px] mx-auto grid grid-cols-1 gap-x-14 sm:px-2 xl:px-6 gap-y-8 lg:gap-y-0 lg:items-center ${idx % 2 ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"}`}>
            {/* shop-floor photo, landscape 4:3 in 5/12 of the width */}
            <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 lg:row-start-1 ${idx % 2 ? "lg:col-start-2" : "lg:col-start-1"}`}>
              <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <span className="absolute left-4 top-4 rounded-full bg-[#002F5B]/90 px-3 py-1 text-xs font-semibold text-white">
                {s.id} · {s.part}
              </span>
            </div>
            <ServiceDetails id={s.id} listTitle="Phạm vi tư vấn" items={s.items} col={idx % 2 ? "lg:col-start-1" : "lg:col-start-2"}>
              <span className="text-sm font-semibold text-[#C9500E]">{s.tag}</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-[#002F5B] leading-tight">{s.title}</h2>
              <p className="mt-4 text-sm sm:text-base text-[#486581] leading-relaxed">
                <strong className="text-[#102A43]">{s.subtitle}.</strong> {s.desc}
              </p>
              {"results" in s && s.results && (
                <dl className="mt-5 grid grid-cols-3 gap-3 max-w-lg">
                  {s.results.map((r) => (
                    <div key={r.label} className="rounded-xl bg-white border border-[#002F5B]/10 px-3 py-2.5">
                      <dt className="sr-only">{r.label}</dt>
                      <dd className="text-lg sm:text-xl font-bold text-[#002F5B] leading-tight">{r.value}</dd>
                      <dd className="mt-0.5 text-xs text-[#486581] leading-snug">{r.label}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {"results" in s && s.results && (
                <p className="mt-1.5 text-[11px] text-[#486581]">Mức cải thiện điển hình tại các doanh nghiệp sản xuất áp dụng Lean, mang tính tham khảo.</p>
              )}
              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#002F5B]">Công cụ & kỹ thuật</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {s.tools.map((t) => (
                  <li key={t} className="rounded-full border border-[#F76011]/40 bg-[#FFF5EC] px-3 py-1 text-xs font-semibold text-[#C9500E]">
                    {t}
                  </li>
                ))}
              </ul>
            </ServiceDetails>
          </div>
        </section>
      ))}

      {/* Roadmap */}
      <LeanRoadmapRace
        stages={roadmapStages}
        title={<>Lộ trình chuyển đổi Lean<br /><span className="text-[var(--rm-accent,#C9500E)]">5 giai đoạn</span></>}
        description="Chuyển đổi Lean là hành trình cần hoạch định rõ ràng, lãnh đạo cam kết và đồng hành bền bỉ để vượt qua rào cản ban đầu, hình thành thói quen cải tiến và kiến tạo văn hóa Lean."
      />

      <CtaBand
        title="Xây dựng lộ trình chuyển đổi cho doanh nghiệp của bạn"
        description="Bắt đầu bằng một buổi khảo sát hiện trường miễn phí để cùng nhìn ra cơ hội tăng năng suất và giảm chi phí."
      />
    </div>
  );
}
