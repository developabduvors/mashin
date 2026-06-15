import { Hero } from "@/features/home/_components/Hero";
import { BrandsGrid } from "@/features/home/_components/BrandsGrid";
import { PtsCars } from "@/features/home/_components/PtsCars";
import { Collections } from "@/features/home/_components/Collections";
import { BeatOffer } from "@/features/home/_components/BeatOffer";
import { SpecialOffers } from "@/features/home/_components/SpecialOffers";
import { CreditCalculator } from "@/features/home/_components/CreditCalculator";
import { PartnerBanks } from "@/features/home/_components/PartnerBanks";
import { Ratings } from "@/features/home/_components/Ratings";
import { Reviews } from "@/features/home/_components/Reviews";
import { AboutBlog } from "@/features/home/_components/AboutBlog";
import { MapContacts } from "@/features/home/_components/MapContacts";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <BrandsGrid />
      <PtsCars />
      <Collections />
      <BeatOffer />
      <SpecialOffers />
      <CreditCalculator />
      <PartnerBanks />
      <Ratings />
      <Reviews />
      <AboutBlog />
      <MapContacts />
    </div>
  );
}
