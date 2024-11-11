import { WorkerMessageTypes, type WorkerMessage } from '../types';
import { initDb } from './initDb';

console.log('worker loaded');

(async function () {
    addEventListener('message', async function ({ data }: { data: WorkerMessage }) {
        console.log('worker received message:', data.type);

        switch (data.type) {
            case WorkerMessageTypes.INIT_DB:
                await import('../jswasm/sqlite3.mjs');

                const initRes = await initDb();
                console.log('worker initDb result:', initRes);
                const res = { type: WorkerMessageTypes.INIT_DB_RESPONSE };
                console.log('worker sending message back to main:', res);
                this.postMessage(res);
                break;

            default:
                throw new Error(`Unknown message type: ${data.type}`);
        }
    });
})();
