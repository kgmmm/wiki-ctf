import { handler } from './build/handler.js';
import express from 'express';

const app = express();

app.use(handler); // let SvelteKit handle everything else, including serving prerendered pages and static assets

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening');
});