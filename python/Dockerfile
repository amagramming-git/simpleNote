FROM python:3
ENV PYTHONUNBUFFERED 1
# Pythonがpyc filesとdiscへ書き込むことを防ぐ
ENV PYTHONDONTWRITEBYTECODE 1
RUN mkdir /code
WORKDIR /code

# requirements.txtでインストールする方法トPipfileでインストールする方法の二通りがある。
# ADD requirements.txt /code/
# RUN pip install --upgrade pip && pip install -r requirements.txt

# Pipenvをインストール
RUN pip install --upgrade pip && pip install pipenv
# ホストのpipfileをコンテナの作業ディレクトリにコピー
COPY ./python-project/Pipfile /code/Pipfile
# pipfileからパッケージをインストールしてDjango環境を構築
RUN pipenv install --skip-lock --system --dev
ADD ./python-project /code/