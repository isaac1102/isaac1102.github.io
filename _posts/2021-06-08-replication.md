---
layout: post
title:  "MySQL Replication으로 부하 분산하기(작성중)"
date:   2021-06-08 23:31:01
categories: SMARTSTORE
tags: SMARTSTORE
comments: 1
---
 
이번 글에서는 스마트스토어 프로젝트 중에 MySQL Replication을 적용한 경험에 대해서 적어보고자 합니다.

##### **Replication?**

데이터베이스를 복제하는 것입니다.데이터 복제와 더불어 데이터베이스 서버로서의 기능도 분담하여 수행하도록 한든 것입니다. 이것을 사용하기 위한 최소 구성은 Master / Slave 구성을 하여야 됩니다.

#### **Master DB**

-   웹서버로 부터 데이터 등록/수정/삭제 요청시 바이너리로그(Binarylog)를 생성하여 Slave 서버로 전달하게 됩니다
-   웹서버로 부터 요청한 데이터 등록/수정/삭제 기능을 하는 DBMS로 많이 사용됩니다

#### **Slave DB**

-   Master DBMS로 부터 전달받은 바이너리로그(Binarylog)를 데이터로 반영하게 됩니다.
-   웹서버로 부터 요청을 통해 데이터를 불러오는 DBMS로 많이 사용됩니다.

#### **MySQL Replication의 이점**

1.  데이터베이스 서버의 부하 분산 : 데이터베이스 서버를 Master/Slave로 나누어 Master DB는 데이터 등록/수정/삭제 요청을 받고, Slave DB에는 읽기 요청을 수행함으로 단일 DB서버에 비해서 사용자 요청이 분산시킬 수 있습니다.
2.  데이터 백업 : 데이터를 Master -> Slave로 복사하기 때문에 한 곳에서 데이터가 손실되더라도 복구할 수 있습니다.
3.  `Fail-over` : 만약 데이터베이스 서버가 한 대이고 장애가 발생한다면, 장애가 해결될 때까지 서비스가 중단될 것입니다. 하지만 Replication을 통해서 복수의 데이터베이스 서버를 사용한다면 `Fail-over`를 통해서 유연하게 장애에 대처할 수 있습니다.

#### **MySQL Replication의 내부 동작절차**

MySQL Replication을 위해서는 Master와 Slave간의 데이터 전송이 이뤄지는데, MySQL은 비동기 복제방식으로 이것을 수행합니다.  
Master노드에서는 변경 데이터 이력을 Binary Log에 기록하고 Master Thread가 이것을 읽어서 Slave로 전송한다. Slave에서는 전송된 데이터를 수신하여 Relay\_log에 기록하고 해당 데이터를 Slave에 적용합니다.

MySQL 에서 Replication 을 위해 필요한 요소 다음과 같습니다.

-   Master 에서의 변경을 기록하기 위한 Binary Log
-   Binary Log 를 읽어서 Slave 쪽으로 데이터를 전송하기 위한 Master Thread
-   Slave 에서 데이터를 수신하여 Relay Log 에 기록하기 위한 I/O Thread
-   Relay Log 를 읽어서 해당 데이터를 Slave 에 Apply(적용)하기 위한 SQL Thread
<p align="center">
 <img src="https://user-images.githubusercontent.com/37571052/133197537-4d116420-18c1-4c2a-be13-0e0465e2c53f.png" style="width=70%;"> 
</p> 
1.  클라이언트(Application)에서 Commit 을 수행합니다.
2.  Connection Thead 는 스토리지 엔진에게 해당 트랜잭션에 대한 Prepare(Commit 준비)를 수행합니다.
3.  Commit 을 수행하기 전에 먼저 Binary Log 에 변경사항을 기록합니다.
4.  스토리지 엔진에게 트랜잭션 Commit 을 수행합니다.
5.  Master Thread가 비동기적으로 Binary Log를 읽습니다.
6.  Master Thread가 Slave 로 전송합니다.
7.  Slave 의 I/O Thread 는 Master 로부터 수신한 변경 데이터를 Relay Log 에 기록한다. (기록하는 방식은 Master 의 Binary Log 와 동일합니다)
8.  Slave 의 SQL Thread 는 Relay Log 에 기록된 변경 데이터를 읽습니다.
9.  Slave 의 SQL Thread 는 읽어들인 변경사항을 스토리지 엔진에 적용합니다.

#### **부하 분산**
<p align="center">
 <img src="https://user-images.githubusercontent.com/37571052/133197655-4de52d5a-f425-4f10-b2dc-9739125a321a.png" style="width=70%;"> 
</p> 
<br> <br>   
위의 그럼처럼 MySQL Replication을 통해서 부하 분산이 이루어 집니다.  
**Insert/Update/Delete**와 같은 데이터를 변경하는 요청은 **Master DB**로 가게 되고, **Select** 요청은 **Slave DB**로 가게 됩니다.

### **MySQL Replication 적용해보기**

#### **Master DB 설정**

**1\. Replication user 생성** 

 Slave가 Master에게 정보를 가져오기 위해 Master에 접근하려면 전용 계정이 필요합니다. 

> CREATE USER ‘repl\_user’@’%.example.com’ IDENTIFIED BY ‘password’;

**2\. Replication user 권한 부여**

 MySQL에서는 replication을 위한 권한이 있습니다. 필요한 권한만 추가하겠습니다.

> GRANT REPLICATION SLAVE ON \*.\* TO 'repl\_user'@'%' IDENTIFIED BY ' password';

**3\. my.cnf 설정**

server-id는 1부터 2^32까지 아무 숫자나 가능합니다. 다만 slave와는 다른 숫자여야 합니다.

log-bin은 binary-log 파일이 저장될 이름을 지정하는 설정입니다. 

(참고로 my.cnf파일은 /etc/mysql/my.cnf 경로에 있습니다.)s

> \[mysqld\]  
> server-id=1  
> log-bin=mysql-bin

**4\. service restart**

>  service mysql restart

**5\. 설정 확인**
<p align="center">
<img src="https://user-images.githubusercontent.com/37571052/133197725-992f283f-4aff-4194-9bd5-c1e5932142fd.png" style="width=70%;">
</p> 
**File명 (mysql-bin.000030)과 Position(154) 정보**는 Slave 설정에 필요한 정보이기 때문에 설정 전까지 기록하거나 기억해둬야 합니다.

#### **Slave DB 설정**

**1\. my.cnf 설정** 

server-id는 master DB와 다른 값으로 해야 한다.

replicate-do-db는 복제하고자 하는 데이터베이스를 의미하며 2개 이상의 데이터베이스를 할 경우 replicate-do-db를 추가하면 됩니다.

> \[mysqld\]  
> server-id=2  
> replicate-do-db='master-db'

**2\. Change master to**

> CHANGE MASTER TO  
> MASTER\_HOST='Master의 host',  
> MASTER\_USER='master에서 생성한 replication 계정',  
> MASTER\_PASSWORD='replication 계정 비밀번호',  
> MASTER\_LOG\_FILE='mysql-bin.000030', -- 앞서 말한 Master의 binary-log 파일명  
> MASTER\_LOG\_POS=154  -- slave가 추적할 데이터의 시작점

**4\. service restart**

>  service mysql restart

**5\. 설정 확인**

다음 명령어를 통해 설정이 제대로 돼 있는지 확인할 수 있습니다.

> status slave status\\G
<p align="center">
 <img src="https://user-images.githubusercontent.com/37571052/133197762-cc808f67-4a98-427b-b649-c67d335df29c.png" style="width=70%;">
</p> 

> [https://gangnam-americano.tistory.com/12](https://gangnam-americano.tistory.com/12)  
> [https://server-talk.tistory.com/240](https://server-talk.tistory.com/240)  
> Real MySQL 책
