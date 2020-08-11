---
layout: post
title:  "Web and HTTP"
date:   2020-08-11 00:09:17
categories: NETWORK
tags: NETWORK
---
* content
{:toc}
 
## 월드 와이드 웹(world wide web)
- 팀 버너스 리(Tim Berners-Lee)가 1990년에 처음 제안하여 제작.
![](/../img//network_lecture/webPage.png){: width="500", height="700"}  
- 웹 페이지를 쭉 보시면 웹 페이지들은 이렇게 텍스트들도 있고 그림들도 있고 여러가지들이 섞여 있음. 이런 텍스트 파일이나 그림 같은 이런 것들을 우리가 오브젝트(objects)라고 부른다. (문서, jpeg, 자바코드, 오디오 데이터 등) 
- 웹 페이지는  HTML이라는 프로그램 언어로 기술 된다.
- 각각의 오브젝트들은 URL, Uniform Resource Locator(얻으려고 하는 데이터, 자원이 어디에 위치 해 있는가를 정확한 규칙에 따라서 표현)을 통해서 접근한다.
- HTML언어와 데이터를 주고 받는 프로토콜을 HTTP(HyperText Transfer Protocol)라고 한다.
- *하이퍼링크(Hyperlink)*    
: 하이퍼링크는 이것을 마우스로 클릭 했을 때 이것을 따라서 어딘가로 이동 할 때, 클릭을 함으로써 특정한 데이터를 읽어 올 수 있는 링크를 말한다.
- 하이퍼텍스트를 전달 하는 프로토콜이라고 해서 HTTP라고 부른다.

> 웹 프로그램은 데이터 로스가 일어나서는 안되기 때문에 하부의 TCP 프로토콜을 사용한다.    

![](/../img/network_lecture/tcp.png)   
- TCP 프로토콜을 통해서 데이터를 전달하기 위해서는 먼저 TCP 연결을 설정해야 한다.
- 우리가 HTTP, 웹 브라우저를 통해서 어느 웹 서버에 접속하고자 하면 우리 눈에는 보이지 않지만 그 밑의 트랜스포트 레이어 계층에서는 TCP가 동작을 하고 TCP는 다시 네트워크 레이어를 거치고 데이터 링크 레이어를 거쳐서 물리단을 거쳐 이렇게 통신을 하게 된다.
- 연결 된 TCP 커넥션 위로 HTTP 메세지, request message와 reponse message가 교환 된다.     
<br>
![](/../img/network_lecture/tcp2.png)   
- 만약에 어떤 서버에 접속을 하겠다 해서 HTTP 명령을 날리면 HTTP 명령이 처음부터 날아가는 것이 아니라 먼저 TCP 연결을 수립 한다. 
- TCP 연결을 수립 하기 위해서 어느 정도 TCP 연결 요청 메세지가 전달 되기 위한 시간이 필요하게 되고, 그 이후에 HTTP request message가 전달이 되겠고요 그 다음에 그에 맞춰서 reponse가 전달 되겠고 필요한 파일을 요구 했으면 그 파일을 전송 하는 데 또 시간이 걸릴 것이다. 
- 그래서 전체적으로 HTTP response time, 내가 request를 보내고 reponse를 받는 데 까지 시간을 따져 보면 이렇게 TCP 연결을 먼저 수립 하기 위해서 하나의 Round-Trip-Time. 1RTT가 필요하다.   
- 다음에 간단한 request와 response가 오는 데 1RTT가 필요하고, 파일 전송을 요구를 했다고 하면 파일 용량이 크다고 하면 파일을 전송하는 시간 만큼이 같이 필요하다.    

 