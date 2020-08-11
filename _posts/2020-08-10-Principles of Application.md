---
layout: post
title:  "Principles of Application"
date:   2020-08-10 00:00:07
categories: NETWORK
tags: NETWORK
---
* content
{:toc}

# Principles of Application

네트워크 응용 프로그램
- email: 네트웍 연결되면서 최초로 사용된 프로그램
- web(server, software, browser)
- P2P file sharing
- SNS
- messenger
- online-game
- streaming stored game


## 두 종류의 어플리케이션 구조

![](/../img/network_lecture/application_structure.png)        
### 1.클라이언트 서버 모델   
- 각 클라이언트는 서버에게 데이터를 요구하고 서버는 응답한다.    
- 서버가 유일하게 데이터를 제공하는 장치    
- 네트워크를 구성하는 나머지는 클라이언트로서 데이터를 소비하기만 한다.     
- 대부분의 웹 서비스가 이러하다.   
	   
#### **1)서버**     
- 서버가 항상 켜져 있어야 한다. (always-on)   
- 고정된 아이피가 있어야 한다.(permanent IP address) : 클라이언트가 매우 많은 요즘에는, 데이터센터라는 곳에서 서버를 중복해서 여러개 둬서 서비스한다.   
   
#### **2)클라이언트**   
- 서버와 통신하기 위한 프로그램   
- 사용자가 필요할 때만 접속. 간헐적으로 사용한다.   
- dynamic IP address여도 상관없다.   : 클라이언트가 먼저 데이터를 요청하면서 자신의 ip주소를 담아서 보내기 때문이다.   
- 클라이언트끼리 서로 통신하지 않는다.   
   
### 2. P2P-network   
- 모두가 소비자이지만, 모두가 제공자이기도 하다.   
- 특정한 하나의 서버가 존재하지 않는다.   
- 서로 직접적으로 연결되어 통신한다.   
- 서로 필요할 때만 접속하고, ip변경이 가능하다.   
- self scalability(확장성) : peer의 수가 늘어난다면 데이터 요구량도 늘어나지만 제공량도 늘어난다.   
<br>   
<br>   
   
# Application Layer Protocol   
: application layer에서 데이터를 주고받을 때 애플리케이션들이 이해 할 언어가 필요하다. 이런 것을 애플리케이션 레이어 프로토콜이라고 한다.   
## Network application protocol   
- request, response로 대화한다.   

1. message syntax(문법)   
- request, response에도 인간언어처럼 문법이 있다. 메시지 타입, 요구하는 데이터의 필드 등을 나타낼 수 있는데, 어떻게 늘어놓을지, 어떤 순서로 늘어놓을지, 몇byte로 명세할 것인지 등을 나타낸다.   
   
2. message semantics(의미)   
- 여기 담은 데이터가 실제로 무엇을 의미하는가. 어떻게 해석할 것인가   
   
3. message pragmatics(화용론, 말의 순서)
- 언제, 어떻게 이 데이터를 보내고 응답할 것인가.
	   
### Application Protocol   
1. Open Protocol   
- request/response 메시지를 만드는 법이 누구에게나 공개돼 있다. document에 따라서 자기 메시지를 작성하면 통신할 수 있다.   
- HTTP, SMTP   
2. Proprietary Protocol   
- 고유의 프로토콜을 가지고 있다. 어떤 식으로 프로토콜을 사용하는지 알 수 없다.   
- ex) skype   
   
   
## Requirements of Network Protocol
![](/../img/network_lecture/RequirementOfNetworkProtocol.png)    
   
   
>**이런 것들은 하위에 있는 인터넷 프로토콜 스텍 위에서 두번째, 트랜스포트 레이어 프로토콜이 data loss나 throughput에 대한 요구사항을 만족시켜준다.**   
   
   
# Transport Protocol Services   
- TCP와 UDP를 분류 해 보면 TCP에서 가장 중요한 것이 error control, 보내는 데이터의 에러가 없도록 해 준다는 것.
### 1. TCP
- Error Control : TCP같은 경우에 데이터를 받았을 때 에러가 있다, 검사를 해서 에러가 있다고 하면 재 전송을 요구해서 에러가 없어질 때 까지 전송을 요구해서 에러가 없는 데이터가 도착 했을 때 그 때 애플리케이션 레이어에 전달을 해 준다. 그래서 실제로는 네트워크 상에서 에러가 발생하더라도 트랜스포트 레이어 프로토콜의 TCP가 이 문제를 이미 다 해소 한 상태에서 애플리케이션 레이어에 전달을 해 주기 때문에 애플리케이션 레이어 프로토콜이 보기에는 에러가 전혀 없는 그런 통신처럼 보이는 것이다.
에러가 없기 때문에 우리가 이것을 신뢰성 있는 프로토콜이다 이렇게 이야기 합니다.
- flow control : 간단하게 말하면 sender가 receiver가 받을 수 없는 이상의, 받을 수 있는 용량 이상의 데이터를 한꺼번에 보내지 않도록 하는 것.   
- congestion control : 중간에 있는 인터넷 토킹 장비들, 라우터나 스위치에 데이터가 쌓이지 않도록 제어하는 것.    

TCP는 지연시간을 보장 해 준다던가 최소 전송량을 보장 해 준다던가 보안적인 security를 보장 해 준다던가 이런 것은 없다.
왜냐하면 TCP가 개발 될 당시에는 멀티미디어 데이터 자체가 없었기 때문이다. 멀티미디어 데이터 자체도 없었고 security에 대한 위험성도 전혀 감지하지 못했던 시절이기 때문에
애초에 TCP가 처음에 만들어 질 때에는 이런 것을 아예 고려하지 않았던 것이다.


### 2. UDP
- TCP하고 대비되는 것이 UDP인데, UDP는 TCP가 제공하는 error control이라던지 flow control, congestion control 이런 것을 제공하지 않는다.
그래서 unreliable하다.    
- 데이터가 깨지면 깨진 대로 애플리케이션 레이어에 전달을 해 줍니다.   
- UDP는 트랜스포트 레이어 프로토콜의 기본적인 기능을 수행. 
UDP는 굳이 왜 따로 두었을까. 
- 오디오나 비디오 같은 멀티미디어 데이터를 전달하는 네트워크 응용 같은 경우에 TCP를 사용하게 되면 에러가 발생했을 때 너무 긴 지연시간이 발생할 수 있다. 그런데 UDP는 에러가 있으면 있는 대로 넘겨 버리기 때문에 아까 말씀 드린 것 처럼 초당 30프레임 중에 한 두 프레임 에러가 났다, 또는 우리가 인터넷 전화를 하는 중에 한 두 문장 에러가 났다고 해서 지연 시간이 길어지거나 하는 것 없이 그냥 있는 그대로, 내가 받은 그대로 전달을 해 준다. 그래서 UDP는 TCP보다 전반적으로 속도가 빠른 특성이 있다. 그래서 응용 프로그램, 멀티미디어 프로그램에 적합한 것이다.   
   
   
   
>이메일이라던지 웹, 파일 전송 프로토콜들 SMTP, HTTP, FTP라고 불리는 이런 것들은 TCP를 사용한다.   
멀티미디어 데이터를 사용하는 응용 또는 인터넷 전화 같은 것을 사용하는 응용들에서는 과거에는 UDP를 주로 사용했었는데 요즘에 인터넷 환경이 좋아지고 contents provider network라는 것이 생겨서 서버들이 물리적으로 사용자들의 위치에 가까이 가게 되면서 TCP를 사용 해도 괜찮은 상황이 됐다.   
그래서 유튜브 같은 경우에는 TCP를 사용하기도 합니다만 기본적으로 멀티미디어 데이터들은 처음에 UDP를 사용해서 서비스 하는 것을 선호 했었다.