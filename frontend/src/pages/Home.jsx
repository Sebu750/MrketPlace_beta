import Hero from "../components/Hero";
import MarqueeTicker from "../components/MarqueeTicker";
import NewArrivals from "../components/NewArrivals";
import EditorialFeature from "../components/EditorialFeature";
import ShopByCraft from "../components/ShopByCraft";
import FeaturedCollection from "../components/FeaturedCollection";
import BestSellers from "../components/BestSellers";
import DesignerSpotlight from "../components/DesignerSpotlight";
import CraftStory from "../components/CraftStory";
import TrendingNow from "../components/TrendingNow";
import GlobalTrustStrip from "../components/GlobalTrustStrip";
import PicksForYou from "../components/PicksForYou";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeTicker />
      <NewArrivals />
      <EditorialFeature />
      <ShopByCraft />
      <FeaturedCollection />
      <BestSellers />
      <DesignerSpotlight />
      <CraftStory />
      <TrendingNow />
      <GlobalTrustStrip />
      <PicksForYou />
      <Newsletter />
    </>
  );
}
