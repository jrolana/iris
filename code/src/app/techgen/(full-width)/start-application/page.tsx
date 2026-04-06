import StartApplicationPageClient from "./StartApplicationPageClient";
import { IpType, IP_TYPES } from "@/lib/types/ip";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ipType?: string }>;
}) {
  const { ipType } = await searchParams;

  if (!ipType || !IP_TYPES.includes(ipType as IpType)) {
    return (
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-2">
        Invalid IP Type. Please go back and select a valid IP Type.
      </div>
    );
  }

  return <StartApplicationPageClient ipType={ipType as IpType} />;
}
