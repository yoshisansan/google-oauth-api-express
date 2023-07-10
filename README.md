# google-oauth-api-express
クライアント側でOAuth認証するための最低限の実装。アクセストークンの取得からリフレッシュトークン取得まで。
googleapisだと126MBほどあり重いためgoogle-auth-libraryでOAuth認証している。

## 準備 Google Cloud Consoleでの設定
URL: https://console.cloud.google.com/apis/credentials

### APIキーの作成
認証情報 > 認証情報を作成 > APIキー より作成

セキュリティ上、アプリケーションの制限の設定にて"ウェブサイト"でCORS設定している方がベター
また、APIの制限にて"キーを制限"し目的のAPIを選択すると尚良い


### OAuth2.0 クライアントIDの作成
認証情報 > 認証情報を作成 > OAuth クライアントID より作成

「承認済みの JavaScript 生成元」にはOAuthをリクエストするクライアント側のpathを指定
例：http://localhost:3000

「承認済みのリダイレクト URI」にはリダイレクト先を指定。リダイレクト先でアクセストークン及びフレッシュトークンを取得できる
例：http://localhost:3000/oauth2callback

### OAuth同意画面の設定
OAuth 同意画面 > アプリを編集 にて各環境に応じて必要であれば設定する

## ENV設定
.env.sampleを参照

## その他
Honoで実装予定のキャッチアップとして作成しました。
