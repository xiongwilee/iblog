# iBlog：基于Gracejs及github issues的全功能博客方案

**iBlog** 是完全基于[github API](https://developer.github.com/v3/) 并充分利用 [gracejs](https://github.com/xiongwilee/koa-grace) 数据代理特性实现的全功能博客方案。

* **项目地址：** [https://github.com/xiongwilee/iblog](https://github.com/xiongwilee/iblog)
* **体验地址：** [https://iblog.wilee.me](https://iblog.wilee.me) *(访问比较慢是因为用的最最低配的aws ECS服务)*

## 简介

github作为全球最大同性交友网站，已经有人在其上面做了很多匪夷所思的事情，利用issues功能写博客就是其中之一……

### 背景

现在已经有一些开源的基于github issues的博客系统了，例如: [cms.js](https://github.com/cdmedia/cms.js)等。但这些在客户端（浏览器）对github api调用的实现方案，有几个问题：

1. github api 在不使用token访问的情况下有根据IP每小时60个请求的限制；
2. 在浏览器端调用接口，没法实现用户登录和评论；
3. 总所周知的原因，国内访问github非常不稳定，甚至部分地区直接无法访问；

联想到Gracejs强大的数据代理的特性，**我们能不能直接在服务端调用github api，实现一套博客系统呢？** 

这样的话，我就可以把我github repo的issues作为博客的管理后台；甚至可以利用github issues comments的api及 github oauth 2.0 的api来实现评论系统，就再也不用担心类似多说停止服务的问题了！

### 特性

当然了，你看到了这篇文章，说明这个方案实现了：[iBlog：基于Gracejs及github issues的全功能博客方案](https://github.com/xiongwilee/iblog) 。其主要特性如下：

1. 基于Gracejs + github issues实现，不依赖任何数据库；
2. 具备博客、分类、评论等功能，并与github issues保持同步；
3. 服务端调用github api，不用担心github api访问不稳定的问题；
4. 仅展示repo拥有者的issues，完全不用担心issues被恶意篡改的问题；
5. 页面响应式支持，手机或其他客户端访问体验更加；


## 快速开始

iBlog源码独立托管在 [xiongwilee/iblog](https://github.com/xiongwilee/iblog) ，但为了演示简便，在[Gracejs](https://github.com/xiongwilee/koa-grace)里已经默认集成了iBlog的产出文件；所以，接下来直接利用Gracejs带你快速启动iBlog。

### 安装

> **环境依赖：**请务必确保你环境里的Nodejs版本是**7.6.0+**。

#### 第一步，下载Gracejs并安装依赖：

```
# koa-grace即Gracejs
$ git clone git@github.com:xiongwilee/koa-grace.git
$ cd koa-grace
$ npm install 
```

**FYI：**小白同学可以注意几点：
1. 如果不会用`git clone`命令，你可以直接点击[Gracejs主页](https://github.com/xiongwilee/koa-grace)的<kbd>Clone or download</kbd>按钮，然后点击<kbd>Download ZIP</kbd>；
2. 使用`cnpm`或者`yarn`安装，体验会更佳；

#### 第二步，启动服务：
```
# 请保持在koa-grace目录下执行
$ npm run dev 
```

然后，用浏览器打开 [http://0.0.0.0:3000](http://0.0.0.0:3000) ，这时候浏览器提示：`Personal Access Token Undefined!` 则表示服务正确启动，但没有配置github personal token。

#### 第三步，配置token：

**1、生成Personal Access Token：**

如果你已经有了可以使用的token，则直接跳到“2、在Gracejs中配置token”。

* 首先，登录github之后访问：[https://github.com/settings/tokens/new](https://github.com/settings/tokens/new) ；
* 然后，在“Token description”下填写`token`，“scopes”选择`repo`、`user`；
* 然后，点击“Generate token”，复制保存生成40个字节长度的token，如下：
  ![token](http://img003.qufenqi.com/products/58/30/58309c4284ca0ae73feb24a64078cd05.jpg)

**FYI：**请保存好这个token，以后不会再在这个页面上看到了。

**2、在Gracejs中配置token**

将你获取到的token复制下来之后，回到`koa-grace`的目录。粘贴到`koa-grace/config/main.development.js`下的`constant.token`里：
```
  // 通用参数，以模板参数的形式传递给模板引擎
  constant: {
    cdn: '',
    domain: {
      demo: 'http://127.0.0.1:3000'
    },
    // github personal token ，不知道这个配置，完全可以忽略它
    token: "在这里粘贴你刚刚获取到的token" 
  },
```

**FYI：**
1. 请不要把这里的token提交到github仓储，因为github有安全措施：如果你提交的代码中存在你的token，则会自动把你创建的token删掉！
2. github api v3版有个限制（参考：[https://developer.github.com/v3/#rate-limiting](https://developer.github.com/v3/#rate-limiting)）：在不配置token的情况下仅允许单个IP每小时60次请求的限制；配置token之后，单个token每小时限制5000次，对个人博客来说足够了。

#### 第四步，完成！

保存之后可以在刚刚`npm run dev`的控制台看到服务已经自动重启。这时候再访问：[http://0.0.0.0:3000](http://0.0.0.0:3000) ， 就可以看到默认页面了！

![blog](http://img003.qufenqi.com/products/29/fa/29fa026f262f51cc7c825a57b047af13.jpg)

**BTW：**如果这时候看不到这个页面，那么很有可能是你根本访问不了github，R.I.P.

## 配置

除了上述的token的配置之外，iBlog还支持其他配置；其他配置的文件在`koa-grace/app/iblog/controller/base.js`中的`config`变量。

**FYI：**以下配置请保持你的服务处于正常启动的状态。

### owner及repo配置

owner及repo配置及配置文章来源的仓储，在`koa-grace/app/iblog/controller/base.js`中的默认配置是：

```
owner: 'xiongwilee', // github用户名
repo: 'blog' 		 // 作为文章源的github仓储
```

也就是默认使用[https://github.com/xiongwilee/blog](https://github.com/xiongwilee/blog) 下的issues作为文章源。你需要配置为你自己的`github用户名`及`用以承载博客的github仓储`。

配置完保存之后，服务自动重启；这时候打开页面，看到的就是自己repo的issues 里的内容了（如果没有repo issue则提示“没有文章”）。

**FYI：**这里获取文章（即你配置的repo里的issues）的规则是：1）该issue必须是你亲自创建的；2）该issue必须是open状态

### 右边栏友情链接配置

右边栏友情链接的配置非常简单，在`base.js`中的`site.links`中，根据你的需求配置即可。

### 文章分类配置

在右边栏有一个labels，即文章分类。这里的文章分类直接读取你配置的github repo的labels配置。

以默认的配置`xiongwilee/blog`为例，你可以在这里管理Labels：[https://github.com/xiongwilee/blog/labels](https://github.com/xiongwilee/blog/labels)。

然后，你可以在github上的issues详情页配置文章的Labels（即文章分类） 参考：[https://github.com/xiongwilee/blog/issues/3]（https://github.com/xiongwilee/blog/issues/3）。

### 文章简介、主题图片配置

接下来，所有的文章就直接通过你配置的github repo的issues来管理了。这里请再次注意：**必须是你亲自创建而且是open状态的issue才会在你的blog中展示** 。

在首页的文章列表的文章有两种元素：1）文章简介；2）文章主题图片。这两种元素分别在 **issue的markdown内容的顶部**声明：

* 文章简介语法：\[intro\]: 文章简介
* 文章主题图片语法：\[image\]: 图片链接

参考：
![intro](http://img003.qufenqi.com/products/89/bd/89bd4c65a6b6cefa780224bfe26923a7.jpg)

### oauth配置

配置oauth的主要目的是为了`获取登录用户的信息`及`通过github api发表文章评论`。

其大致原理是：首先用户通过github登录，然后通过用户登录github时access\_token保存到cookie，然后就可以通过这个access\_token获取当前登录用户的信息及发表评论。

这里大致介绍怎么配置oauth。

#### 第一步，获取client\_id和client\_secret

登录github之后访问[https://github.com/settings/developers](https://github.com/settings/developers)，点击<kbd>Register a new application</kbd>。

在“Register a new OAuth application”页面中：
* “Application name”、“Homepage URL”、“Application description”根据英文提示填写即可；
* “Authorization callback URL”填写登录成功之后的回调链接。例如，iblog.wilee.me的配置是：`http://iblog.wilee.me/user/oauth?from=github`；你本地服务的配置则是：`http://0.0.0.0:3000/user/oauth?from=github`。
 
点击“Register application”创建client_id和client_secret对。

#### 第二步，配置client\_id和client\_secret

配置client\_id和client\_secret非常简单，在`base.js`中配置即可：

```
  // OAuth applications clientId & clientSecret
  client_id: '你生成的client_id',
  client_secret: '你生成的client_secret',
```

保存之后，服务自动重启；在本地服务的任意一个文章详情的底部，则可以通过“login with github”按钮登录，登录之后会会跳到文章详情页，这时候看到的就是登录状态，就可以评论了。


**BTW：**这里的评论和这篇文章对应的repo 里issues的评论是一一对应的。


## 开发

上述是所有对iBlog配置的概述，如果你仅仅想简单使用这个博客系统，看到这里就行了。但如果你想进一步开发，做更加个性化的深度订制的话，可以继续往下看。

**FYI：**以下操作请保持Gracejs服务启动（即在koa-grace目录下`npm run dev`为执行状态），并重新开一个命令行窗口操作。

### 下载iBlog源码

请再次注意，保持koa-grace为启动状态，并在`koa-grace`路径下执行：

```
# 到koa-grace的同级路径下
$ cd ../
# 下载iBlog真正的源码
$ git clone git@github.com:xiongwilee/iblog.git
$ cd iblog
$ npm install
```

### 启动文件监听

iBlog业务实现基于 `gulp`+`require.js`+`less`+`Nunjucks` ，在iblog路径下执行`npm run dev`启动开发模式下文件监听：

```
# 保持在iblog路径下
$ npm run dev
```

这时候你可以根据自己的需求订制iblog了。开发过程中，产出的文件就会通过gulp自动编译，产出到`koa-grace/app/iblog`目录中。

### 文件打包

如果开发完成，在iblog路径下执行`npm run build`即可。有兴趣的同学可以自行对比下`npm run dev`和`npm run build`产出文件的差异。

### TODO

* 基于[reveal.js](https://github.com/hakimel/reveal.js) 直接把文章生成slides；
* 更友好的labels分类页面，提示当前是在那个label下；
* 文章自动生成大纲的功能；

## 贡献

iBlog是有idea之后，清明节4月3日到5日放假三天的时间实现的，难免会有BUG；欢迎到 [https://github.com/xiongwilee/iblog](https://github.com/xiongwilee/iblog) 赏个star，或fork参与开发。
