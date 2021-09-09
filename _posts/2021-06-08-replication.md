---
layout: post
title:  "MySQL Replication으로 부하 분산하기(작성중)"
date:   2021-06-08 23:31:01
categories: SMARTSTORE
tags: SMARTSTORE
comments: 1
---
 
이번 글에서는 스마트스토어 프로젝트 중에 MySQL Replication을 적용한 경험에 대해서 적어보고자 합니다. 

##### Replication?
데이터베이스를 복제하는 것입니다. 다만 단순히 데이터를 복제하는 것이 아니라, 데이터 복제와 더불어 데이터베이스 서버로서의 기능도 함께 수행하도록 한든 것입니다. 데이터를 어떻게 복제하고, 어떤 기능을 수행하도록 하는지 이제 본격적으로 알아보도록 하겠습니다. 

##### MySQL Replication의 이점
1. 데이터베이스 서버의 부하 분산 : 데이터베이스 서버를 Master/Slave로 나누어 Master DB는 데이터 등록/수정/삭제 요청을 받고, Slave DB에는 읽기 요청을 수행함으로 단일 DB서버에 비해서 사용자 요청이 분산시킬 수 있습니다. 
2. 데이터 백업 : 데이터를 Master -> Slave로 복사하기 때문에 한 곳에서 데이터가 손실되더라도 복구할 수 있습니다. 
3. `Fail-over`  : 만약 데이터베이스 서버가 한 대이고 장애가 발생한다면, 장애가 해결될 때까지 서비스가 중단될 것입니다. 하지만 Replication을 통해서 복수의 데이터베이스 서버를 사용한다면 `Fail-over`를 통해서 유연하게 장애에 대처할 수 있습니다.
<br> <br> 

##### MySQL Replication의 원리 
MySQL Replication을 위해서는 Master와 Slave간의 데이터 전송이 이뤄지는데, MySQL은 비동기 복제방식으로 이것을 수행합니다. 
Master노드에서는 변경 데이터 이력을 Binary Log에 기록하고 Master Thread가 이것을 읽어서 Slave로 전송한다. Slave에서는 전송된 데이터를 수신하여 Relay_log에 기록하고 해당 데이터를 Slave에 적용합니다. 

MySQL 에서 Replication 을 위해 필요한 요소 다음과 같습니다.

- Master 에서의 변경을 기록하기 위한 Binary Log
- Binary Log 를 읽어서 Slave 쪽으로 데이터를 전송하기 위한 Master Thread
- Slave 에서 데이터를 수신하여 Relay Log 에 기록하기 위한 I/O Thread
- Relay Log 를 읽어서 해당 데이터를 Slave 에 Apply(적용)하기 위한 SQL Thread
<br><br> 
<p  align="center">
<img src="https://user-images.githubusercontent.com/37571052/132654929-18254ad7-c941-415f-8908-2a64aad4408a.png" style="width:70%; height:auto;"> 
 </p>
<br><br> 

1. 클라이언트(Application)에서 Commit 을 수행한다.
2. Connection Thead 는 스토리지 엔진에게 해당 트랜잭션에 대한 Prepare(Commit 준비)를 수행한다.
3. Commit 을 수행하기 전에 먼저 Binary Log 에 변경사항을 기록한다.
4. 스토리지 엔진에게 트랜잭션 Commit 을 수행한다.
5. Master Thread가 비동기적으로 Binary Log를 읽는다.
6. Master Thread가 Slave 로 전송한다.
7. Slave 의 I/O Thread 는 Master 로부터 수신한 변경 데이터를 Relay Log 에 기록한다. (기록하는 방식은 Master 의 Binary Log 와 동일하다)
8. Slave 의 SQL Thread 는 Relay Log 에 기록된 변경 데이터를 읽어는다.
9. Slave 의 SQL Thread 는 읽어들인 변경사항을 스토리지 엔진에 적용한다. 



Master Thread
MySQL Replication 에서는 Slave Thread 가 Client 이고 Master Thread 가 Server 이다. 즉, Slave Thread 가 Master Thread 쪽으로 접속을 요청하기 때문에 Master 에는 Slaver Thread 가 로그인할 수 있는 계정과 권한(REPLICATION_SLAVE)이 필요하다.

Master 쪽으로 동시에 다수의 Slave Thread 가 접속할 수 있으므로 Slave Thread 당 하나의 Master Thread 가 대응되어 생성된다. Master Thread 는 한가지 역할만을 수행하는데, 이는 Binary Log 를 읽어서 Slave 로 전송하는 것이다. 이 때문에 Binlog Sender 또는 Binlog Dump 라고도 불린다.

Master 입장에서 Slave 의 접속은 여느 Client 의 접속과 다를 바가 없다. 따라서, 해당 접속이 Replication Slave Thread 로부터의 접속인지 일반 Application 의 접속인지 구분할 수 있는 방법이 없다. 로그인 과정도 일반 Client 와 동일하게 처리되기 때문이다.
Master 가 특정 접속을 Slave Thread 로 인식하여 Binary Log 를 전송하려면, Slave 로부터의 특정 명령 Protocol 을 통해 '난 다른 Client 랑 다르게 Replication Slave 야' 와 같이 알려주어야 한다. Slave Thread 는 Master 에 접속 후 Binary Log 의 송신을 요청하는 명령어(Protocol)를 전송하는데 이는 COM_BINLOG_DUMP 와 COM_BINLOG_DUMP_GTID 이다. 전자는 Binary Log 파일명과 포지션에 의해, 후자는 GTID 에 의해 Binary Log 의 포지션을 결정한다. (GTID 는 MySQL 5.6 에 추가된 기능)
Slave 는 위의 Protocol 을 통한(실제 SQL 은 아님) 소통 이후에 COM_QUERY 라는 Protocol 을 통해 실제 데이터(SQL) 송신을 요청하게 된다.

Slave I/O Thread
Slave I/O Thread 는 Master 로부터 연속적으로 수신한 데이터를 Relay Log 라는 로그 파일에 순차적으로 기록한다. Relay Log 파일의 Format 은 Master 측의 Binary Log Format 과 정확하게 일치한다. 인덱스 파일도 똑같이 존재하고 파일 명에 6 자리 숫자가 붙는 것도 동일하다.
Relay Log 는 Replication 을 시작하면 자동으로 생성된다. Relay Log 의 내용을 확인하기 위해서는 SHOW RELAYLOG EVENTS 명령어를 사용한다.
Relay Log 파일의 이름은 기본적으로 '호스트명-relay-bin' 이며, 이는 호스트 이름이 변경될 경우 오류가 발생할 수 있으므로 relay_log 옵션을 이용하여 사용자가 의도한대로 정하는 편이 좋다.

Slave SQL Thead
Slave SQL Thread 는 Relay Log 에 기록된 변경 데이터 내용을 읽어서 스토리지 엔진을 통해 Slave 측에 Replay(재생)하는 Thread 이다. 아무래도 Relay Log 를 기록하는 I/O Thread 보다는 실제 DB 의 내용을 변경하는 SQL Thread 가 처리량과 연산이 많게 마련이다.
이는 SQL Thread 가 Replication 처리의 병목 지점이 될 수 있다는 것을 의미한다.
Master 측에서는 많은 수의 Thread 가 변경을 발생시키고 있는데 반해, Slave 에서는 하나의 SQL Thread 가 DB 반영 작업을 수행한다면 병목이 되는 것은 당연하다. 이의 해결을 위해 등장한 것이 MySQL 5.7 에서 대폭 개선된 MTS(Multi Thread Slave)이다. 이는 Slave 에서의 SQL Thread 가 병렬로 데이터베이스 갱신을 수행할 수 있도록 개선된 기능이다. (해당 기능에 대한 자세한 내용은 향후 별도 주제로 다루도록 하겠다.)









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
>- [http://cloudrain21.com/mysql-replication](http://cloudrain21.com/mysql-replication)
>- [https://gangnam-americano.tistory.com/12](https://gangnam-americano.tistory.com/12)
>- [http://cloudrain21.com/mysql-replication](http://cloudrain21.com/mysql-replication)
>- [https://server-talk.tistory.com/240](https://server-talk.tistory.com/240)
>- [Real MySQL](http://www.yes24.com/Product/Goods/6960931)
