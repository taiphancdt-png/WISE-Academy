// Organisations featured on leansixsigmainstitute.org as having trained with LSSI, grouped by industry.
// Logos are taken from the LSSI website; `height` (px) balances the visual weight of wide vs. square marks.
export interface LssiClientGroup {
  industry: string;
  brands: { name: string; logo: string; height: number }[];
}

export const LSSI_CLIENTS: LssiClientGroup[] = [
  {
    industry: "Ô tô, cơ khí & sản xuất",
    brands: [
      { name: "BMW", logo: "/images/lssi/clients/bmw.webp", height: 56 },
      { name: "Porsche", logo: "/images/lssi/clients/porsche.webp", height: 20 },
      { name: "Continental", logo: "/images/lssi/clients/continental.webp", height: 28 },
      { name: "Caterpillar", logo: "/images/lssi/clients/cat.webp", height: 48 },
      { name: "LEGO", logo: "/images/lssi/clients/lego.webp", height: 56 },
    ],
  },
  {
    industry: "Bán lẻ, thời trang & hàng tiêu dùng",
    brands: [
      { name: "Amazon", logo: "/images/lssi/clients/amazon.webp", height: 36 },
      { name: "Zara", logo: "/images/lssi/clients/zara.webp", height: 42 },
      { name: "New Balance", logo: "/images/lssi/clients/new-balance.webp", height: 48 },
      { name: "Fender", logo: "/images/lssi/clients/fender.webp", height: 39 },
      { name: "NIVEA", logo: "/images/lssi/clients/nivea.webp", height: 56 },
    ],
  },
  {
    industry: "Thực phẩm & đồ uống",
    brands: [
      { name: "Coca-Cola", logo: "/images/lssi/clients/coca-cola.webp", height: 37 },
      { name: "Pepsi", logo: "/images/lssi/clients/pepsi.webp", height: 56 },
      { name: "Hershey's", logo: "/images/lssi/clients/hersheys.webp", height: 33 },
      { name: "Kraft Heinz", logo: "/images/lssi/clients/kraft-heinz.webp", height: 27 },
      { name: "Grupo Bimbo", logo: "/images/lssi/clients/grupo-bimbo.webp", height: 44 },
      { name: "Bavaria", logo: "/images/lssi/clients/bavaria.webp", height: 46 },
      { name: "Jose Cuervo", logo: "/images/lssi/clients/jose-cuervo.svg", height: 32 },
      { name: "NatureSweet", logo: "/images/lssi/clients/naturesweet.webp", height: 45 },
      { name: "Sunkist", logo: "/images/lssi/clients/sunkist.webp", height: 56 },
    ],
  },
  {
    industry: "Y tế & dược phẩm",
    brands: [
      { name: "Pfizer", logo: "/images/lssi/clients/pfizer.webp", height: 41 },
      { name: "Allen Parish Community Healthcare", logo: "/images/lssi/clients/allen-parish.webp", height: 42 },
      { name: "Western University of Health Sciences", logo: "/images/lssi/clients/western-university.webp", height: 56 },
    ],
  },
  {
    industry: "Dịch vụ, tư vấn & khu vực công",
    brands: [
      { name: "Accenture", logo: "/images/lssi/clients/accenture.webp", height: 33 },
      { name: "McKinsey & Company", logo: "/images/lssi/clients/mckinsey.webp", height: 36 },
      { name: "Marriott International", logo: "/images/lssi/clients/marriott.webp", height: 36 },
      { name: "U.S. Navy", logo: "/images/lssi/clients/us-navy.webp", height: 56 },
    ],
  },
  {
    industry: "Giáo dục & đào tạo",
    brands: [
      { name: "UCAM", logo: "/images/lssi/clients/ucam.svg", height: 36 },
      { name: "Harvard University", logo: "/images/lssi/clients/harvard.webp", height: 33 },
      { name: "Boston College", logo: "/images/lssi/clients/boston-college.webp", height: 36 },
      { name: "Wagner College", logo: "/images/lssi/clients/wagner-college.webp", height: 56 },
      { name: "Universidad del Norte", logo: "/images/lssi/clients/universidad-del-norte.webp", height: 36 },
      { name: "Universidad Tecmilenio", logo: "/images/lssi/clients/tecmilenio.webp", height: 33 },
      { name: "Florida Virtual School", logo: "/images/lssi/clients/florida-virtual-school.webp", height: 40 },
      { name: "ICAMI", logo: "/images/lssi/clients/icami.webp", height: 36 },
    ],
  },
];
