import { useQuery } from "@tanstack/react-query";
import { getApplicationById } from "@/services/application/get-application-by-id";

interface UseGetApplicationByIdProp {
  appId: string;
}

export function useGetAppById(props: UseGetApplicationByIdProp) {
  const { appId } = props;

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["application", appId],
    queryFn: () => getApplicationById({ id: appId }),
    enabled: !!appId && appId.trim() !== "",
  });

  return {
    application: data,
    isLoading,
    isFetched,
  };
}