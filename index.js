const express = require('express');
// const {google} = require('@googleapis/sheets');
const {OAuth2Client} = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

const oauth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_ID
);
// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/spreadsheets',
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});

// const getRefreshToken = async(refreshToken) => {
//     // 保存しておいたリフレッシュトークンをセット
//     oauth2Client.setCredentials({
//       refresh_token: "STORED_REFRESH_TOKEN"
//     });

//     // リフレッシュトークンを使用して新しいアクセストークンを取得
//     const newTokenInfo = await oauth2Client.refreshAccessToken();
//     const newAccessToken = newTokenInfo.credentials.access_token;

//     // 新しいアクセストークンをコンソールに出力
//     console.log('New access token:', newAccessToken);
// }

app.get('/', (req, res) => {
  const html = `
    <html>
      <body>
        <a href="${url}" target="_blank">Authorize with Google</a>
      </body>
    </html>
  `;
  res.send(html);
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  // OAuth2クライアントを使用して認証コードをトークンに交換
  const { tokens } = await oauth2Client.getToken(code);

  // tokensオブジェクトにはアクセストークンとリフレッシュトークンが含まれています
  const { access_token, refresh_token } = tokens;

  // リフレッシュトークンを保存して後で使用する
  // ここでは単純にコンソールに出力していますが、実際にはデータベースなどに保存することになるでしょう
  console.log('Refresh token:', refresh_token);
  console.log('Access token:', access_token);

  // ...
  const html = `
  <html>
    <body>
      <div>Authenticated!</div>
      <button onclick="window.location.href='/refresh?refresh_token=${refresh_token}'">Get new token</button>
    </body>
  </html>
  `;
  res.send(html);
});

app.get('/refresh', async (req, res) => {
  const { refresh_token } = req.query;
  // 保存しておいたリフレッシュトークンをセット
  oauth2Client.setCredentials({
    refresh_token: refresh_token
  });

  // リフレッシュトークンを使用して新しいアクセストークンを取得
  const newTokenInfo = await oauth2Client.refreshAccessToken();
  const newAccessToken = newTokenInfo.credentials.access_token;

  // 新しいアクセストークンをコンソールに出力
  console.log('New access token:', newAccessToken);

  // ...
  const html = `
  <html>
    <body>
      <div>Access token refreshed!</div>
    </body>
  </html>
`;
  res.send(html);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
