import PageHero from "@/components/PageHero";
import { Section, CtaBand } from "@/components/ui";
import { LssiClients, LssiIncluded, LssiPartnerIntro, LssiPricingCta, LssiProgramGrid } from "@/components/LssiPrograms";
import LssiInterestForm from "@/components/LssiInterestForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Lean Six Sigma chuẩn quốc tế LSSI | WISE Academy",
  description:
    "Đào tạo Lean Six Sigma chuẩn quốc tế LSSI Global tại Việt Nam: Yellow, Green, Black, Master Black Belt và thạc sĩ UCAM. Học online hoặc trực tiếp.",
  path: "/dao-tao-lean-six-sigma",
});

export default function LeanSixSigmaTrainingPage() {
  return (
    <div>
      <PageHero
        eyebrow="Đối tác ủy quyền của LSSI Global"
        image="/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-green-belt/photo_2.webp"
        title={<>Đào tạo <span className="text-[#FF7A30]">Lean Six Sigma</span> chuẩn quốc tế</>}
        description="Chương trình chứng nhận quốc tế của LSSI Global, từ Yellow Belt đến Master Black Belt, học theo 3 hình thức: self-paced, face to face và virtual live."
      />

      <Section>
        <div className="space-y-14">
          <LssiPartnerIntro />
          <LssiPricingCta href="#dang-ky-lssi" />
          <LssiProgramGrid />
          <LssiIncluded />
          <div id="dang-ky-lssi" className="scroll-mt-40">
            <LssiInterestForm />
          </div>
          <LssiClients />
        </div>
      </Section>

      <CtaBand
        title="Muốn tư vấn lộ trình chứng nhận phù hợp?"
        description="Để lại thông tin, chuyên gia WISE Academy sẽ gọi lại trao đổi lộ trình học Lean Six Sigma phù hợp với bạn hoặc đội ngũ."
      />
    </div>
  );
}
