---
layout: post
title:  "HTTP Message"
date:   2020-08-11 00:14:36
categories: NETWORK
tags: NETWORK
---
* content
{:toc}
# HTTP Message 구조
<br>
##### **그림을 먼저 대충 훍어보자** 
![](/../img/network_lecture/httpMessage.png)   
### Message Format
1. method
- GET, POST, PUT, DELETE
- GET  :  오브젝트를 가져 오겠다는 것
- POST :  웹 페이지 검색 창 같은 것을 보면 데이터를 넣고 엔터를 치면 이 데이터가 날아감
- HEAD : 전체 데이터는 필요 없고 필요로 하는 오브젝트의 정보, 실제 데이터의 어떠한 것이라기 보다는 정보에 해당하는 것만 원할 때 사용.
- PUT : HTTP를 통해 서버에 파일을 넣음
- DELETE : HTTP를 통해 서버에 파일을 삭제
2. URL
3. HTTP version
- 1.1 버전, 2 버전 이런 버전을 여기에 쓴다.
4. header field name
- 어떠한 호스트에서 가져 오고 싶은가 이런 것들을 기록 하는, 여러가지 정보들이 담아진다. 
- 어떤 정보의 종류를 말 하고 그 정보의 값을 얘기하고 이런 식으로 쭉 나열이 되는 이런 구조인 것이죠
- 1.1 버전, 2 버전 이런 버전을 여기에 쓰는 것이고 다음에 . 
5. entiy body
- 실제 데이터, 파일을 전달해야 한다면 entiy body에 전달이 된다.

HTTP 상태 코드(RESPONSE CODE)
- 클라이언트의 요청을 어떤 식으로 처리 했는지 처리 결과를 나타냄
- 200 OK는 잘 처리 되었다는 뜻 
- 301 이것은 ‘네가 요구한 오브젝트는 다른 곳으로 옮겨졌고 그 오브젝트로 이동하겠다’ 하는 뜻 
- 400이라는 것은 ‘네가 요청한 request를 이해 하지 못하겠다는 뜻 정도로 이해하면 된다. 
- 404 라는 것은 ‘네가 요청한 request를 찾지 못했다. 없다’ 라는 것.
- 505는 ‘HTTP 버전이 달라서 너와 통신 할 수 없다’에 해당 하는 내용이다.

