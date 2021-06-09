---
layout: post
title:  "MySQL Replication으로 부하 분산하기(작성중)"
date:   2021-06-08 23:31:01
categories: DataBase MySQL
tags: DataBase MySQL
comments: 1
---
스마트 스토어 구현 프로젝트를 진행하면서 가장 많이 고려하는 점은 대용량 트래픽 환경에서 어플리케이션의 성능을 안정적으로 유지할 수 있는가였습니다.<br>  
이를 위해 웹서버의 __Scale-up__ 이나 __Scale-Out__ 을 통해 서버의 처리용량을 확장하는 방법에 대해서도 알아봤었고, `L4`를 통한 로드밸런싱에 대해서도 정리해 봤습니다. 
이번에는 DB서버에 가해지는 부하를 다루는 방법의 일환으로 `Replication`을 사용하는 방법에 대해서 알아보겠습니다. 
이 프로젝트에서 사용한 DB는 `MySQL`이므로 `MySQL`을 기준으로 알아보았습니다. <br> 
 <br> 
`MySQL`을 이중화하기 위해서는 기본적으로 2개 이상의 MySQL서비스가 실행되어야 합니다. (이 부분에 대한 내용은 생략하겠습니다😐)<br> 
<br> 
__설정준비__   
MySQL서버 복제를 구축하기 위해서는 중복되지 않는 __server-id값__ 을 가지고 있어야 하고, Master 서버는 __바이너리 로그__ 가 활성화 돼 있어야 합니다. 
[https://www.44bits.io/ko/post/wsl2-install-and-basic-usage](https://www.44bits.io/ko/post/wsl2-install-and-basic-usage)

>참고자료 
>- 『Real MySQL』
>- [https://gangnam-americano.tistory.com/12](https://gangnam-americano.tistory.com/12)
>- [http://cloudrain21.com/mysql-replication](http://cloudrain21.com/mysql-replication)
>- [https://server-talk.tistory.com/240](https://server-talk.tistory.com/240)
>- https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=amcc&logNo=221340672465
