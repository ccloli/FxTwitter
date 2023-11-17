import { Hono } from 'hono';
import { statusRequest } from '../twitter/routes/status';
import { profileRequest } from '../twitter/routes/profile';
import { Strings } from '../../strings';
import { Constants } from '../../constants';
import { twitterStatusAPIProvider, twitterThreadAPIProvider } from '../../providers/twitter/conversation';
import { activityPubStatusAPIProvider } from '../../providers/activitypub/conversation';

export const api = new Hono();

api.use('*', async (c, next) => {
  if (!c.req.header('user-agent')) {
    c.status(401);
    return c.text('You must identify yourself with a User-Agent header in order to use the FixTweet API. We recommend using a descriptive User-Agent header to identify your app, such as "MyAwesomeBot/1.0 (+http://example.com/myawesomebot)". We don\'t track or save what kinds of data you are pulling, but you may be blocked if you send too many requests from an unidentifiable user agent.');
  }
  await next();
});
/* Current v1 API endpoints. Currently, these still go through the Twitter embed requests. API v2+ won't do this. */
api.get('/status/:id', statusRequest);
api.get('/status/:id/', statusRequest);
api.get('/status/:id/:language', statusRequest);
api.get('/status/:id/:language/', statusRequest);
api.get('/:handle/status/:id', statusRequest);
api.get('/:handle/status/:id/', statusRequest);
api.get('/:handle/status/:id/:language', statusRequest);
api.get('/:handle/status/:id/:language/', statusRequest);
api.get('/robots.txt', async c => c.text(Strings.ROBOTS_TXT_API));

api.get('/:handle', profileRequest);
api.get('/:handle/', profileRequest);

api.get('/v2_alpha/twitter/status/:id', twitterStatusAPIProvider);
api.get('/v2_alpha/twitter/thread/:id', twitterThreadAPIProvider);
api.get('/v2_alpha/activitypub/status/:id', activityPubStatusAPIProvider);

/* TODO: Figure out why / won't resolve but * does */
api.get('*', async c => c.redirect(Constants.API_DOCS_URL, 302));