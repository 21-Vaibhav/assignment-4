import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import reminderRouter from './routes/reminders';

const app = new Hono();

app.route('/reminders', reminderRouter);

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log('Server running at http://localhost:3000');
