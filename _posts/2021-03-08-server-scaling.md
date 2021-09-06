---
layout: post
title:  "서비스 이용자 수가 감당이 안될 때 서버를 어떻게 확장해야 할까?"
date:   2001-04-15 00:00:07
categories: SMARTSTORE
tags: SMARTSTORE
comments: 1
---
 
 [스마트스토어 프로젝트](https://github.com/f-lab-edu/smart-store)를 진행하면서 만약 내 서비스가 성공을 거두어서 동시 이용자수가 기하급수적으로 증가한다면 어떻게 될까? 라는 고민을 갖게 됐습니다. 정말 그런 일이 일어난다면 현재 개발환경(서버 1대)로 운영이 불가능할 것입니다. 그리고 서버가 터지면 아무도 사용자가 떠날 것입니다. 이런 문제들을 어떻게 해결할 수 있을 지 고민해 보고 정리했습니다.
<br>  
 
&nbsp;서버의 가용한 컴퓨팅 자원이 부족한 상황이 온다면 고려해야 할 것은 서버의 확장(`Server Scaling`)입니다. <br>  


> scalability ; 범위성(範圍性) <br> 
정보기술에서 말하는 범위성은 다음의 두 가지 용례를 가진다. <br><br>   1. 범위성은 컴퓨터 애플리케이션이나 제품 (하드웨어나 소프트웨어)이, 사용자의 요구에 맞추기 위해 크기나 용량을 변경해도, 그 기능이 계속하여 잘 동작할 수 있는 능력을 말한다. ...생략...<br><br>  2. 범위성이란 확장된 환경에서 기능이 잘 동작하는 것뿐 아니라, 실제로 그것의 이득을 최대한 누릴 수 있는 능력을 말한다. 예를 들면, 하나의 애플리케이션 프로그램이 작은 운영체계에서 크기가 더 큰 운영체계로 옮겨질 수 있고, 성능이라는 측면에서 대형 운영체계의 장점을 충분히 누릴 수 있고, 더 많은 수의 사용자들에게 서비스될 수 있다면, 그것은 범위성이 있다고 말할 수 있을 것이다. ...생략...
<p align="center">출처 http://www.terms.co.kr/scalability.htm</p>
<br>  
위의 정의에서 말하는 1번 정의를 보면 사용자의 요구에 맞추기 위해 크기나 용량을 변경해도, 그 기능이 계속하여 잘 동작할 수 있는 능력이라고 나옵니다. 또한 2번 정의에는 기능이 잘 동작하는 것뿐 아니라, 실제로 그것의 이득을 최대한 누릴 수 있는 능력이라고 나와 있습니다. 이 두가지 정의가 scalability를 가장 잘 표현하는 문장이라고 생각합니다.

1번과 2번을 합쳐서 한마디로 정리해보면 다음과 같습니다. 
> **사용자 요구에 맞춰 크기나 용량을 변경해도 그 기능이 계속해서 잘 동작할 뿐만 아니라, 그 확장된 만큼의 용량을 최대로 활용하는 것. **


그럼 이제 scalability를 실현하기 위한 서버 확장의 방법에는 어떤 것들이 있는지 알아보겠습니다. 
서버를 확장하는 방법에는 두가지가 있습니다. 
- Scale-up
- Scale-out

##### Scale-Up

__Scale Up (수직적 확장)__ 은 단일 서버의 성능을 높여서 더 많은 요청을 처리할 수 있도록 하는 것입니다. 주로 성능이나 용량에 관련된 CPU나 RAM을 업그레이드하고 디스크를 추가하여 개선합니다.  

<p style="align=center;">
  <img src="https://user-images.githubusercontent.com/37571052/121654195-6f100680-cad8-11eb-873e-4805a92eb06c.png" style="width=600px;" >
</p>  
Scale Up은 비교적 쉽고, 실행하기 쉬운 방법입니다. 그리고 한 대의 서버가 모든 데이터를 처리하기 때문에 데이터 갱신이 빈번히 일어나는 경우에 적합합니다. 

아래과 같은 경우 Scale Up을 진행하기에 적합하다고 볼 수 있습니다. 

- 정합성 유지가 어려운 경우
- 온라인 트랜잭션 처리(OTLP)
- DB서버

**Scalel Up의 장점**은 구현과 설계가 쉬우며,  서버를 추가하지 않기 때문에 정합성 이슈에서 자유로운 점입니다. 그리고 한 대의 서버이기 때문에 추가적인 소프트웨어 라이센스 비용을 줄일 수 있습니다.  

**Scalel Up의 단점은** 서버를 업그레이드하는 데에는 분명한 한계가 있다는 것입니다. 최고 수준의 서버를 사용하더라도 그 이상의 성능이 필요할 경우에는 대처하기가 어렵습니다. 또한 일정 수준 이상의 업그레이드부터는 비용대비 효과가 미미하기 때문에 비용대비 효과가 낮을 수 있습니다.  

**가장 큰 취약점**으로 하나의 서버가 모든 요청을 처리하기 때문에 한 서버에 문제가 생길경우 서비스가 중지되는 상황이 발생할 수 있습니다. 서비스 기업에게 있어서 서비스 중단은 규모가 클수록 막대한 수익손실과 사용자 이탈로 이어질 수 있기 때문에 막대한 비즈니스 손실로 이어질 수 있습니다. 

 
##### Scale-Out
이번에는 **Scale Out**에 대해 이야기 해보겠습니다.

__Scale Out(수평적 확장)__ 은 현재서버의 성능과 비슷하거나 더 저사양의 서버를 추가하여 접속된 서버의 대수를 늘려 처리 능력을 향상시키는 것입니다. 이 방법을 통해 여러 대의 서버를 병렬적으로 사용하여 클라이언트의 요청을 여러 서버에 분산하여 처리할 수 있습니다. scale up에 비해서 인프라 재구성이 유연한 방법이라고 볼 수 있겠습니다. 

<p style="align=center;">
  <img src="https://user-images.githubusercontent.com/37571052/121654557-cf9f4380-cad8-11eb-9396-6cb616df46cf.png" style="width=600px;" >
</p>  
 
아래와 같은 조건이라면 Scale out을 고려하는 것이 좋겠습니다. 

- 높은 병렬성이 용이한 경우
- 정합성 유지가 쉬운 경우
- 웹 서버

**Scale Out의 장점**<br> 

서버를 추가하는 방식이기 때문에 성능 확장의 제한이 적은 편입니다.  그리고 여러 서버를 병렬적으로 운영하며 요청을 분산하기 때문에 장애 가능성이 감소합니다. 또한 고사양의 서버가 아닌 비슷한 수준의 서버를 도입하기 때문에 Scale Up에 비하여 비용이 저렴할 수 있습니다. 하지만 소프트웨어 라이센스 비용은 Scale up에 비하여 좀 더 들 수도 있겠습니다.

**Scale Out의 단점**<br> 
여러 대의 서버 관리로 인한 인적 리소스와, 라이센스 비용 등이 증가합니다.  각 서버별 데이터의 정합성을 관리해야하기 때문에 설계와 운영이 복잡할 수 있으며, 정합성 이슈가 발생할 수 있습니다. 또한 병렬 컴퓨팅 환경 구성, 로드 밸런싱에 대한 높은 기술적 이해가 필요하며, 세션, 웹 이미지 등의 데이터 공유방식에 대한 기술적 한계가 있을 수 있습니다. 

##### 어떤 방식을 택해야 할까?

 현재 개발중인 스마트스토어 프로젝트가 실제 회사에서 서비스되는 상황이라고 가정하고 어떤 방식이 알맞을 지 고민해보았습니다. 글의 초반부에 말한 가정대로 이 서비스가 대박을 쳐서 이용자 수가 증가하여 대용량 트래픽이 발생한 상황에서 Scale-Up방식으로 서버용량을 확장했을 경우를 생각해 보겠습니다. 

 결론적으로 말씀드리자면 저라면 Scale-Out 방식이 적합하다고 생각합니다. 

Scale-Up의 경우 장애가 발생하면 오직 한 대의 서버로 서비스를 운영하기 때문에, 대체할 서버가 없게 되고 서비스 자체가 중단이 될 것입니다. 그리고  그 시간동안 수익을 낼 수 없게 되어 회사에 큰 손해를 입힐 것이라고 생각합니다. 

 그리고 서비스 회사에서 성장 가능성을 누구도 쉽게 예측할 수 없다는 점도 Scale-out을 선택한 근거입니다. Scale-up방식으로 서버를 확장했는데 서버가용 용량이 다 찼음에도 확장이 불가한 상황이라면, 그것또한 회사가 성장하고 수익을 내는 데에 큰 걸림돌이 될 것이기 때문입니다. 
 <br> <br> <br> 
 
 >참고자료
 >- [https://medium.com/@OPTASY.com/scale-up-vs-scale-out-when-would-you-want-to-use-one-scaling-model-over-the-other-2f91b294c785](https://medium.com/@OPTASY.com/scale-up-vs-scale-out-when-would-you-want-to-use-one-scaling-model-over-the-other-2f91b294c785)
 >- [https://kils-log-of-develop.tistory.com/596](https://kils-log-of-develop.tistory.com/596)
 >- [https://hyuntaeknote.tistory.com/4?category=867120](https://hyuntaeknote.tistory.com/4?category=867120)
 >- [https://zdnet.co.kr/view/?no=00000039151294](https://zdnet.co.kr/view/?no=00000039151294)
 >- [https://www.itprotoday.com/storage/scale-vs-scale-out-storage-why-choose](https://www.itprotoday.com/storage/scale-vs-scale-out-storage-why-choose)
 >- [https://www.kdata.or.kr/info/info_04_view.html?field=&keyword=&type=techreport&page=13&dbnum=185192&mode=detail&type=techreport](https://www.kdata.or.kr/info/info_04_view.html?field=&keyword=&type=techreport&page=13&dbnum=185192&mode=detail&type=techreport)
