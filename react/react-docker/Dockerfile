# 参考URL https://qiita.com/tanaka-tt/items/49628cd423e490120eeb
# ベースイメージの作成 ローカルのバージョンと揃えよう
FROM node:12.16.1
# コンテナ内で作業するディレクトリを指定
WORKDIR /usr/src/app
# package.jsonとyarn.lockを/usr/src/appにコピー
COPY ["package.json", "yarn.lock", "./"]
# パッケージをインストール
RUN yarn install && npm install axios \
    # URLのRouteを作成するため
    && npm install react-router-dom \
    # bootstrapを有効化するため
    && npm install react-bootstrap@next bootstrap@5.0.2 \
    # Sliceを使用するため
    && npm install --save @reduxjs/toolkit react-redux \
    # validationを行うため
    && npm install react-hook-form \
    # iconをページ内で使用するため https://react-icons.github.io/react-icons/
    && npm install react-icons --save \
    # ページの大きさに応じた表示をするために使用 https://material-ui.com/ja/components/use-media-query/
    && npm install @material-ui/core

# ファイルを全部作業用ディレクトリにコピー
COPY . .
# コンテナを起動する際に実行されるコマンド
ENTRYPOINT [ "yarn", "start" ]
