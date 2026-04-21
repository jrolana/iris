import { useQuery } from "@tanstack/react-query";
import { getAllPings } from "@/services/pings/get-all-pings";

export function useGetAllPings() {
    const {data, error, isLoading, isError} = useQuery({
        queryKey: ["pings"],
        queryFn: getAllPings,
    })

    return {pings: data, error, isLoading, isError}
}
