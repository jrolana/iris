import { searchInventor } from '@/services/inventors/search-inventor';
import { useQuery } from '@tanstack/react-query';

interface UseSearchInventorsProps {
    queryString: string;
}

export function useSearchInventors(props: UseSearchInventorsProps) {
    const { queryString } = props;
    const {data, isLoading} =  useQuery({
        queryKey: ['inventors', queryString],
        queryFn: () => searchInventor( { queryString } ),
    });

    return {inventors: data, isLoading}; 
}
