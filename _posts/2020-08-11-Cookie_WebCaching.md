---
layout: post
title:  "쿠키와 웹 캐싱"
date:   2020-08-11 00:16:19
categories: NETWORK
tags: NETWORK
---
* content
{:toc}
   
**HTTP는 stateless이기 때문에 쿠키를 통해서 서버에서 상태를 인식한다.**

## COOKIE   

### Request와 Response를 통한 쿠키의 사용 
![](/../img/network_lecture/cookieandcaching.png)

1. ebay8734라는 쿠키 파일을 가지고 amazon server에 요청을 보낸다.  = HTTP Request message를 가지고 아마존 서버에 접속을 시도함.
2. 아마존 서버는 접속한 유저에 대한 임의의 ID를(예:1678) 할당한다. 그리고 DB에 저장한다.
3. response를 보낼 때, 2번에서 생성한 쿠키아이디 1678을 담아 set-cookie하고 전송한다.
4. response를 받은 클라이언트 브라우저는 set-cookie를 발견하면 자신의 쿠키파일에 이것을 저장한다. (쿠키 아이디 1678)
5. 다음번 아마존 접속 시, 내게 아마존 쿠키가 있는지 기록을 조회한다. 쿠키가 있을 시 쿠키 아이디를 같이 담아서 request message를 보낸다.
6. 아마존 서버는 request message에서 쿠키 아이디를 확인하고, 데이터베이스를 조회하여 이 사람의 이용기록에 관한 정보를 가져와서 보여준다.   

> 사용자의 스테이트를 서버가 유지하기 때문에 프라이버시를 침해할 수도 있다. 그래서 브라우저에서 쿠키 삭제기능을 제공한다.    


## Web Caching(Proxy Server)   
![](/../img/network_lecture/webcaching.png)   
   
   
네이버나, 구글 등의 사이트처럼 많은 이용자가 접속할 경우  request와 response가 클라이언트와 서버 사이를 계속 왔다 갔다 하려면 오버헤드가 굉장히 클 것이다.  그래서 중간에 **프록시 서버(proxy server)라는 것을 하나 두고** 운영하는 것이다.    

> 프록시 서버는 이용자의 최초 request를 origin server에 전달하여 response를 전달하고(client역할) 그 정보를 보관하고, 후에 동일한 request에 대하여는 origin server에 요청없이 저장된 정보를 response해주는 역할을 한다.(server 역할)    
<br>



### Web Caching의 장점
![](/../img/network_lecture/webcachiing2.png)      

#### client 측면   
- origin server까지 갈 필요가 없으니 응답시간이 빠르다   

#### server 측면   
- 프록시 서버가 없었다면 매번 request message를 받고 response해줘야 하지만, 프록시가 중간에서 처리해줘서 부하가 적다.    
- 같은 용량으로 더 많은 사용자에게 서비스를 할 수 있다.   

#### local network 운영 측면
- 로컬 네트워크를 운영하는 사람 입장에서 사실 local area network의 용량은 보통 충분하다.
- 인터넷을 사용하게 되면 요즘 용량이 기가 인터넷 해서 충분한데, 문제가 되는 것은 로컬 ISP에서 인터넷으로 연결되는 부분이다.
- Request가 계속 여기로 날아가고 response가 계속 날아오면 병목이 생길 수 있다. 
- 그럼 전체적으로 인터넷 서비스가 품질이 낮아지게 된다.
- 그런데 중간에 프록시 서버를 설치 해서 대부분의 request를 처리 하게 되면 외부 인터넷과 local area network를 연결 하는 이 링크의 용량을 쓸 필요가 없기 때문에 그래서 전체적으로 서비스가 원활해 지는 장점이 있다.
