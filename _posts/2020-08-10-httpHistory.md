---
layout: post
title:  "HTTP's History"
date:   2020-08-11 00:13:50
categories: NETWORK
tags: NETWORK
---
* content
{:toc}
 
# HTTP Protocol Version
<br>
##### **그림을 먼저 대충 훍어보자** 
![](/../img/network_lecture/httpHistory.png)   
### HTTP/1 - 1996's    ( Non-pesisten HTTP였다. )
- 그 전에 0.9도 있었지만 그것을 무시하고 1996년의 HTTP/1부터 인정하며 1999년에 1.1 버전이 나왔고 2015년에 HTTP/2.0 버전이 나왔다.
- HTTP request와 reponse를 받기 위해서는 TCP 연결을 먼저 수립해야 하는데 하나의 웹 페이지에 보면 여러 개의 오브젝트들이 존재 할 수 있다. (텍스트, 이미지, 동영상 등..)    
- 이 하나하나의 오브젝트들을 전달 하는데 있어서 TCP 연결이 각각 하나씩 필요했다는 것이다.   
- 차례차례 TCP 연결을 수립 하고 HTTP reponse를 받고, 또 다시 TCP 연결 수립을 하고 HTTP 메세지를 주고 받고 이렇게 순차적으로 진행이 되어야 하기 때문에
전체적으로 지연시간이 매우 길었다. 
- 이런 문제점 때문에 1.1 버전이 나왔다.

###  HTTP/1.1 - 1999's  (persistent하게 변경했다.)
- 1.1 버전은 persistent, 번역 하면 지속적이라는 의미.
- TCP 연결을 한 번 수립하면 앞선 경우처럼 하나의 오브젝트에서 주고 받고가 끝나는 것이 아니라 여러 개의 오브젝트들을 전달 받을 수 있게 됐다.
- 그렇게 함으로써 전체적으로 지연시간을 줄일 수 있었다고 한다. 

###  HTTP/2 - 2015's  
- 구글에서 먼저 GOOGLE SPDY라는 이름으로 새로운 HTTP에 대해 연구를 하다가 이것이 표준화 되면서 이 버전 번호를 받은 것인데, 여기도 보면 persistent HTTP이다.
- 1.1버전과 비교했을 때, 여러 쌍의 HTTP reponse와 request가 하나의 TCP 연결을 사용 할 수 있는 것은 1.1 버전이나 2 버전이나 공통점인데,   reqeust와 response의 페어(pair)가 1.1 버전은 synchronous order를 가지고 2 버전은 asynchronous order를 허용한다.   
     
    
|synchronous order|asynchronous order|
| ------------- | -------------- |
| request가 간 순서대로 response가 온다    |  순서와 상관없다.(parallel하다.)    |     
    
	   
<br>
 ![](/../img/network_lecture/httpHistory2.png)   
- HTTP/1에서는 하나 하나의 request가 가고 response가 오기 위해서 TCP 연결이 모든 연결에 대해서 따로따로 만들어 져야 한다.
- 1.1에서는 request 여러 개가 하나의 TCP 연결을 사용 할 수 있는데 그래도 날아오고 날아가는 순서가 항상 일치 해야 한다.
- 반면에 HTTP/2에서는 순서 없이 쭉 날아 간다. 하나의 페이지 안에 여러 가지 오브젝트가 있다면 이 오브젝트들을 한꺼번에 요청 할 수 있다.
- 어떤 순서로 와도 상관 없이 한꺼번에 parallel하게 날아올 수 있다는 것이다. 그렇게 해서 전체적으로 지연시간을 짧게 만드는 효과가 있는 것이다.
   
   
<br>   