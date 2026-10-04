import experts from "@/data/experts.json";
import projects from "@/data/projects.json";
import { LSSI_CLIENTS } from "@/data/lssi-clients";

// Proper names of companies, organisations and people that machine translation (English / 中文) must leave as
// written. Only the distinctive name is listed ("Sunjin Vina", not "Công ty TNHH Sunjin Vina"), so descriptive
// words around it ("Công ty", "Tập đoàn", "Nhà máy") are still translated. Add new clients and partners here.
const COMPANIES = [
  // WISE Academy and partners
  "WISE Academy", "WISE", "Lean Six Sigma Institute", "LSSI Global", "LSSI", "CITARES", "Kim Đăng Consulting",
  "P&Q Solutions", "YCA Education", "Youth Creative Academy", "Impactiva", "Vaeso", "Better Work", "GEAR",
  // clients and employers
  "Pou Chen", "Pou Yuen", "An Giang Samho", "Samho", "Huali", "Apache Footwear", "Apache", "GEODIS", "Tỷ Bách",
  "Victory Group", "Yujin Kreves", "KREVES", "AQUA", "Biti's", "PNJ", "Simpson Strong-Tie", "Jia Hsin",
  "Freetrend", "Dean Shoes Group", "Giang Phạm", "TBS Group", "Tân Long Group", "Tuấn Việt Shoes", "Liên Phát Shoes",
  "Giày Hằng Vỹ", "Esquel", "Far Eastern Polytex", "Grand World", "Vision International", "Saigon Seiki",
  "Nidec Servo", "Nidec Tosok", "Nidec", "LIXIL", "Michelin", "Camso", "Bühler", "Emerson", "Kadant Fiberline",
  "Bitron Electronic", "BeiYu", "LOM Perlos", "Liteonmobile", "Motorola", "Nokia", "Zebra", "Pepperl+Fuchs",
  "Swarovski", "Marigot", "Midea", "Sunjin Vina", "Bắc Âu Mỹ", "Sợi Thế Kỷ", "Dệt May Thành Công", "Phan Nam",
  "BDSC", "Trần Đình Cửu", "Á Châu", "Việt Tiến", "South Island Garment", "Trường Thành", "TTF", "Điện Quang",
  "Kato Precision", "Kato Group", "Numatec", "May Việt Khánh", "May Nam Châu", "Saitex International", "Topcin",
  "Gia Thịnh Phát", "Dynaplast", "Solartech", "MCreative Vina", "Bao bì Việt Thành", "Vinavit", "Saigon Co.op",
  "Farminut", "Khải Hoàn Insulation", "BUWWON", "DAPHA", "MIDA", "DB Schenker", "Mondelez Kinh Đô",
  "Wonderful Electric", "Daikin", "Yamaha", "Uchida", "VPIC", "Zeon", "Núi Pháo", "H.C. Starck", "EVN HCMC",
  "Xi măng Hà Tiên", "Reetech", "Bia Sài Gòn", "Yuki", "Thiên Long", "Bảo Bảo", "Sonion", "Datalogic",
  "Duy Hằng", "Tuấn Ngọc Nhi", "Honda", "Gỗ Phú Tài", "MDC Precision", "Gỗ Minh Thành", "VITANA", "Haidilao",
  "Langege Milk", "Yuxing Nut", "Jingfeng Glass", "NanoChem", "Nestlé", "Vinamilk", "Vĩnh Hoàn", "Lotte",
  "Nhuận Tiến", "Bách Tùng", "CNS Amura", "Unilever", "Sumiden", "Meinan", "TSAV", "Lọc dầu Dung Quất",
  "Gia Nhật Tân", "Race to the Top", "SOVI", "Legoplastics", "Daemung", "Sailun", "Jinyu Tires", "Kumho Tires",
  "Casumina", "Toshiba", "Cát Thái", "Duy Khánh", "New Hanam", "Dynamo", "Vina Kyoei Steel", "POSCO",
  "VNSTEEL", "VN Mold", "Molex", "MEIWA", "Foster Electric", "Jabil", "Nike", "adidas", "Adidas", "Puma",
  "New Balance", "Samsung",
  // institutions and certifying bodies
  "IFC", "World Bank", "ILO", "JICA", "USAID", "GIZ", "APO", "eAPO", "APED", "JPC", "VNPI", "VCCI", "ASQ", "BSI",
  "CQI-IRCA", "TÜV", "Satra Technology", "SITRA", "Qualtec", "Sigma Zone", "Gemba Consult", "BMGI",
  "Six Sigma Management Institute", "SSMI", "Wieck Institute of Management Consulting", "TMS Vietnam",
  "Quanskill", "Bossard", "Timeline Training", "Slide Factory", "Eduviet", "Business Edge", "British Council",
  "RMIT University", "Coursera", "LinkedIn Learning", "C4IR", "CSED", "AITC", "Pace Institute of Management",
  "EARIST", "Northern Virginia University", "LIUC",
];

const PEOPLE = ["Kate", "Neville Clarke", "Đàm Minh Hạnh"];

// names straight from the site data, so new experts, clients and LSSI brands are covered automatically
const fromData = [
  ...experts.flatMap((e) => [e.name.replace(/\s*\(.*\)$/, ""), ...((e.testimonials || []).map((t) => t.name))]),
  ...projects.map((p) => p.client),
  ...LSSI_CLIENTS.flatMap((g) => g.brands.map((b) => b.name)),
];

export const PROPER_NAMES = [...new Set([...COMPANIES, ...PEOPLE, ...fromData].map((s) => s.trim()))].filter(
  (s) => s.length >= 2,
);
