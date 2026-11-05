import { PageLayout } from "~/components/client/page-layout";
import { HistoryList } from "~/components/client/sound-effects/history-list";
import { getHistoryItems } from "~/lib/history";

export default async function SoundEffectsHistoryPage() {
  const soundEffectsTabs = [
    {
      name: "Generate",
      path: "/app/sound-effects/generate",
    },
    {
      name: "History",
      path: "/app/sound-effects/history",
    },
  ];

  const service = "make-an-audio";
  let historyItems: any[] = [];

  try {
    historyItems = await getHistoryItems(service);
  } catch (error) {
    console.warn("SoundEffectsHistoryPage getHistoryItems non-fatal fallback:", error);
  }

  return (
    <PageLayout
      title={"Sound Effects"}
      showSidebar={false}
      tabs={soundEffectsTabs}
      service={service}
    >
      <HistoryList historyItems={historyItems} />
    </PageLayout>
  );
}
