import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { renderToReadableStream } from 'react-dom/server.browser';
import { renderHeadToString } from 'remix-island';
import { Head } from './root';
import { themeStore } from '~/lib/stores/theme';
import { initializeModelList } from '~/utils/constants';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  try {
    await initializeModelList({});

    const readable = await renderToReadableStream(<RemixServer context={remixContext} url={request.url} />, {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    });

    const body = new ReadableStream({
      start(controller) {
        const head = renderHeadToString({ request, remixContext, Head });

        // Write the opening HTML
        controller.enqueue(
          new TextEncoder().encode(
            `<!DOCTYPE html><html lang="en" data-theme="${themeStore.value}"><head>${head}</head><body><div id="root" class="w-full h-full">`,
          ),
        );

        const reader = readable.getReader();

        function read() {
          reader
            .read()
            .then(({ done, value }: { done: any; value: any }) => {
              if (done) {
                // Write the closing HTML and close the controller
                controller.enqueue(new TextEncoder().encode('</div></body></html>'));
                controller.close();

                return;
              }

              controller.enqueue(value);
              read();
            })
            .catch((error: any) => {
              console.error('Error reading from stream:', error);
              controller.error(error);
            });
        }

        read();
      },

      cancel(reason) {
        console.warn('Stream cancelled:', reason);
        readable.cancel();
      },
    });

    if (isbot(request.headers.get('user-agent') || '')) {
      await readable.allReady; // Wait for stream readiness for bots
    }

    responseHeaders.set('Content-Type', 'text/html');
    responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
    responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

    return new Response(body, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } catch (error) {
    console.error('Error in handleRequest:', error);

    return new Response('<h1>Internal Server Error</h1>', {
      headers: { 'Content-Type': 'text/html' },
      status: 500,
    });
  }
}
