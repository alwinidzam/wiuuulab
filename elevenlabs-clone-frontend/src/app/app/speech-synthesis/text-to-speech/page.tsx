import { PageLayout } from "~/components/client/page-layout";
import { getHistoryItems } from "~/lib/history";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { TextToSpeechEditor } from "../../../../components/client/speech-synthesis/text-to-speech-editor";

export default async function TextToSpeechPage() {
  let credits = 10000;
  let historyItems: any[] = [];
  const service = "styletts2";

  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          credits: true,
        },
      });
      credits = user?.credits ?? 10000;
    }
  } catch (error) {
    console.warn("TextToSpeechPage user lookup non-fatal fallback:", error);
  }

  try {
    historyItems = await getHistoryItems(service);
  } catch (error) {
    console.warn("TextToSpeechPage getHistoryItems non-fatal fallback:", error);
  }

  return (
    <PageLayout
      title={"Text to Speech"}
      service={service}
      showSidebar={true}
      historyItems={historyItems}
    >
      <TextToSpeechEditor service="styletts2" credits={credits} />
    </PageLayout>
  );
}
