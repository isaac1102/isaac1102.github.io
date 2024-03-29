---
layout: post
title:  "서비스 이용자 수가 감당이 안될 때 서버를 어떻게 확장해야 할까?"
date:   2021-03-20 00:00:07
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
> 사용자 요구에 맞춰 크기나 용량을 변경해도 그 기능이 계속해서 잘 동작할 뿐만 아니라, 그 확장된 만큼의 용량을 최대로 활용하는 것. 


그럼 이제 scalability를 실현하기 위한 서버 확장의 방법에는 어떤 것들이 있는지 알아보겠습니다. 
서버를 확장하는 방법에는 두가지가 있습니다. 
- Scale-up
- Scale-out
<br> <br> 
##### Scale-Up

__Scale Up (수직적 확장)__ 은 단일 서버의 성능을 높여서 더 많은 요청을 처리할 수 있도록 하는 것입니다. 주로 성능이나 용량에 관련된 CPU나 RAM을 업그레이드하고 디스크를 추가하여 개선합니다.  

<p style="align=center;">
  <img src="https://user-images.githubusercontent.com/37571052/121654195-6f100680-cad8-11eb-873e-4805a92eb06c.png" style="width:100%;" >
</p>  
Scale Up은 비교적 쉽고, 실행하기 쉬운 방법입니다. 그리고 한 대의 서버가 모든 데이터를 처리하기 때문에 데이터 갱신이 빈번히 일어나는 경우에 적합합니다. 

아래과 같은 경우 Scale Up을 진행하기에 적합하다고 볼 수 있습니다. 

- 정합성 유지가 어려운 경우
- 온라인 트랜잭션 처리(OTLP)
- DB서버

**Scalel Up의 장점**은 구현과 설계가 쉬우며,  서버를 추가하지 않기 때문에 정합성 이슈에서 자유로운 점입니다. 그리고 한 대의 서버이기 때문에 추가적인 소프트웨어 라이센스 비용을 줄일 수 있습니다.  

**Scalel Up의 단점은** 서버를 업그레이드하는 데에는 분명한 한계가 있다는 것입니다. 최고 수준의 서버를 사용하더라도 그 이상의 성능이 필요할 경우에는 대처하기가 어렵습니다. 또한 일정 수준 이상의 업그레이드부터는 비용대비 효과가 미미하기 때문에 비용대비 효과가 낮을 수 있습니다.  

**가장 큰 취약점**으로 하나의 서버가 모든 요청을 처리하기 때문에 한 서버에 문제가 생길경우 서비스가 중지되는 상황이 발생할 수 있습니다. 서비스 기업에게 있어서 서비스 중단은 규모가 클수록 막대한 수익손실과 사용자 이탈로 이어질 수 있기 때문에 막대한 비즈니스 손실로 이어질 수 있습니다. 
<br> <br> 
 
##### Scale-Out
이번에는 **Scale Out**에 대해 이야기 해보겠습니다.

__Scale Out(수평적 확장)__ 은 현재서버의 성능과 비슷하거나 더 저사양의 서버를 추가하여 접속된 서버의 대수를 늘려 처리 능력을 향상시키는 것입니다. 이 방법을 통해 여러 대의 서버를 병렬적으로 사용하여 클라이언트의 요청을 여러 서버에 분산하여 처리할 수 있습니다. scale up에 비해서 인프라 재구성이 유연한 방법이라고 볼 수 있겠습니다. 

<p style="align=center;">
  <img src="https://user-images.githubusercontent.com/37571052/121654557-cf9f4380-cad8-11eb-9396-6cb616df46cf.png" style="width:100%;" >
</p>  
 
아래와 같은 조건이라면 Scale out을 고려하는 것이 좋겠습니다. 

- 높은 병렬성이 용이한 경우
- 정합성 유지가 쉬운 경우
- 웹 서버

**Scale Out의 장점**<br> 

서버를 추가하는 방식이기 때문에 성능 확장의 제한이 적은 편입니다.  그리고 여러 서버를 병렬적으로 운영하며 요청을 분산하기 때문에 장애에 대처에 유리합니다. 메인 서버에 장애가 발생했을 경우, fail-over하여 다른 서버에게 메인서버 역할을 하게 할 수 있습니다. 또한 고사양의 서버가 아닌 비슷한 수준의 서버를 도입하기 때문에 Scale Up에 비하여 비용이 저렴할 수 있습니다. 하지만 소프트웨어 라이센스 비용은 Scale up에 비하여 좀 더 들 수도 있겠습니다.

**Scale Out의 단점**<br> 
여러 대의 서버 관리로 인한 인적 리소스와, 라이센스 비용 등이 증가합니다.  각 서버별 데이터의 정합성을 관리해야하기 때문에 설계와 운영이 복잡할 수 있으며, 정합성 이슈가 발생할 수 있습니다. 또한 병렬 컴퓨팅 환경 구성, 로드 밸런싱에 대한 높은 기술적 이해가 필요하며, 세션, 웹 이미지 등의 데이터 공유방식에 대한 기술적 한계가 있을 수 있습니다. 
<br> <br> <br> 

##### 어떤 방식을 택해야 할까?

 현재 개발중인 스마트스토어 프로젝트가 실제 회사에서 서비스되는 상황이라고 가정하고 어떤 방식이 알맞을 지 고민해보았습니다. 
 결론부터 말씀드리자면 저는  Scale-out이 적합하다고 판단했습니다. <br> 
 
 **이유1**<br> 
 먼저 스마트스토어의 경우 가장 많은 트래픽이 일어나는 기능은 상품목록, 상품조회 기능이라고 생각하는데, 그렇다면 데이터 조회가 대부분이기 때문에 처리시간이 긴 트랜잭션보다는,  짧은 트랜잭션 요청이 많을 것입니다. 연산의 과정이 복잡하고 트랜잭션이 긴 요청이 많다면 CPU 사용량이 많을 것이기 때문에 서버의 사양을 올리는 Scale-up이 적합하겠지만, 스마트스토어의 경우 트랜잭션 길이가 짧은 조회 요청이 많을 것으로 예상되기 때문에 CPU사용량 보다는 물리적 컴퓨팅 리소스 자원 자체를 증가시켜서 부하를 분배하는 Scale-out이 적합할 것으로 생각합니다.
<br> 
<br> 
**이유2**<br> 
&nbsp; Scale-Up의 경우 장애가 발생하면 오직 한 대의 서버로 서비스를 운영하기 때문에, 문제가 생길 시 대체할 서버가 없을 수도 있고 만약 그로인해 서비스 자체가 중단이 된다면 경제적으로 큰 손실이 올 것입니다. 서비스 중단까지는 가지 않더라도 많은 수의 요청으로 인해 사용자의 대기시간이 늘어날 경우 사용자들은 다른 플랫폼으로 옮길 가능성이 큽니다.<br> 
 하지만 Scale-out은 fail-over가 가능하기 때문에 메인 서버에 장애가 발생하더라도 다른 서버로 기능을 대체할 수 있습니다. 이로 인해서 사용자들은 장애를 느끼지 못하고 동일한 환경에서 기능을 사용할 수 있을 것입니다. 
<br> 
<br> 
**이유3**<br> 
  서비스 회사에서 성장 가능성을 누구도 쉽게 예측할 수 없다는 점도 Scale-out을 선택한 근거입니다. Scale-up방식으로 서버를 업그레이드 했는데 서버의 리소스가 부족한 상황이 온다면 더이상 방법이 없기 때문입니다. 서비스의 성장의 가능성을 예측하기란 쉽지가 않지만 Scale-out방식이라면 서비스가 성장해 나감에 따라서 서버를 추가하기에 훨씬 용이할 것입니다. 
 <br> <br> <br>
 
 이렇게 스마트 스토어에는 Scale-out방식의 서버확장이 유리하다고 정리할 수 있었습니다. 하지만, 실제로 서버를 확장했을 때 발생할 수 있는 문제가 있습니다. <br> 
 서버에서는 사용자를 구분하는 방법으로 클라이언트와 세션정보를 주고받습니다. 보통 서버가 1대일 때는 1:1로 통신하기 때문에 세션 정보를 공유한든 데에는 큰 문제가 없지만, 서버가 여러 대일 경우에는 어떤 서버가 사용자와 세션정보를 교환했는지 확인이 필요하게 됩니다. 세션정보가 공유되지 않는 서버에 사용자가 연결된다면, 사용자는 세션이 유실된 것으로 처리되어 세션이 만료되고 다시 로그인을 해야하는 상황이 자주 발생할 것입니다. <br> 
 이러한 세션 공유 문제를 어떻게 해결할 수 있을지 다음 글에서 알아보도록 하겠습니다. <br> 
 긴 글 읽어주셔서 감사합니다. 
 
 
 
 >참고자료
 >- [https://medium.com/@OPTASY.com/scale-up-vs-scale-out-when-would-you-want-to-use-one-scaling-model-over-the-other-2f91b294c785](https://medium.com/@OPTASY.com/scale-up-vs-scale-out-when-would-you-want-to-use-one-scaling-model-over-the-other-2f91b294c785)
 >- [https://kils-log-of-develop.tistory.com/596](https://kils-log-of-develop.tistory.com/596)
 >- [https://hyuntaeknote.tistory.com/4?category=867120](https://hyuntaeknote.tistory.com/4?category=867120)
 >- [https://zdnet.co.kr/view/?no=00000039151294](https://zdnet.co.kr/view/?no=00000039151294)
 >- [https://www.itprotoday.com/storage/scale-vs-scale-out-storage-why-choose](https://www.itprotoday.com/storage/scale-vs-scale-out-storage-why-choose)
 >- [https://www.kdata.or.kr/info/info_04_view.html?field=&keyword=&type=techreport&page=13&dbnum=185192&mode=detail&type=techreport](https://www.kdata.or.kr/info/info_04_view.html?field=&keyword=&type=techreport&page=13&dbnum=185192&mode=detail&type=techreport)
