import { Hono } from 'hono';
import { Reminder } from '../types';

const reminders: Reminder[] = [];
const reminderRouter = new Hono();

reminderRouter.post('/', async (c) => {
  const body = await c.req.json<Reminder>();
  if (!body.id || !body.title || !body.dueDate) {
    return c.json({ error: 'Missing required fields' }, 400);
  }
  reminders.push(body);
  return c.json(body, 201);
});

reminderRouter.get('/:id', async (c) =>
{
    const id = c.req.param('id');
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) {
      return c.json({ error: 'Reminder not found' }, 404);
    }
    return c.json(reminder, 200);
})

reminderRouter.get('/', (c) => {
  if (reminders.length === 0) {
    return c.json({ error: 'No reminders found' }, 404);
  }
  return c.json(reminders, 200);
});

reminderRouter.patch('/:id', async (c) =>{
    const id = c.req.param('id');
    const body = await c.req.json<Reminder>();

    const index = reminders.findIndex((r) => r.id === id);
    if (index === -1) {
      return c.json({ error: 'Reminder not found' }, 404);
    }
    reminders[index] = { ...reminders[index], ...body };
    return c.json({ message: 'Reminder updated', reminder: reminders[index] }, 200);
});

reminderRouter.delete('/:id', async (c) => {
  const body = await c.req.json<Reminder>();
  const id = c.req.param('id');
  const index = reminders.findIndex((r) => r.id === id);
  if (index === -1) {
    return c.json({ error: 'Reminder not found' }, 404);
  }
  reminders.splice(index, 1);
  return c.json({ message: 'Reminder deleted' }, 200);
});

reminderRouter.post('/:id/mark-completed', async (c) => {
    const id = c.req.param('id');
    const index = reminders.findIndex((r) => r.id === id);
    if (index === -1) {
      return c.json({ error: 'Reminder not found' }, 404);
    }
    reminders[index].isCompleted = true;
    return c.json({ message: 'Reminder marked as completed', reminder: reminders[index] }, 200);
});

reminderRouter.post('/:id/unmark-completed', async(c) => {
    const id = c.req.param('id');
    const index = reminders.findIndex((r) => r.id === id);
    if (index === -1) {
      return c.json({ error: 'Reminder not found' }, 404);
    }
    reminders[index].isCompleted = false;
    return c.json({ message: 'Reminder unmarked as completed', reminder: reminders[index] }, 200);
})

reminderRouter.get('/completed',async (c) =>
{
    const completedReminders = reminders.filter((r) => r.isCompleted);
    if (completedReminders.length === 0) {
      return c.json({ error: 'No completed reminders found' }, 404);
    }
    return c.json(completedReminders, 200);
})

reminderRouter.get('/not-completed', async (c) =>
{
    const notCompletedReminders = reminders.filter((r) => !r.isCompleted);
    if (notCompletedReminders.length === 0) {
      return c.json({ error: 'No not completed reminders found' }, 404);
    }
    return c.json(notCompletedReminders, 200);

})

reminderRouter.get('/due-today', async(c) =>
{
    const dueToday = reminders.filter((r) => new Date(r.dueDate).toDateString() === new Date().toDateString());
    if (dueToday.length === 0) {
      return c.json({ error: 'No reminders due today' }, 404);
    }
    return c.json(dueToday, 200);
})

export default reminderRouter;
