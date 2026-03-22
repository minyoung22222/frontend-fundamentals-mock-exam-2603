import axios from 'axios';

/**
 * axios 에러 또는 알 수 없는 에러에서 서버 메시지를 추출한다.
 * 서버 응답에 message 필드가 없으면 fallback 메시지를 반환한다.
 */
export function getServerErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? fallback;
  }
  return fallback;
}
