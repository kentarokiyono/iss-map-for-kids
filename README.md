# geolonia/pwa

geolonia/pwa は簡単に PWA の地図アプリが開発できるテンプレートです。

## デモ


## 開発

```shell
$ git clone https://github.com/geoloniamaps/pwa.git
$ cd app
$ npm install
$ npm start
```

## カスタマイズ方法

[config.yml](./config.yml) の値を変更する事で、簡単にタイトルや背景画像、メニューを変更することができます。


## データの変更

`public` ディレクトリ内の [data.csv](./public/data.csv) を更新することで、表示されているデータを変更する事ができます。


### Google スプレッドシートで CSV を編集する

1. [こちらのサンプルデータ](https://docs.google.com/spreadsheets/d/125tgFwGwkdEX5rapUMQuzVQ0BPshHkU0K_snFagOzwk/edit#gid=0) をコピーして、ご自身のデータを入力してください。
2. 入力したデータを CSV でエクスポートして、`public/data.csv` として配置してコミットしてください。

緯度経度の取得には、[Community Geocoder](https://community-geocoder.geolonia.com/#12/35.68124/139.76713) をご利用することをご推奨します。

### CSV の各列の解説

|列名|必須|デフォルト|内容|
|-|-|-|-|
|`title`|○||ここに入力された文字列は、マーカーの下にタイトルとして表示されます。|
|`lat`|○||緯度を指定してください。 (例: `35.6321`)|
|`lng`|○||経度を指定してください。 (例: `139.8808`)|
|`description`|||マーカーをクリックした際に、表示させるコンテンツです。|
|`marker-size`||`medium`|`medium`、`large`、`small` のいずれかを指定してください。|
|`marker-color`||`rgba(255, 0, 0, 0.4)`|マーカーの色を指定してください。|
|`stroke`||`#FFFFFF`|マーカーの輪郭線の色を RGB で指定してください。|
|`stroke-width`||`2`|境界線の太さ（ピクセル）を数字で指定してください。|

### 備考

* `marker-color` は、`#FF0000` または `rgba(255,0,0)` のように指定することが可能です。
* 列の順番に制約はありません。
* `description` では、HTML も利用可能です。
* 上記にない列は、`properties` に保存されますが、これらの値を利用するには JavaScript によるプログラミングが必要です。
* データの仕様については、Geolonia Maps の[ドキュメンテーション](https://docs.geolonia.com/geojson/)もご参照ください。
