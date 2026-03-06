import { useQuery } from "@tanstack/react-query";
import { getAllPings } from "@/services/pings/get-all-pings";

export function useGetAllPings() {
    const {data, isLoading} = useQuery({
        queryKey: ["pings"],
        queryFn: getAllPings,
    })

    return {pings: data, isLoading}
}