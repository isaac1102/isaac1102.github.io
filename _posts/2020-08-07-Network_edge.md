---
layout: post
title:  "Network edge"
date:   2020-08-07 00:00:02
categories: NETWORK
tags: NETWORK
---
* content
{:toc}

# network edge
- 네트워크의 말단 부분으로서 사용자들이 존재하고 있는, 직접 접하는 네트워크를 말함
- host : client와 server로 구성(hw적인 요소들)
- servers
	
## network core
- 엣지 네트워크를 서로 연결해주기 위한 것
- rowters and switches들이 있다.
	
### access network
- 엔드 시스템들을 라우터에 연결하는 것들을 라고 한다.
- 사용자 - 엔드 시스템 - access network - network core로 이어진다.
	
#### residential access nets       
1. Digital substriber line(DSL)
- 기존의 전화망을 사용하는 네트워크
- 전화는 4khz 이내에서 전달함. 
- 4khz이상의 고주파를 데이터를 전달하는 데에 사용함. 
- spliter를 통해서, 전화와 컴퓨터의 데이터의 서로 다른 데이터를 구분하여 전달한다. 
- 전화국에 있는 DSL access multiplexer가 두 개의 파형을 분리. 
- 4kHz이하는 전화망, 그 이상은 컴퓨터 데이터로 인터넷으로 보내서 사용
- 최초의 가정에서 인터넷을 사용한 형태
			
2. Cable network
- 케이블 회사에서 전체 사용하는 채널에서 서로 다른 파형을 갖는 채널을 나누어서 데이터를 전달함. 
- 이중에 일부를 데이터 전달을 위한 채널로 사용하는 것.
- 매체만 다를 뿐 DSL과 비슷함
3. Fiber - to - the - Home( FTTH)
- 집 앞까지 광케이블이 깔리는 것. 요즘 가장 일반적. 
- dsl이나 cable보다 더 빠르며 데이터양을 많이 전달.
- 아파트 단지에 optical network terminal을 통해서 집 밖에까지는 광 케이블, 이후부터는 전자의 흐름으로 데이터 형식으로 전달되도록 변화시켜준다. 
			
#### institutional access nets
- 일반적으로 기관 네트워크는 ethernet을 기반으로 함. 이더넷은 대부분 이더넷이라고 본다. 
- 각각의 컴퓨터를 이더넷 카드를 꽂고, 이더넷 스위치가 모아서 외부 라우터에 연결하는 형태. 
- 이더넷 스위치는 와이파이 방식으로도 가능. 
- 예전엔 10mbps, 100mbps정도 현재는 1Gbps, 10Gbps정도까지 발전
	
#### wireless access nets
- 무선에서 가장 많이 사용. WIFI라고 많이 부름
- 속도가 매우 기하급수적으로 증가.
- 예전에는 유선의 보조적 수단이지만 요즘에는 엄청 많이 사용
		
#### Cellular network
- 3g, 4g, 5g
- 1, 10, 100 Mbps
			
	
### End Host
- access network를 통해 인터넷 망에 접근.
- 각가 애플리케이션이 돌아가고 있음. 
- 애플리케이션들은 서로 데이터를 주고받음. 용량도 다양함. (영화, 음악, 텍스트.. 등등)
- 한꺼번에 데이터 전송하려면 중간에 에러날 시 데이터 전체를 못 쓸수도. 
- 너무 큰 파일을 보낼경우 에러확률 증가. 
- 네트워크마다 MTU(maximum transfer uni)을 통해서 전달할 수 있는 데이터 최대 크기를 정해둠.  mtu보다 용량이 크다면 잘게 나눠서 보내야 함.
- 이 잘게 나누는 단위를 패킷이라고 부름. 
- 보내는 입장에서는 허용 패킷 사이즈에 맞게 패킷을 잘라서 네트워크에 집어 넣고, 상대방 엔드 호스트에 도달하면 잘려 도착한 패킷들을 모아서 
- 하나의 완성된 데이터로 프로그램에 전달 이것이 엔드 호스트의 역할. 
- link transmission rate이 높을수록 데이터를 빨리 보낼 수 있음. (link capacity라고도 부름)
	
### Communication Link : Wired
#### twisted pair(쌍 꼬임선)
- 각 선의 전압차가 기준값보다 높으면 1이고 낮으면 0으로 판단함. (꼬아둔 이유는 외부영향이 양 선에 동일하게 받아서 같은 조건이 유지되기 위함)   

#### coaxial cable(동축 케이블)
- 같을 동에 축 축의 단어. 축이 같다. 
- 안쪽의 conductor, 바깥쪽 conductor
- 안쪽의 구리선이 데이터 전달, 바깥쪽의 구리선은 외부와의 노이즈를 차단. 
- 높은 bandwidth
- 데이터 폭 넓어서 여러 케이블tv 동시에볼 수 있음.

#### optical fiber(광섬유)
- 다른 선들처럼 전류가 아닌, 빛을 쏜다.
- 쌍꼬임, 동축에 비해서 1.5배의 전파속도
- 빛이라서 외부 노이즈 x, 에러 낮음. 속도 빠름
- 감쇠율도 낮음. 
