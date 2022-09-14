import Koa from 'koa';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

router.get('/status', (ctx, next) => {
  ctx.response.body = { status: 'OK' };
  ctx.response.status = 200;

  next();
});

router.post('/login', (ctx, next) => {
  const { id } = <{ id: string | undefined }>ctx.request.body;
  if (!id) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'no id provided' };
    return next();
  }

  io.sockets.to(id).emit('login', { success: true });

  ctx.response.status = 200;
  ctx.response.body = { success: true };
  next();
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const httpServer = createServer(app.callback());

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

io.on('connection', (socket) => {
  socket.join(socket.id);
  io.to(socket.id).emit('id', socket.id);
});

const PORT = 3000;

httpServer.listen(PORT).on('listening', () => {
  console.log(`listening on ${PORT}`);
});
