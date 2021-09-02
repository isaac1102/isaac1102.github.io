---
layout: post
title:  "MySQL Replication으로 부하 분산하기(작성중)"
date:   2021-06-08 23:31:01
categories: SMARTSTORE
tags: SMARTSTORE
comments: 1
---


 [스마트 스토어 프로젝트](https://github.com/f-lab-edu/smart-store) 를 진행하면서 가장 많이 고민했던 부분은 __'어떻게 하면 대용량 트래픽 환경에서도 어플리케이션의 성능과 안정성을 유지할 수 있을까?'__ 였습니다. 서버성능을 안정적으로 유지하기 위해서는 서버에 가해지는 부하를 잘 관리해야 합니다. 부하관리가 제대로 되지 않는다면 사용자 요청에 대한 응답처리가 매우 지연될 것이고, 좋지 않은 서버성능은 사용자 경험에 악영향을 줄 것입니다. 사용자 감소는 곧 서비스 기업에게 비즈니스적으로 손해를 가져다 주겠죠. 😮
<br><br> 
서버성능을 높이기 위한 방법으로 서버의 확장, 즉 __`Scale-up`__ 이나 __`Scale-Out`__ 을 통한 [서버의 처리용량을 확장하는 방법](https://isaac1102.github.io/2001/04/15/server-scaling)이 있었습니다. 
이번 글에서는 **DataBase서버**에 가해지는 부하를 다루는 방법의 일환으로 __`MySQL Replication`__ 을 사용하는 방법에 대해서 알아보겠습니다. 
<br><br> 

**DB서버(MySQL)를 복제(replication)하는 이유** <br> 
서버에 병목을 주는 큰 요인 중의 하나가 DB서버의 응답지연입니다. 수많은 요청이 동시적으로 몰리게 되면, 빠른 시간 안에 응답처리를 해야 하지만 그렇지 못할 경우 병목구간이 생기게 됩니다. 병목의 원인은 여러가지가 있을 것입니다. 처리해야 할 데이터 양이 너무 많거나, 너무 많은 요청이 지연되어서 먼저 온 요청이 끝나기까지 기다려야하는 상황 등이 있을 수 있겠습니다. 이것이 반복되고 누적된다면 병목이 생기고 서버성능저하로 이어지게 될 것입니다. 
<br> 
DB서버를 복제하고 이중화한다는 것은 DB서버로 들어오는 요청을 분산하고 main DB서버와 sub DB서버의 기능을 분리하는 것을 말합니다. 
<br> 
서버를 이중화한다면 한 서버가 장애가 생기거나 데이터가 손상되는 상황이 오더라도, 다른 서버에 이미 데이터가 동기화 돼 있기 때문에 데이터가 안전한게 보존될 수 있고, `fail-over`를 통해 웹 어플리케이션의 고가용성을 확보할 수 있을 것입니다. 
<br> <br> 
이제 본격적으로 MySQL Replication에 대해서 알아보도록 하겠습니다. 

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
