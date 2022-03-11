import { ref } from 'vue';

interface HTTPError<TError> {
  code: number;
  error: Error;
  data: TError | null;
}

type RequestFactory<TResult = any, TArgs = {}, TError = any> = (args: TArgs) => { url: string; request?: RequestInit };

function callbackRegistry<TArgs extends [...any[]]>() {
  const callbacks: ((...args: TArgs) => void)[] = [];

  const register = (callback: (...args: TArgs) => void) => callbacks.push(callback);

  const trigger = (...args: TArgs) => callbacks.forEach(callback => callback(...args));

  return { register, trigger };
}

function useRequest<TResult = any, TArgs = {}, TError = any>(
  factory: RequestFactory<TResult, TArgs, TError>,
  immediateArgs?: TArgs
) {
  const loading = ref(false);
  const result = ref<TResult | null>(null);
  const error = ref<HTTPError<TError> | null>(null);

  const { register: after, trigger: triggerAfter } = callbackRegistry<[HTTPError<TError> | null, TResult | null]>();

  const send = (args: TArgs, reset: boolean = false) => {
    const { url, request } = factory(args);
    loading.value = true;

    if (reset) {
      error.value = null;
      result.value = null;
    }

    fetch(url, request)
      .then(async res => {
        if (!res.ok) {
          error.value = { code: res.status, error: new Error(res.statusText), data: await res.json() };
          result.value = null;
          return;
        }

        result.value = await res.json();
        error.value = null;
      })
      .catch(err => {
        error.value = { code: -1, error: err, data: null };
        result.value = null;
      })
      .finally(() => {
        loading.value = false;
        triggerAfter(error.value as any, result.value as any);
      });
  };

  if (immediateArgs) send(immediateArgs);

  return { loading, result, error, send, after };
}

export { useRequest, RequestFactory };
