import { initiateReportMeeting } from '@/services/reports/initiate-report-meeting';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useInitiateReportMeeting() {
    const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationKey: ['reports', 'initiate-meeting'],
    mutationFn: initiateReportMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  });

  return { initiatemeeting: mutateAsync, isInitiating: isPending, error };
}