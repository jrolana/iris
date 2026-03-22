"use client";

import { useQuery } from "@tanstack/react-query";
import { IpType } from "@/lib/types/ip";
import { getPublicResourcesByIpType } from "@/services/public-resources/get-public-resources-by-ip-type";

interface UseGetPublicResourcesByIpTypeProps {
  ipType: IpType | null;
}

export function useGetPublicResourcesByIpType(
  props: UseGetPublicResourcesByIpTypeProps,
) {
  const { ipType } = props;

  const query = useQuery({
    queryKey: ["public-resources", ipType],
    queryFn: () => getPublicResourcesByIpType({ ipType: ipType as IpType }),
    enabled: !!ipType,
  });

  return {
    files: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}