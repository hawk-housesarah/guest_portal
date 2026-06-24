/**
 * 현재 호스트를 기반으로 서비스 모드를 감지합니다.
 * - luggage.housesarah.net → isLuggage = true
 * - 그 외 → isLuggage = false (체크인 모드)
 */
export const useMode = () => {
  const isLuggage = computed(() => {
    if (import.meta.server) {
      const event = useRequestEvent();
      const host = event?.node?.req?.headers?.host ?? '';
      return host.startsWith('luggage.');
    }
    if (typeof window !== 'undefined') {
      return window.location.hostname.startsWith('luggage.');
    }
    return false;
  });

  return { isLuggage };
};
