import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import mailQueue from '../queues/mailQueue.js';

const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath('/ui');

createBullBoard({
  queues: [new BullMQAdapter(mailQueue)],
  serverAdapter: bullServerAdapter
});

export default bullServerAdapter;
