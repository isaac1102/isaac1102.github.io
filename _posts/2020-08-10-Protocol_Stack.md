---
layout: post
title:  "Protocol Stack"
date:   2020-08-10 00:00:06
categories: NETWORK
tags: NETWORK
---
* content
{:toc}


# Protocol Stack    

## Internet  Protocol Stack
보내는 쪽과 받는 쪽의 서비스가 대응되기 때문에 5개의 레이어로 관리한다.
인터넷 프로토콜은 5가지의 계층을 가지고 있다.     

![](/../img/network_lecture/internet_protocol.png)     

1. application layer(응용계층)    
supporting network applications    
우리가 인터넷을 사용하기 위해서 쓰는 애플리케이션, 응용 프로그램들.      
	- FTP, SMTP, HTTP    
2. transport layer(전송계층)     
패킷을 목적지까지 안전하게 전달하는 계층     
	- TCP, UDP    
3. network layer     
보내는 소스에서부터 목적지까지 길을 찾아주는 계층

4.  link layer     
source to dest의 과정에서 하나의 호스트와 다음 호스트 간에 데이터를 전송하는 일을 담당
	- IP, routing protocols    
	- 홉과 홉사이에서 데이터를 맡음. (길 자체를 결정하는 것은 network layer)

5. physical layer    
각 케이블에서의 비트 정보를 어떤 식을 처리할 지 결정
- 무선의 경우 어떤 식으로 송식하고 받을 것인가를 결정    


## OSI-7 layer(Open System InterConnection)
ISO(International Standard Oraganization)에서 국제표준으로 OSI-7 layer를 결정.
모든 프로토콜이 이 표준을 따르면 네트워크 접속이 가능하다는 의미.
Internet  Protocol Stack에서 2가지 추가됨. (presentation layer, session layer)
이 두가지가 Internet  Protocol Stack에 없는 것이 아니며, 이 두가지가 application layer에 포함됨.
Internet  Protocol Stack이 더 먼저 만들어졌으며 후에, OSI-7 layer가 더 세분화 됐다. 
Open이기에 개방형을 쓰러면 이 rule을 따라야 함. (기관에서 쓰는 close가 아님)     

![](/../img/network_lecture/osi7layer.png)    



- presentation lyear
	- 암호화, 압축, 인코딩 등 데이터를 어떤식으로 부호화할 것인지 결정    
- session layer
	- transport레이터, 연결을 관리해주는 역할     
	- 데이터 동기화, 연결 관리 등
	
	
## 레이어를 왜 만들었을까?
> 레이어를 만들어서 각 서비스를 모듈화 해두면, 각 기술자들은 자신의 모듈만을 잘 개발하고 관리/수정하면 된다.        


## Encapsulation    
source to dest 전송 프로세스
![](/../img/network_lecture/protocol_process.png)    

예) 
1. application 계층에서 메시지를 transport계층에 메시지를 내려준다.
2. transport 계층은 데이터 전송을 위해 필요한 정보를(TCP segment or UDP segment) 헤더에 추가하고 network 계층으로 내려보낸다. 
3. network 계층은 목적지까지 필요하나 제어정보를(목적지 주소, ip datagram) 헤더에 추가하고 link계층으로 내려보낸다.
4. link 계층을 대표하는 이더넷 주소를 헤더에 추가(이더넷 프레임)하여 물리계층으로 보낸다. 
5. 각 계층의 헤더가 붙어서 physical 계층(유선, 무선)을 통해서 전송이 된다.
6. 전송 중에 interconnection device를 통한다.(switch, router)
7. switch는 link계층까지만 동작한다. (link 계층의 정보만 이용)
8. router는 network계층까지 동작한다.(network계층 정보까지 이용)
9. 목적지 컴퓨터는 피지컬, 링크, 네트워크, 트랜스포트, 애플리케이션의 각각 정보를 이용해서 원래 소스가 보내고자 했던 메세지와 동일한 메시지만을 이쪽 상위 애플리케이션에 전달한다.      


애플리케이션 프로그램은 밑에서 어떤 일이 일어나는지 전혀 알지 못하며, 어떤 헤더가 붙는지 알지 못한다.     
> 이것을 Encapsulation, 캡슐화한다고 부른다.





