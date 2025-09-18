export type FetchJSONOptions = RequestInit & {
    timeoutMs?: number; //default:10000
    retries?: number; //default 3
}

export async function fetchJSON<T = any>(input : RequestInfo | URL, init: FetchJSONOptions = {}): Promise<T> {
    const timeoutMs = init.timeoutMs ?? 10000;
    const maxRetries = init.retries ?? 3;
    const headers = {'Content-Type':'application/json', ...(init.headers as Record<string, string> | undefined)};

    const baseDelay = 500;

    let attempt = 0;

    while(attempt <= maxRetries){
            // create a fresh AbortController for each attempt so timeout can be re-scheduled
        const controller = new AbortController();

        // if caller passed a signal (e.g. react-query), wire it up so external aborts cancel this controller
        if(init.signal){
            if((init.signal as AbortSignal).aborted) controller.abort();
            else(init.signal as AbortSignal).addEventListener('abort', () => controller.abort(), { once: true });
        }

        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const res = await fetch(input,{...init, headers, signal: controller.signal});
            clearTimeout(timer);

            if(res.ok){
                const json = await res.json();
                return json as T;
            }

            if(res.status >= 400 && res.status <= 500){
                const text = await res.text();
                const err: any = new Error(`Request failed ${res.status}: ${text}`);
                err.status = res.status;
                throw err;
            }

            const text = await res.text();
            throw new Error(`Server Error ${res.status}: ${text}`);
        } catch (err:any) {
            clearTimeout(timer);

            if(init.signal && (init.signal as AbortSignal).aborted) throw err;

            attempt+=1;
            const willRetry = attempt <= maxRetries;

            if(!willRetry) throw err;

            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error('fetchJSON: exhausted retries');
}