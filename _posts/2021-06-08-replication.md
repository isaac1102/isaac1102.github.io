---
layout: post
title:  "MySQL Replication으로 부하 분산하기(작성중)"
date:   2021-06-08 23:31:01
categories: SMARTSTORE
tags: SMARTSTORE
comments: 1
---
 
안녕하세요. 이번 글에서는 스마트스토어 프로젝트 중에 MySQL Replication을 적용한 경험에 대해서 적어보고자 합니다. 

##### Replication?
Replication한다는 것이 정확히 어떤 의미일까요. 쉽게 말하면 MySQL을 복제하는 것입니다. 다만 단순히 데이터를 복제하는 것이 아니라, 데이터 복제와 더불어 데이터베이스 서버로서의 기능도 함께 수행하도록 한든 것입니다. 데이터를 어떻게 복제하고, 어떤 기능을 수행하도록 하는지 이제 본격적으로 알아보도록 하겠습니다. 

##### DB서버(MySQL)를 복제(replication)하는 이유
**1. 데이터베이스 서버의 부하 분산**
MySQL 서버를 복제하는 이유 중의 가장 큰 것은 서버의 부하를 분산하기 위함입니다. 서버의 부하는 사용자의 증가와 이용률 증가에 따라서 발생할 확률이 높습니다. 또한 저장된 데이터가 너무 많다면 데이터 조회 등의 소요시간이 더 많이 걸릴 수도 있겠죠. 이런 요인들이 서버의 부하를 유발하기 때문에 이 부하를 분산하고자 Replication을 하는 것입니다. 
<br> <br> 
**2. 데이터 백업**
서버의 데이터를 한 서버에 저장하는 것은 위험요소가 많습니다. 우리가 중요한 데이터는 다른 곳에 백업하듯이 replication을 통해서도 같은 역할을 할 수 있습니다. 

**3. `Fail-over`**
만약 데이터베이스 서버가 한 대이고 장애가 발생한다면, 서비스는 장애가 해결될 때까지 중단될 수밖에 없을 것이다. 하지만 Replication을 통해서 복수의 데이터베이스 서버를 사용한다면 `Fail-over`를 통해서 장애에 더욱 더 유연하게 대처할 수 있을 것이다. 
<br> <br> 



이제 본격적으로 MySQL Replication에 대해서 알아보도록 하겠습니다. 
DB서버를 복제하고 이중화한다는 것은 DB서버로 들어오는 요청을 분산하고 main DB서버와 sub DB서버의 기능을 분리하는 것을 말합니다. 
이 프로젝트에서 사용한 DB는 `MySQL`이므로 `MySQL`을 기준으로 알아보았습니다. <br> 
<br> 
 ### 1. MySQL 서비스 준비
`MySQL`을 이중화하기 위해서는 기본적으로 2개 이상의 MySQL서비스가 실행되어야 합니다. 
이 부분에 대한 내용은 아래의 블로그 글에 아주 잘 설명되어 있습니다. 😀<br>
- [다수의 MySQL 서버실행을 위한 환경설정](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=amcc&logNo=221340672465)  <br>
- [MySQL 서비스 실행이 잘 안될때](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=amcc&logNo=221340672465)  <br> 

‼‼본래는 위의 방법대로 동일한 MySQL설치파일을 가지고 my.ini파일의 설정을 바꿔서 진행하려고 했습니다. <br> 
그러나 진행과정에서 MySQL8.XX부터는 connection과정에서 encrypt plugin 옵션으로 기본으로 caching_sha2_password을 사용함을 알게 됐는데, <br> 
마스터와 슬레이브 간의 통신에서 이 방식을 사용하게 됩니다. 이 의미는 결국 서비스 별로 인증서에 관련된 파일을 가지고 있어야 한다는 말입니다.(ca.pem, server-cert.pem, server-key.pem)
그러나 위의 과정대로 진행하게 된다면, 모두 복사된 동일한 파일들을 가지고 실행하게 되므로, 연결 과정에서 인증에 실패하게 됩니다.
다른 방식이 있을 수도 있었겠지만, 그것들을 알아볼 것과의 trade-off를 고려하여 저는 그냥 MySQL을 하나 더 설치하여 서비스를 추가하기로 했습니다. 


<p style="align:center;">
    <img src="https://user-images.githubusercontent.com/37571052/121644408-ec824980-cacd-11eb-8e0a-fe5f7a88a76b.png"><br> 
 </p>
 <div style="text-align: center;">위의 과정들을 통해서 아래 사진처럼 포트가 다른 서비스를 두개 실행했습니다.</div>
 
<br> 

### 2. MySQL 설정
저의 경우 window10 환경에서 설정을 진행했으므로, window기준으로 설명하겠습니다. 

__고유한 server-id 설정__    <br> 
서비스를 띄우는 것에 성공했다면, 이제 source가 되는 서비스와 replica의 server-id를 고유하게 설정해야 합니다. 
서로 다른 **server-id**를 가지도록 **my.ini**파일을 수정합니다. (linux의 경우 my.cnf가 설정파일입니다.)<br> 
만약 다수의 replica를 가지더라도 모두 고유한 server-id를 가져야 합니다. <br> 
Master <br> 
> [mysqld]<br> 
> server-id=1   

Slave  <br> 
> [mysqld]<br> 
> server-id=2

__replication을 위한 user를 생성__ <br> 
각 replica는 각 사용자 이름과 비밀번호를 가지고 source에 연결하기 때문에, source에서는 replica가 source에 연결하기 위한 계정을 생성해야 합니다. <br> 
>mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';<br> 

계정생성과 함께 생성된 계정에 replication을 위한 권한을 부여합니다. 
>mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';

__Replication Encrypted Connection 설정__<br> 


## 2. Spring 설정
>__참고자료__    
>- [https://gangnam-americano.tistory.com/12](https://gangnam-americano.tistory.com/12)
>- [http://cloudrain21.com/mysql-replication](http://cloudrain21.com/mysql-replication)
>- [https://server-talk.tistory.com/240](https://server-talk.tistory.com/240)
>- [Real MySQL](http://www.yes24.com/Product/Goods/6960931)
