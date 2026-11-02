import { createApp } from '../server.mjs';

// 独立Cookie用于真实接口的浏览器调试，避免覆盖主页面的AI会话。
const server = await createApp({ cookieName: 'modeling_live_debug_session' });
server.listen(3003, '127.0.0.1', () => console.log('独立实测页面：http://127.0.0.1:3003'));
