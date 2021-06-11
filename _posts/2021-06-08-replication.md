---
layout: post
title:  "MySQL Replication으로 부하 분산하기(작성중)"
date:   2021-06-08 23:31:01
categories: DataBase MySQL
tags: DataBase MySQL
comments: 1
---


 [스마트 스토어 프로젝트](https://github.com/f-lab-edu/smart-store) 를 진행하면서 가장 많이 고민했던 부분은 __'어떻게 하면 대용량 트래픽 환경에서도 어플리케이션의 성능과 안정성을 유지할 수 있을까?'__ 였습니다. 서버성능을 안정적으로 유지하기 위해서는 서버에 가해지는 부하를 잘 관리해야 합니다. 부하관리가 제대로 되지 않는다면 사용자 요청에 대한 응답처리가 매우 지연될 것이고, 좋지 않은 서버성능은 사용자 경험에 악영향을 줄 것입니다. 사용자 감소는 곧 서비스 기업에게 비즈니스적으로 손해를 가져다 주겠죠. 😮
<br><br> 
서버성능을 높이기 위한 방법으로 서버의 확장, 즉 __`Scale-up`__ 이나 __`Scale-Out`__ 을 통한 서버의 처리용량을 확장하는 방법이 있었습니다. 
이번 글에서는 **DataBase서버**에 가해지는 부하를 다루는 방법의 일환으로 __`MySQL Replication`__ 을 사용하는 방법에 대해서 알아보겠습니다. 
<br><br> 
### DB서버(MySQL)를 이중화하는 이유   
서버에 병목을 주는 큰 요인 중의 하나가 DB서버의 응답지연입니다. 수많은 요청이 동시적으로 몰리게 되면, 빠른 시간 안에 응답처리를 해야 하지만 그렇지 못할 경우 병목구간이 생기게 됩니다. 병목의 원인은 여러가지겠지만, 대표적으로는 처리해야 할 데이터 양이 너무 많거나, 요청이 너무 많아서 먼저 온 요청이 끝나기까지 기다려야하는 상황 등이 있을 것이며 이것이 반복되고 누적된다면 병목이 생기고 서버성능저하로 이어지게 될 것입니다. 
<br> 
이런 맥락에서, DB서버의 부하분산은 고성능 어플리케이션을 위해서 꼭 필요한 요인이라고 생각합니다. 
<br> 
또한 서버를 이중화한다면 한 서버가 장애가 생기거나 데이터가 손상되는 상황이 오더라도, 다른 서버에 이미 데이터가 동기화 돼 있기 때문에 데이터가 안전한게 보존될 수 있고, `fail-over`를 통해 웹 어플리케이션의 고가용성을 확보할 수 있을 것입니다. 
<br> <br> 
이제 본격적으로 MySQL Replication에 대해서 알아보도록 하겠습니다. 

이 프로젝트에서 사용한 DB는 `MySQL`이므로 `MySQL`을 기준으로 알아보았습니다. <br> 
 <br> 
 ## 1. MySQL 서비스 2개 실행
`MySQL`을 이중화하기 위해서는 기본적으로 2개 이상의 MySQL서비스가 실행되어야 합니다. 
이 부분에 대한 내용은 아래의 블로그 글에 아주 잘 설명되어 있습니다. 😀<br> 
- [다수의 MySQL 서버실행을 위한 환경설정](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=amcc&logNo=221340672465)<br> 
- [MySQL 서비스 실행이 잘 안될때](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=amcc&logNo=221340672465)<br> 
docker를 통한 실행 방법도 있다고 하니 참고하시기 바랍니다. (하루빨리 docker를 학습해야겠습니다...ㅠㅠ)<br>  


<p style="align:center;">
    <img src="https://user-images.githubusercontent.com/37571052/121644408-ec824980-cacd-11eb-8e0a-fe5f7a88a76b.png"><br> 
 </p>
 <div style="text-align: center;">위의 과정들을 통해서 아래 사진처럼 포트가 다른 서비스를 두개 실행했습니다.</div>
 
<br> 

## 2. MySQL 설정


## 2. Spring 설정
>__참고자료__    
>- [https://gangnam-americano.tistory.com/12](https://gangnam-americano.tistory.com/12)
>- [http://cloudrain21.com/mysql-replication](http://cloudrain21.com/mysql-replication)
>- [https://server-talk.tistory.com/240](https://server-talk.tistory.com/240)
>- [Real MySQL](http://www.yes24.com/Product/Goods/6960931)
